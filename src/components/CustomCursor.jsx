import React, { useEffect, useRef, useState } from "react";

// Elements that directly render text content. When the cursor is over one of
// these (or over an editable field), and that text sits on a white/light block
// where the default white cursor would be invisible, the cursor turns pink.
const TEXT_TAGS = new Set([
  "P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "A", "LABEL", "LI",
  "BLOCKQUOTE", "CITE", "CODE", "PRE", "EM", "STRONG", "B", "I", "U", "SMALL",
  "SUB", "SUP", "MARK", "TIME", "ABBR", "DFN", "KBD", "SAMP", "VAR", "Q",
  "FIGCAPTION", "DT", "DD", "SUMMARY",
]);

function hasDirectTextNode(el) {
  for (const n of el.childNodes) {
    if (n.nodeType === 3 && n.textContent.trim()) return true;
  }
  return false;
}

// Walks up from el to the first opaque background and returns true if it is
// light (white-ish). This scopes the pink cursor to text that sits on a white
// block (Short Summary, Contribution Breakdown, project text blocks, the rich
// text editor, etc.) instead of every text element on the dark page.
function hasLightBackground(el) {
  let node = el;
  let depth = 0;
  while (node && node.nodeType === 1 && depth < 8) {
    const bg = window.getComputedStyle(node).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      const m = bg.match(/\d+/g);
      if (m && m.length >= 3) {
        const [r, g, b] = m.map(Number);
        return r > 235 && g > 235 && b > 235;
      }
      return false;
    }
    node = node.parentElement;
    depth += 1;
  }
  return false;
}

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [overText, setOverText] = useState(false);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef(null);
  const latestRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e) => {
      latestRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(() => {
          const { x, y } = latestRef.current;
          setPos({ x, y });
          const el = document.elementFromPoint(x, y);
          setHovering(!!el?.closest("a, button, [role='button'], [data-hover]"));
          let textEl = false;
          if (el) {
            const tag = el.tagName;
            const editable = tag === "INPUT" || tag === "TEXTAREA" || !!el.isContentEditable || !!el.classList?.contains("ql-editor");
            const isTextRegion = TEXT_TAGS.has(tag) || editable || hasDirectTextNode(el);
            // Pink when editing text, or when hovering a text region on a white block.
            textEl = editable || (isTextRegion && hasLightBackground(el));
          }
          setOverText(textEl);
          frameRef.current = null;
        });
      }
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block transition-opacity duration-200"
      style={{
        transform: `translate(${pos.x - (hovering ? 20 : overText ? 12 : 8)}px, ${pos.y - (hovering ? 20 : overText ? 12 : 8)}px)`,
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className={`rounded-full border-2 transition-all duration-150 ${
          hovering
            ? "w-10 h-10 border-[#FF3CAC] bg-[#FF3CAC]/20"
            : overText
            ? "w-6 h-6 border-[#FF3CAC] bg-[#FF3CAC]/30"
            : "w-4 h-4 border-white bg-white/30"
        }`}
      />
    </div>
  );
}