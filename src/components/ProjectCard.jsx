import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGameState } from "@/lib/GameStateContext";
import { toArray } from "@/lib/utils";

export default function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { isVisited } = useGameState();
  const visited = isVisited(project.id);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -12, y: px * 12 });
  };

  const colors = ["#FF3CAC", "#784BA0", "#2B86C5", "#FFEB3B"];
  const accent = colors[index % colors.length];

  return (
    <Link to={`/project/${project.id}`} state={{ from: "projects" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        className="group relative border-4 border-white bg-[#111] overflow-hidden transition-transform duration-150"
      >
        <div
          className="absolute -inset-0.5 -z-10 transition-transform duration-200 group-hover:translate-x-2 group-hover:translate-y-2"
          style={{ background: accent }}
        />
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={project.cover_image}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${visited ? "blur-0" : "blur-sm"}`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/80 border-t-4" style={{ borderColor: accent }}>
            <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest">
              <span style={{ color: accent }}>{toArray(project.genre).join(", ")}</span>
              <span className="text-white/60">· {project.year}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {(project.my_roles || []).slice(0, 3).map((r) => (
                <span key={r} className="border border-white/40 px-2 py-0.5 text-[10px] uppercase font-mono">{r}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t-4 border-white">
          <h3 className="font-heading uppercase text-3xl font-extrabold leading-none">{project.title}</h3>
          <p className="text-white/60 text-sm mt-2 line-clamp-2">{project.short_description}</p>
        </div>
      </motion.div>
    </Link>
  );
}