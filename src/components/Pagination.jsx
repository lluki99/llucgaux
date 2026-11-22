import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  const baseBtn =
    "h-10 min-w-10 px-3 font-mono uppercase text-sm border-2 transition-colors inline-flex items-center justify-center";

  return (
    <nav className="flex items-center justify-center gap-2 mt-12 flex-wrap" aria-label="Archive pagination">
      <button
        type="button"
        data-hover
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseBtn} border-white/20 text-white hover:border-white ${
          currentPage === 1 ? "opacity-30 pointer-events-none" : "hover:bg-white hover:text-black"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          data-hover
          onClick={() => onPageChange(p)}
          className={`${baseBtn} ${
            p === currentPage
              ? "bg-[#FF3CAC] border-[#FF3CAC] text-black"
              : "border-white/20 text-white hover:border-white hover:bg-white hover:text-black"
          }`}
          aria-label={`Page ${p}`}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        data-hover
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseBtn} border-white/20 text-white hover:border-white ${
          currentPage === totalPages ? "opacity-30 pointer-events-none" : "hover:bg-white hover:text-black"
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}