// Allowed <iframe> attributes we forward to the rendered <iframe>.
// React uses camelCase for two of them; we map those below.
const IFRAME_ATTRS = [
  "src",
  "width",
  "height",
  "allow",
  "allowfullscreen",
  "loading",
  "referrerpolicy",
  "frameborder",
  "scrolling",
  "title",
  "name",
  "sandbox",
];

const REACT_KEY_MAP = {
  allowfullscreen: "allowFullScreen",
  referrerpolicy: "referrerPolicy",
};

const isTruthyAttr = (name) => name === "allowfullscreen";

/**
 * Parse user embed input into something we can safely render.
 *
 * Supports three flavours:
 *  - a plain http(s) URL            → { type: "url",    src, props: {} }
 *  - a full <iframe …></iframe>     → { type: "iframe", src, props: {src,width,height,…} }
 *  - anything else                  → { type: "invalid", error }
 *
 * props is a React-friendly object (camelCase keys, allowFullScreen as boolean
 * true) so the renderer can spread it directly onto an <iframe>.
 */
export function parseEmbedInput(raw) {
  if (!raw || typeof raw !== "string" || !raw.trim()) {
    return { type: "invalid", error: "No embed URL set.", props: {} };
  }

  const trimmed = raw.trim();

  // Detect any <iframe> snippet and extract its attributes via the DOM.
  if (/<iframe\b/i.test(trimmed)) {
    let el = null;
    try {
      if (typeof DOMParser !== "undefined") {
        const doc = new DOMParser().parseFromString(trimmed, "text/html");
        el = doc.body ? doc.body.querySelector("iframe") : null;
      }
    } catch (e) {
      el = null;
    }
    if (!el && typeof document !== "undefined") {
      // Fallback: let the browser parse the snippet into a detached node.
      const wrapper = document.createElement("div");
      wrapper.innerHTML = trimmed;
      el = wrapper.querySelector("iframe");
    }
    if (!el) {
      return {
        type: "invalid",
        error: "Couldn't parse the <iframe> code — check it's a complete embed snippet.",
        props: {},
      };
    }

    const src = (el.getAttribute("src") || "").trim();
    if (!src) {
      return { type: "invalid", error: "The <iframe> is missing its src URL.", props: {} };
    }
    if (!/^https?:\/\//i.test(src)) {
      return {
        type: "invalid",
        error: "The <iframe> src must be a valid http(s) URL.",
        props: {},
      };
    }

    const props = {};
    for (const name of IFRAME_ATTRS) {
      if (!el.hasAttribute(name)) continue;
      const val = el.getAttribute(name);
      const key = REACT_KEY_MAP[name] || name;
      props[key] = isTruthyAttr(name) ? true : val;
    }
    return { type: "iframe", src, props };
  }

  // Plain URL.
  if (/^https?:\/\//i.test(trimmed)) {
    return { type: "url", src: trimmed, props: {} };
  }

  return {
    type: "invalid",
    error: "Paste a share link (https://…) or a full <iframe> embed code.",
    props: {},
  };
}