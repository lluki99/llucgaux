import React from "react";
import BackNav from "@/components/BackNav";
import NextProjectNav from "@/components/NextProjectNav";

// Shared project-page navigation row (Back + Next Project). Rendered at both
// the top and bottom of every Project Page so both use identical logic.
export default function ProjectNav({ origin, nextProject, className = "" }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <BackNav origin={origin} />
      <NextProjectNav project={nextProject} origin={origin} />
    </div>
  );
}