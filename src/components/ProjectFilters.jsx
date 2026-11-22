import React from "react";
import { X } from "lucide-react";
import MultiSelectFilter from "@/components/MultiSelectFilter";

export default function ProjectFilters({ years, roles, genres, filters, setFilters, sort, setSort, onClearAll }) {
  const selectClass = "bg-[#111] border-2 border-white text-white px-3 py-2 font-mono uppercase text-xs";

  const toggle = (cat, val) =>
    setFilters((f) => {
      const arr = f[cat] || [];
      return { ...f, [cat]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });

  const hasActive = filters.year.length > 0 || filters.role.length > 0 || filters.genre.length > 0;

  const activeTags = [
    ...filters.year.map((v) => ({ cat: "year", v })),
    ...filters.genre.map((v) => ({ cat: "genre", v })),
    ...filters.role.map((v) => ({ cat: "role", v })),
  ];

  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <MultiSelectFilter label="Years" options={years.map(String)} selected={filters.year} onToggle={(v) => toggle("year", v)} />
          <MultiSelectFilter label="Genres" options={genres} selected={filters.genre} onToggle={(v) => toggle("genre", v)} />
          <MultiSelectFilter label="Roles" options={roles} selected={filters.role} onToggle={(v) => toggle("role", v)} />
        </div>

        <div className="flex items-center gap-3 shrink-0 md:self-start">
          {hasActive && (
            <button
              type="button"
              data-hover
              onClick={onClearAll}
              className="inline-flex items-center gap-1 font-mono uppercase text-xs text-[#FF3CAC] underline hover:text-white"
            >
              <X size={12} /> Clear
            </button>
          )}
          <select value={sort} onChange={(e) => setSort(e.target.value)} data-hover className={selectClass} aria-label="Sort projects">
            <option value="default">Default Order</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Alphabetical (A–Z)</option>
            <option value="za">Alphabetical (Z–A)</option>
          </select>
        </div>
      </div>

      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeTags.map(({ cat, v }) => (
            <button
              key={`${cat}-${v}`}
              type="button"
              data-hover
              onClick={() => toggle(cat, v)}
              className="border border-white/30 px-3 py-1 font-mono uppercase text-xs flex items-center gap-1.5 text-white hover:border-white"
            >
              {v} <X size={12} className="text-[#FF3CAC]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}