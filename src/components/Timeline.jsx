import React, { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const MILESTONES = [
  { year: "2026", title: "Diving Into Game Design", detail: "Focusing on game design while further developing other skills" },
  { year: "2025", title: "Master In Games at the Royal Danish Academy", detail: "Started studying video game design and building up prototypes" },
  { year: "2024", title: "First Video Game Collab", detail: "Collaborated with a new-born game studio" },
  { year: "2023", title: "VFX Awakening", detail: "Started to experiment on VFXs, shaders and tech art." },
  { year: "2022", title: "3D Modeling", detail: "Worked in several companies as 3D modeler and designer." },
  { year: "2018", title: "First Steps", detail: "Started learning the basics of game development" },
];

export default function Timeline() {
  const [open, setOpen] = useState(null);
  return (
    <section className="max-w-[900px] mx-auto px-4 md:px-8 py-24">
      <h2 className="font-heading uppercase font-extrabold text-5xl md:text-7xl mb-16 text-center">
        Background <span className="text-[#FFEB3B]">Timeline</span>
      </h2>
      <div className="relative border-l-4 border-white/30 ml-4 space-y-12">
        {MILESTONES.map((m, i) => (
          <ScrollReveal key={m.year} delay={i * 0.05}>
            <div className="relative pl-8">
              <button
                data-hover
                onClick={() => setOpen(open === i ? null : i)}
                className="absolute -left-[13px] top-1 w-6 h-6 rounded-full border-4 border-[#080808]"
                style={{ background: open === i ? "#FFEB3B" : "#784BA0" }}
              />
              <div className="font-mono text-[#FFEB3B] text-sm">{m.year}</div>
              <h3 className="font-heading uppercase font-extrabold text-2xl">{m.title}</h3>
              {open === i && (
                <p className="text-white/70 mt-2 max-w-[60ch]">{m.detail}</p>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}