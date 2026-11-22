export function getYouTubeVideoId(url) {
  if (typeof url !== "string" || !url.trim()) return null;

  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;

    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const isYouTubeHost = ["youtube.com", "youtube-nocookie.com", "youtu.be"].includes(host);
    if (!isYouTubeHost) return null;

    let id = null;
    if (host === "youtu.be") {
      id = parsed.pathname.split("/").filter(Boolean)[0];
    } else if (parsed.pathname === "/watch") {
      id = parsed.searchParams.get("v");
    } else {
      id = parsed.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/]+)/)?.[1] || null;
    }

    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(url) {
  const id = getYouTubeVideoId(url);
  if (!id) return null;

  const embedUrl = new URL(`https://www.youtube.com/embed/${id}`);
  embedUrl.searchParams.set("autoplay", "0");
  embedUrl.searchParams.set("playsinline", "1");
  embedUrl.searchParams.set("rel", "0");

  // A valid web origin helps YouTube identify hosted embeds. `file://` has no
  // usable origin; VideoPlayer renders a direct YouTube link in that context.
  if (typeof window !== "undefined" && /^https?:$/.test(window.location.protocol)) {
    embedUrl.searchParams.set("origin", window.location.origin);
  }

  return embedUrl.toString();
}
