import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

// Reusable collapsible/accordion section used for Short Summary and
// Contribution Breakdown on the project page. The whole header is clickable,
// the chevron sits on the LEFT (collapsed → pointing right, expanded →
// pointing down), and the height animates smoothly. Content uses equal vertical
// padding with flex centering and left alignment so it stays balanced for any
// text length. Because it is a normal-flow child of the sticky aside, collapsing
// never breaks the aside's sticky positioning.
export default function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white text-[#080808] min-w-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-hover
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-6 py-5 text-left group"
      >
        <ChevronDown
          size={26}
          className={`shrink-0 transition-transform duration-300 group-hover:text-[#FF3CAC] ${open ? "rotate-0" : "-rotate-90"}`}
        />
        <h2 className="font-heading uppercase font-extrabold text-2xl">{title}</h2>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col justify-center text-left [&_.rich-text]:text-left min-w-0 font-body text-base leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}