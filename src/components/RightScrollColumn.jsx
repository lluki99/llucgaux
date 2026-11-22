import React, { useCallback, useEffect, useRef, useState } from "react";

// Right column of the project page: an independent scroll container (native
// scrollbar hidden) with a minimal vertical progress track on its right edge.
// A small dot travels from the top of the track (0% scroll) to the bottom (100%
// scroll), computed live from the real scrollable height. Desktop only.
export default function RightScrollColumn({ children, className = "", height }) {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    const content = contentRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    if (content) ro.observe(content);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  return (
    <div
      className="relative min-w-0 md:h-[var(--right-viewport-h)]"
      style={{ "--right-viewport-h": height ? `${height}px` : "auto" }}
    >
      <div
        ref={scrollRef}
        className="no-native-scrollbar md:overflow-y-auto md:h-full md:min-h-0"
      >
        <div ref={contentRef} className={`min-h-full ${className}`}>{children}</div>
      </div>

      {/* Minimal vertical scroll-progress track + dot. */}
      <div className="pointer-events-none absolute top-4 bottom-4 -right-2 hidden md:block w-px bg-white/15">
        <div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FF3CAC] shadow-[0_0_8px_rgba(255,60,172,0.7)]"
          style={{ top: `calc(${progress} * (100% - 8px))` }}
        />
      </div>
    </div>
  );
}