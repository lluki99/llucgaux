import React from "react";
import Timeline from "@/components/Timeline";
import ScrollReveal from "@/components/ScrollReveal";
import CosmeticDecorator from "@/components/CosmeticDecorator";
import InteractiveBackground from "@/components/InteractiveBackground";
import { Download } from "lucide-react";

export default function About() {
  return (
    <div className="relative">
      <InteractiveBackground />
      <section className="relative z-10 max-w-[900px] mx-auto px-4 md:px-8 py-24 text-center">
        <ScrollReveal>
          <h1 className="font-heading uppercase font-extrabold text-6xl md:text-8xl tracking-tight">
            About <span className="text-[#FF3CAC]">Me</span>
          </h1>
          <p className="text-white/70 mt-6 max-w-[65ch] mx-auto text-lg leading-relaxed text-center no-underline not-italic">I see <strong>game design</strong> as a way to communicate ideas and emotions through <strong>interaction</strong> and <strong>fun</strong>. I’m especially interested in creating <strong>appealing visuals</strong> that not only catch attention but also serve a clear purpose. When I design, I start by asking myself what I want to convey, and build <strong>narratives</strong> and <strong>mechanics</strong> around that, always looking for fresh and <strong>original ideas</strong>.</p>
          <a href="./resume.pdf" target="_blank" rel="noopener noreferrer"
          data-hover
          className="inline-flex items-center gap-2 mt-8 border-4 border-[#FFEB3B] text-[#FFEB3B] font-heading uppercase text-xl px-6 py-3 shadow-hardYellow hover:bg-[#FFEB3B] hover:text-[#080808] transition-colors">
            
            <Download size={20} /> Resume
          </a>
        </ScrollReveal>
      </section>
      <section className="relative z-10 max-w-[900px] mx-auto px-4 md:px-8 pb-24">
        <ScrollReveal>
          <CosmeticDecorator />
        </ScrollReveal>
      </section>
      <div className="relative z-10">
        <Timeline />
      </div>
    </div>);

}
