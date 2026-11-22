import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchPublishedProjects } from "@/lib/projects";
import QuickGlanceCard from "@/components/QuickGlanceCard";
import InteractiveBackground from "@/components/InteractiveBackground";

const EASE = [0.22, 1, 0.36, 1];

// Quick Glance is now a compact project grid — an alternative, denser way to
// browse the Archive. It reuses the same project collection + ordering
// (fetchPublishedProjects, display_order) as the Archive, so it is never
// randomized and new projects appear automatically. Cards are a compact
// variant of the project card; admin-set quick_glance_size gives some projects
// a larger footprint for a curated, masonry-style wall.
export default function QuickGlance() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  // Preserve scroll position across visits so returning "Back" lands where the user left off.
  useEffect(() => {
    if (loading) return;
    const saved = sessionStorage.getItem("qg_scroll_pos");
    if (saved) window.scrollTo({ top: parseInt(saved, 10), behavior: "instant" });
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => sessionStorage.setItem("qg_scroll_pos", String(window.scrollY));
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <InteractiveBackground particleCount={14} />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 py-24">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-heading uppercase font-extrabold text-5xl md:text-7xl tracking-tight mb-3 text-center"
        >
          Quick <span className="text-[#FF3CAC]">Glance</span>
        </motion.h1>
        <p className="text-white/60 text-center max-w-[60ch] mx-auto mb-12 font-mono text-xs md:text-sm uppercase">
          The whole portfolio at a glance. Hover for details, click to open.
        </p>
        {loading ? (
          <div className="text-center py-24 font-mono uppercase text-white/50">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 font-mono uppercase text-white/50">No projects published yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[190px] lg:auto-rows-[220px] grid-flow-dense">
            {projects.map((p, i) => (
              <QuickGlanceCard key={p.id} project={p} index={i} size={p.quick_glance_size || "small"} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}