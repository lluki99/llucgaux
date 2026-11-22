import React, { useEffect, useState } from "react";
import { fetchPublishedProjects } from "@/lib/projects";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import SlotMachine from "@/components/SlotMachine";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  // Preserve scroll position across visits so returning "Back to Grid" lands where the user left off.
  useEffect(() => {
    if (loading) return;
    const saved = sessionStorage.getItem("home_scroll_pos");
    if (saved) {
      window.scrollTo({ top: parseInt(saved, 10), behavior: "instant" });
    }
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => sessionStorage.setItem("home_scroll_pos", String(window.scrollY));
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Hero />
      <SlotMachine />
      {loading ? (
        <div className="text-center py-24 font-mono uppercase text-white/50">Loading archive...</div>
      ) : (
        <ProjectGrid projects={projects} />
      )}
    </div>
  );
}