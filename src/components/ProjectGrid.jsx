import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import ScrollReveal from "@/components/ScrollReveal";
import ProjectFilters from "@/components/ProjectFilters";
import Pagination from "@/components/Pagination";
import { useGameState } from "@/lib/GameStateContext";
import { toArray } from "@/lib/utils";

const DEFAULT_FILTERS = { year: [], role: [], genre: [] };
const PAGE_SIZE = 6;
const EASE = [0.22, 1, 0.36, 1];

export default function ProjectGrid({ projects }) {
  const { resetSignal } = useGameState();
  const [filters, setFilters] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("project_filters"));
      return saved || DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });
  const [sort, setSort] = useState(() => sessionStorage.getItem("project_sort") || "default");
  const [searchParams, setSearchParams] = useSearchParams();
  const containerRef = useRef(null);
  const [preserveMin, setPreserveMin] = useState(0);

  // Reset filters AND sorting whenever global progress is reset.
  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
    setSort("default");
  }, [resetSignal]);

  // Persist filters/sort so returning "Back" to the Archive restores them.
  useEffect(() => {
    sessionStorage.setItem("project_filters", JSON.stringify(filters));
  }, [filters]);
  useEffect(() => {
    sessionStorage.setItem("project_sort", sort);
  }, [sort]);

  const years = useMemo(
    () => [...new Set(projects.map((p) => p.year).filter(Boolean))].sort((a, b) => b - a),
    [projects]
  );
  const roles = useMemo(
    () => [...new Set(projects.flatMap((p) => p.my_roles || []))].sort(),
    [projects]
  );
  const genres = useMemo(
    () => [...new Set(projects.flatMap((p) => toArray(p.genre)))].sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    const result = projects.filter((p) => {
      if (filters.year.length && !filters.year.includes(String(p.year))) return false;
      if (filters.role.length && !(p.my_roles || []).some((r) => filters.role.includes(r))) return false;
      if (filters.genre.length && !toArray(p.genre).some((g) => filters.genre.includes(g))) return false;
      return true;
    });

    const sorted = [...result];
    if (sort === "newest") {
      sorted.sort((a, b) => (b.year || 0) - (a.year || 0) || (a.display_order || 0) - (b.display_order || 0));
    } else if (sort === "oldest") {
      sorted.sort((a, b) => (a.year || 0) - (b.year || 0) || (a.display_order || 0) - (b.display_order || 0));
    } else if (sort === "az") {
      sorted.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
    } else if (sort === "za") {
      sorted.sort((a, b) => String(b.title || "").localeCompare(String(a.title || "")));
    }
    return sorted;
  }, [projects, filters, sort]);

  if (!projects.length) {
    return (
      <div className="text-center py-24 font-mono uppercase text-white/50">No projects published yet.</div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Math.min(Math.max(1, isNaN(urlPage) ? 1 : urlPage), totalPages);

  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPage = () =>
    setSearchParams((prev) => {
      if (!prev.get("page")) return prev;
      const next = new URLSearchParams(prev);
      next.delete("page");
      return next;
    });

  const handleFiltersChange = (updater) => {
    setFilters(updater);
    resetPage();
  };
  const handleSortChange = (v) => {
    setSort(v);
    resetPage();
  };
  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSort("default");
    resetPage();
  };

  const handlePageChange = (toPage) => {
    const next = Math.min(Math.max(1, toPage), totalPages);
    if (next === currentPage) return;
    // Capture current grid height so the layout stays put during the transition.
    if (containerRef.current) setPreserveMin(containerRef.current.offsetHeight);
    setSearchParams((prev) => {
      const n = new URLSearchParams(prev);
      n.set("page", String(next));
      return n;
    });
    window.setTimeout(() => setPreserveMin(0), 320);
  };

  return (
    <section id="grid" className="max-w-[1400px] mx-auto px-4 md:px-8 py-24">
      <ScrollReveal>
        <h2 className="font-heading uppercase font-extrabold text-5xl md:text-7xl mb-8 tracking-tight">
          Archive <span className="text-[#784BA0]">Grid</span>
        </h2>
      </ScrollReveal>
      <ProjectFilters
        years={years}
        roles={roles}
        genres={genres}
        filters={filters}
        setFilters={handleFiltersChange}
        sort={sort}
        setSort={handleSortChange}
        onClearAll={handleClearAll}
      />

      {filtered.length ? (
        <div ref={containerRef} className="relative" style={{ minHeight: preserveMin || undefined }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
            >
              {pageItems.map((p, i) => (
                <ScrollReveal key={p.id} delay={(i % 2) * 0.08}>
                  <ProjectCard project={p} index={i} />
                </ScrollReveal>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 font-mono uppercase text-white/50">No projects match these filters.</div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </section>
  );
}