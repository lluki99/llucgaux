import React from "react";
import { ExternalLink } from "lucide-react";
import { parseEmbedInput } from "@/lib/embed";
import { getYouTubeVideoId } from "@/lib/video";
import VideoPlayer from "@/components/VideoPlayer";

const isNumeric = (v) => typeof v === "string" && /^\d+$/.test(v.trim());

export default function EmbedBlock({ url, title }) {
  const parsed = parseEmbedInput(url);

  if (parsed.type === "invalid") {
    return (
      <div className="border-2 border-white/30 p-6 text-center font-mono text-xs uppercase text-white/40">
        {parsed.error}
      </div>
    );
  }

  // Full <iframe> snippet → render with the extracted attributes, keeping the
  // original width/height ratio while staying responsive.
  if (parsed.type === "iframe") {
    const { props } = parsed;
    if (getYouTubeVideoId(props.src)) {
      return <VideoPlayer url={props.src} className="border-4 border-white" />;
    }
    const w = isNumeric(props.width) ? Number(props.width) : null;
    const h = isNumeric(props.height) ? Number(props.height) : null;
    const style = w && h ? { width: "100%", aspectRatio: `${w} / ${h}` } : { width: "100%", height: h || 600 };

    return (
      <div className="border-4 border-white">
        {title && <div className="font-mono text-xs uppercase p-2 bg-white/10">{title}</div>}
        <iframe
          {...props}
          title={props.title || title || "embedded content"}
          loading={props.loading || "lazy"}
          referrerPolicy={props.referrerPolicy || "no-referrer-when-downgrade"}
          allow={props.allow || "autoplay; encrypted-media; picture-in-picture; fullscreen"}
          allowFullScreen={props.allowFullScreen !== undefined ? props.allowFullScreen : true}
          className="w-full block border-0"
          style={style}
        />
        <div className="flex justify-end p-2 bg-white/5">
          <a
            href={props.src}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-white/50 hover:text-white"
          >
            Open in new tab <ExternalLink size={11} />
          </a>
        </div>
      </div>
    );
  }

  // Plain URL → render directly in an iframe.
  const src = parsed.src;
  if (getYouTubeVideoId(src)) {
    return <VideoPlayer url={src} className="border-4 border-white" />;
  }

  return (
    <div className="border-4 border-white">
      {title && <div className="font-mono text-xs uppercase p-2 bg-white/10">{title}</div>}
      <iframe
        src={src}
        title={title || "embedded content"}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full block"
        style={{ height: 600 }}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
      <div className="flex justify-end p-2 bg-white/5">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          data-hover
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-white/50 hover:text-white"
        >
          Open in new tab <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
