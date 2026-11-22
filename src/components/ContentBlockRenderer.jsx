import React, { useState, useRef, useEffect } from "react";
import { Quote, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import CodeBlockDisplay from "@/components/CodeBlockDisplay";
import RichTextBlock from "@/components/RichTextBlock";
import EmbedBlock from "@/components/EmbedBlock";

function BeforeAfter({ before, after, beforeLabel, afterLabel }) {
  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const [pos, setPos] = useState(50);

  const updatePos = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const p = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(p);
  };

  const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const onDown = (e) => {
    draggingRef.current = true;
    updatePos(getClientX(e));
  };
  const onMove = (e) => {
    if (!draggingRef.current) return;
    updatePos(getClientX(e));
  };
  const onUp = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={onDown}
      onTouchStart={onDown}
      className="relative w-full overflow-hidden select-none cursor-ew-resize border-4 border-white"
    >
      {/* The "after" image defines the intrinsic size of the container so both
          images stay fully visible (no cropping). The "before" layer is stacked
          absolutely with object-contain, preserving its own aspect ratio. */}
      <img
        src={after}
        alt={afterLabel || "after"}
        className="relative block w-full h-auto pointer-events-none select-none"
        draggable={false}
      />
      <img
        src={before}
        alt={beforeLabel || "before"}
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <div className="absolute top-0 bottom-0 w-1 bg-[#FFEB3B] pointer-events-none" style={{ left: `${pos}%`, transform: "translateX(-50%)" }} />
      {/* Each title and its gradient are clipped to its image's visible portion,
          so they appear/disappear naturally as the slider reveals each side. */}
      {afterLabel && (
        <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-12 pb-3 px-4 flex justify-end items-end">
            <span className="text-white font-heading uppercase text-sm md:text-lg tracking-wide">{afterLabel}</span>
          </div>
        </div>
      )}
      {beforeLabel && (
        <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-12 pb-3 px-4 flex justify-start items-end">
            <span className="text-white font-heading uppercase text-sm md:text-lg tracking-wide">{beforeLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const CALLOUT_STYLES = {
  info: { icon: Info, color: "#FFEB3B" },
  warning: { icon: AlertTriangle, color: "#FF3C3C" },
  success: { icon: CheckCircle2, color: "#3CFF9C" },
};

export default function ContentBlockRenderer({ block }) {
  switch (block.type) {
    case "text":
      return (
        <div className="bg-white text-[#080808] p-8 font-body text-lg leading-relaxed min-w-0">
          {block.title && <h2 className="font-heading uppercase font-extrabold text-3xl mb-4">{block.title}</h2>}
          <RichTextBlock html={block.text} />
        </div>
      );
    case "image":
      return (
        <figure>
          <img src={block.image_url} alt={block.title || "project image"} className="w-full border-4 border-white" />
          {block.title && <figcaption className="font-mono text-xs uppercase text-white/50 mt-2">{block.title}</figcaption>}
        </figure>
      );
    case "gallery":
      return (
        <div>
          {block.title && <h3 className="font-heading uppercase text-2xl mb-3">{block.title}</h3>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(block.images || []).map((entry, i) => {
              const src = typeof entry === "string" ? entry : entry?.url;
              if (!src) return null;
              return <img key={i} src={src} alt={`${block.title || "gallery"} ${i + 1}`} className="w-full aspect-square object-cover border-4 border-white" />;
            })}
          </div>
        </div>
      );
    case "video":
      return <VideoPlayer url={block.video_url} />;
    case "code":
      return <CodeBlockDisplay code={block.code} language={block.code_language} title={block.title} />;
    case "gif":
      return <img src={block.gif_url} alt={block.title || "gif"} className="w-full border-4 border-white" />;
    case "pdf":
      return (
        <div className="border-4 border-white">
          {block.title && <div className="font-mono text-xs uppercase p-2 bg-white/10">{block.title}</div>}
          <iframe src={block.pdf_url} title={block.title || "pdf"} className="w-full h-[600px]" />
        </div>
      );
    case "embed":
      return <EmbedBlock url={block.embed_url} title={block.title} />;
    case "before_after":
      return (
        <div>
          {block.title && <h3 className="font-heading uppercase text-2xl mb-3">{block.title}</h3>}
          <BeforeAfter before={block.before_image} after={block.after_image} beforeLabel={block.before_label} afterLabel={block.after_label} />
        </div>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-[#FF3CAC] pl-6 py-2">
          <Quote className="text-[#FF3CAC] mb-2" size={28} />
          <p className="text-2xl font-heading uppercase leading-snug">{block.quote_text}</p>
          {block.quote_author && <cite className="block mt-2 font-mono text-sm text-white/50 not-italic">— {block.quote_author}</cite>}
        </blockquote>
      );
    case "callout": {
      const style = CALLOUT_STYLES[block.callout_style] || CALLOUT_STYLES.info;
      const Icon = style.icon;
      return (
        <div className="border-4 p-5 flex gap-3 items-start" style={{ borderColor: style.color, background: `${style.color}1a` }}>
          <Icon style={{ color: style.color }} size={24} className="shrink-0 mt-1" />
          <p style={{ color: style.color }} className="font-body">{block.text}</p>
        </div>
      );
    }
    default:
      return null;
  }
}