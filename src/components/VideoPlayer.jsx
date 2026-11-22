import React from "react";
import { ExternalLink } from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeVideoId } from "@/lib/video";

export default function VideoPlayer({ url, className = "" }) {
  if (!url) return null;
  const embedUrl = getYouTubeEmbedUrl(url);

  if (embedUrl) {
    const videoId = getYouTubeVideoId(url);
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // YouTube requires a referrer to identify embedded players. A local file
    // URL cannot provide one, so give visitors a reliable preview and link.
    if (window.location.protocol === "file:") {
      return (
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex aspect-video min-h-[200px] items-center justify-center overflow-hidden border-4 border-white bg-[#111] ${className}`}
          aria-label="Open video on YouTube"
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-50"
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
          <span className="relative z-10 inline-flex items-center gap-2 border-2 border-[#FFEB3B] bg-[#080808]/90 px-5 py-3 font-heading text-lg uppercase text-[#FFEB3B] transition-colors group-hover:bg-[#FFEB3B] group-hover:text-[#080808]">
            Watch on YouTube <ExternalLink size={18} />
          </span>
        </a>
      );
    }

    return (
      <div className={className}>
        <div className="relative aspect-video min-h-[200px]">
          <iframe
            src={embedUrl}
            title="YouTube video"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="flex justify-end pt-2">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-white/50 hover:text-white"
          >
            Watch on YouTube <ExternalLink size={11} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <video
      src={url}
      autoPlay
      muted
      loop
      playsInline
      controls
      className={`w-full ${className}`}
    />
  );
}
