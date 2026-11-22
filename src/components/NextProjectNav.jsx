import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NextProjectNav({ project, origin }) {
  const [hovering, setHovering] = useState(false);
  if (!project) return null;

  return (
    <div className="relative" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <Link
        to={`/project/${project.id}`}
        state={{ from: origin }}
        data-hover
        className="inline-flex items-center gap-2 font-mono uppercase text-sm text-white/60 hover:text-[#FFEB3B] transition-colors"
      >
        Next Project <ArrowRight size={16} />
      </Link>

      <AnimatePresence>
        {hovering && (
          <motion.div
            initial={{ opacity: 0, y: -8, x: 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-3 w-56 border-4 border-white bg-[#111] shadow-hard overflow-hidden z-30 pointer-events-none"
          >
            <div className="relative aspect-video overflow-hidden">
              <motion.img
                src={project.cover_image}
                alt={project.title}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1.15 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 font-heading uppercase text-lg leading-tight border-t-4 border-white">
              {project.title}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}