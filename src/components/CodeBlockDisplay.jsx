import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { LANG_LABELS, KEYWORDS } from "@/lib/codeLanguages";

const TOKEN_REGEX = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_]+)/g;

function tokenizeLine(line, keywords) {
  const tokens = [];
  let match;
  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(line)) !== null) {
    const [, comment, dstr, sstr, num, word, space, symbol] = match;
    if (comment) tokens.push({ text: comment, color: "#6b7280", italic: true });
    else if (dstr || sstr) tokens.push({ text: dstr || sstr, color: "#FFEB3B" });
    else if (num) tokens.push({ text: num, color: "#3CFF9C" });
    else if (word) tokens.push({ text: word, color: keywords.includes(word) ? "#FF3CAC" : "#FFFFFF" });
    else if (space) tokens.push({ text: space });
    else if (symbol) tokens.push({ text: symbol, color: "#9CA3AF" });
  }
  return tokens;
}

export default function CodeBlockDisplay({ code = "", language = "javascript", title }) {
  const [copied, setCopied] = useState(false);
  const keywords = KEYWORDS[language] || [];
  const lines = (code || "").replace(/\t/g, "  ").split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border-4 border-white bg-[#0c0c0c]">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b-4 border-white font-mono text-[11px] uppercase tracking-widest text-white/60">
        <span>{title || LANG_LABELS[language] || language}</span>
        <button
          type="button"
          onClick={handleCopy}
          data-hover
          className="flex items-center gap-1.5 hover:text-[#FFEB3B] transition-colors"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy Code"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="text-xs md:text-sm font-mono leading-relaxed p-4 m-0">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none pr-4 text-white/30 text-right" style={{ minWidth: "2.5em" }}>{i + 1}</span>
              <span className="whitespace-pre">
                {tokenizeLine(line, keywords).map((tok, j) => (
                  <span key={j} style={{ color: tok.color, fontStyle: tok.italic ? "italic" : "normal" }}>{tok.text}</span>
                ))}
                {line.length === 0 ? "\u00A0" : null}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}