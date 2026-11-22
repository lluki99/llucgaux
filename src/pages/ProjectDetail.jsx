import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Play, Download } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import ContentBlockRenderer from "@/components/ContentBlockRenderer";
import RichTextBlock from "@/components/RichTextBlock";
import VideoPlayer from "@/components/VideoPlayer";
import ProjectNav from "@/components/ProjectNav";
import { useGameState } from "@/lib/GameStateContext";
import { fetchPublishedProjects, getProject } from "@/lib/projects";
import StaticSection from "@/components/StaticSection";
import RightScrollColumn from "@/components/RightScrollColumn";
import { toArray } from "@/lib/utils";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const { visitProject } = useGameState();

  useEffect(() => {
    getProject(id).then((p) => {
      setProject(p);
      setLoading(false);
      visitProject(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchPublishedProjects().then(setAllProjects);
  }, []);

  const currentIndex = allProjects.findIndex((p) => p.id === id);
  const nextProject =
    allProjects.length > 1 && currentIndex !== -1 ? allProjects[(currentIndex + 1) % allProjects.length] : null;

  const origin = useLocation().state?.from === "quick-glance" ? "quick-glance" : "projects";

  const leftRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(null);

  useLayoutEffect(() => {
    const el = leftRef.current;
    if (!el) return;
    const measure = () => setLeftHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [project]);

  if (loading) {
    return <div className="text-center py-32 font-mono uppercase text-white/50">Loading level...</div>;
  }
  if (!project) {
    return (
      <div className="text-center py-32">
        <p className="font-mono uppercase text-white/50 mb-4">Project not found.</p>
        <Link to="/" className="text-[#FF3CAC] font-heading uppercase text-xl">Back to Archive</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-10">
      <ProjectNav origin={origin} nextProject={nextProject} className="mb-6 md:mb-8 shrink-0" />

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 md:gap-12 md:items-start">
        <div ref={leftRef} className="space-y-6 min-w-0 md:pb-6">
          <div className="space-y-4">
            <h1 className="font-heading uppercase font-extrabold text-5xl leading-none tracking-tight">{project.title}</h1>
            <div className="border-4 border-white p-4 space-y-3 font-mono text-xs uppercase">
              <div className="flex justify-between"><span className="text-white/50">Genre</span><span className="text-[#FFEB3B] text-right">{toArray(project.genre).join(", ")}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Year</span><span className="text-[#FFEB3B]">{project.year}</span></div>
              {project.engine && <div className="flex justify-between"><span className="text-white/50">Engine</span><span className="text-[#FFEB3B]">{project.engine}</span></div>}
              <div>
                <span className="text-white/50 block mb-1">My Roles</span>
                <div className="flex flex-wrap gap-1">
                  {(project.my_roles || []).map((r) => (
                    <span key={r} className="border border-[#FF3CAC] text-[#FF3CAC] px-2 py-0.5">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {project.short_summary && (
            <StaticSection title="Short Summary">
              <RichTextBlock html={project.short_summary} />
            </StaticSection>
          )}
          {(project.contributions || project.description) && (
            <StaticSection title="Contribution Breakdown">
              <RichTextBlock html={project.contributions || project.description} />
            </StaticSection>
          )}
        </div>

        <RightScrollColumn height={leftHeight} className="space-y-16 min-w-0 md:pb-4 md:pr-4">
          {project.video_url && (
            <ScrollReveal>
              <VideoPlayer url={project.video_url} />
            </ScrollReveal>
          )}

          {(project.content_blocks || []).map((block, i) => (
            <ScrollReveal key={i}>
              <ContentBlockRenderer block={block} />
            </ScrollReveal>
          ))}

          {(project.screenshots || []).map((src, i) => (
            <ScrollReveal key={`legacy-${i}`}>
              <img src={src} alt={`${project.title} screenshot ${i + 1}`} className="w-full border-4 border-white" />
            </ScrollReveal>
          ))}
        </RightScrollColumn>
      </div>

      <ProjectNav origin={origin} nextProject={nextProject} className="mt-10 md:mt-14" />

      {(project.play_link || project.download_link) && (
        <a
          href={project.play_link || project.download_link}
          target="_blank"
          rel="noopener noreferrer"
          data-hover
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 border-4 border-[#FF3CAC] bg-[#FF3CAC] text-black font-heading uppercase text-xl px-6 py-3 shadow-hard hover:scale-105 transition-transform"
        >
          {project.play_link ? <Play size={20} /> : <Download size={20} />}
          {project.play_link ? "Play Project" : "Download"}
        </a>
      )}
    </div>
  );
}