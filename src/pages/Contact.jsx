import React from "react";
import { ExternalLink, Linkedin } from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";
import EmailCopyButton from "@/components/EmailCopyButton";

export default function Contact() {
  return (
    <div className="relative">
      <InteractiveBackground />
      <div className="relative z-10 max-w-[700px] mx-auto px-4 md:px-8 py-24 text-center">
        <h1 className="font-heading uppercase font-extrabold text-6xl md:text-8xl tracking-tight mb-4">
          Get In <span className="text-[#FF3CAC]">Touch</span>
        </h1>
        <p className="text-white/70 text-lg mb-10">Reach out via LinkedIn or email!</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
          <a
            href="https://www.linkedin.com/in/lluc-gauxachs-sanz-48917b150/"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="inline-flex items-center gap-3 border-4 border-[#FFEB3B] text-[#FFEB3B] font-heading uppercase text-xl px-8 py-4 shadow-hardYellow hover:bg-[#FFEB3B] hover:text-[#080808] transition-colors"
          >
            <Linkedin size={22} /> LinkedIn
          </a>
          <EmailCopyButton email="lluc.gau@gmail.com" />
        </div>

        <div className="mx-auto w-full max-w-[460px] flex flex-col items-stretch text-center">
          <p className="text-white/70 text-lg mb-10">
            You can find all my other channels, such as Instagram, itch.io, and YouTube, on my Linktree.
          </p>
          <a
            href="https://linktr.ee/llucgaux"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="w-full inline-flex items-center justify-center gap-3 border-4 border-white text-white font-heading uppercase text-2xl px-6 py-5 shadow-hard hover:bg-white hover:text-[#080808] transition-colors"
          >
            linktr.ee/llucgaux <ExternalLink size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}