import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function MultiSelectFilter({ label, options, selected, onToggle }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-hover
          className="border-2 border-white px-4 py-2 font-mono uppercase text-xs flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
        >
          {label}
          {selected.length > 0 && (
            <span className="bg-[#FF3CAC] text-black px-1.5 leading-none py-0.5">{selected.length}</span>
          )}
          <ChevronDown size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-[#111] border-2 border-white p-0 rounded-none" align="start">
        <div className="max-h-64 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 font-mono uppercase text-[10px] text-white/40">No options</div>
          ) : (
            options.map((opt) => {
              const sel = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  data-hover
                  onClick={() => onToggle(opt)}
                  className={`w-full flex items-center justify-between px-3 py-2 font-mono uppercase text-xs hover:bg-white/10 text-left ${
                    sel ? "text-white" : "text-white/50"
                  }`}
                >
                  <span>{opt}</span>
                  {sel && <Check size={14} className="text-[#FF3CAC] shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}