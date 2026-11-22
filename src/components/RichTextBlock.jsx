import React from "react";

/**
 * Shared renderer for all rich-text based content (Text blocks, Contribution
 * Breakdown, Project Overview). It normalises non-breaking spaces (\u00A0)
 * accumulated by rich-text editors into regular spaces so paragraphs wrap
 * correctly, applies justified alignment, and enforces word/overflow wrapping
 * so text can never escape its container regardless of the source HTML.
 */
function normalizeHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/\u00A0/g, " ")
    .replace(/&nbsp;/g, " ");
}

export default function RichTextBlock({ html, className = "" }) {
  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: normalizeHtml(html) }}
    />
  );
}