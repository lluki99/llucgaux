import React from "react";

// Always-visible fixed content box with a title header. Matches the open
// styling of CollapsibleSection (white box, heading, padded justified body)
// but without the expand/collapse interaction, chevron, or animation.
export default function StaticSection({ title, children }) {
  return (
    <div className="bg-white text-[#080808] min-w-0">
      <div className="px-6 py-5">
        <h2 className="font-heading uppercase font-extrabold text-2xl">{title}</h2>
      </div>
      <div className="px-6 py-5 flex flex-col justify-center text-left [&_.rich-text]:text-left min-w-0 font-body text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
}