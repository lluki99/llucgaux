import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toArray } from "@/lib/utils";

const COLORS = ["#FF3CAC", "#784BA0", "#2B86C5", "#FFEB3B"];

// Deterministic grid footprint per admin-set Quick Glance size. The spans are
// constant across breakpoints; only the grid's column count changes responsively.
const SPAN_CLASS = {
  small: "col-span-1 row-span-1",
  medium: "col-span-2 row-span-1",
  large: "col-span-2 row-span-2",
};

const EASE = [0.22, 1, 0.36, 1];

// Compact variant of the project card for the Quick Glance grid. On Quick Glance
// only, cover images are always fully visible (no visited/unvisited blur) so the
// wall reads as an unobscured portfolio. Role tags sit at the BOTTOM of the card,
// immediately above the title (hover-revealed), anchored to the bottom strip so
// their position is identical for Small/Medium/Large cards.
export default function QuickGlanceCard({ project, index, size }) {
  const accent = COLORS[index % COLORS.length];
  const span = SPAN_CLASS[size] || SPAN_CLASS.small;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, ease: EASE, delay: (index % 6) * 0.04 }}
      className={`${span} min-h-0`}
    >
      <Link
        to={`/project/${project.id}`}
        state={{ from: "quick-glance" }}
        data-hover
        className="group relative block h-full border-4 border-white overflow-hidden shadow-[0_4px_0_rgba(255,255,255,0.12)] hover:shadow-[0_14px_30px_-8px_rgba(0,0,0,0.6)] transition-shadow duration-300"
      >
        <div
          className="absolute -inset-0.5 -z-10 transition-transform duration-200 group-hover:translate-x-1.5 group-hover:translate-y-1.5"
          style={{ background: accent }}
        />
        <div className="relative h-full w-full overflow-hidden">
          {/* Quick Glance: always unblurred — visited/unvisited state is ignored here. */}
          <img
            src={project.cover_image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300" />

          {/* Bottom strip: role tags (hover-revealed) immediately above the title,
              then genre/year meta. Anchored to the bottom for all card sizes. */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
            {(project.my_roles || []).length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {(project.my_roles || []).slice(0, 4).map((r) => (
                  <span key={r} className="border border-white/40 bg-black/55 px-1.5 py-0.5 text-[9px] uppercase font-mono">{r}</span>
                ))}
              </div>
            )}
            <h3 className="font-heading uppercase font-extrabold leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] text-lg md:text-2xl">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-[10px] uppercase tracking-widest mt-1">
              <span style={{ color: accent }}>{toArray(project.genre).join(", ")}</span>
              <span className="text-white/60">· {project.year}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}