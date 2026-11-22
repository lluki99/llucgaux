// Static (file-based) project data source.
//
// Reads the local JSON under /projects/ and returns project objects in the
// shape existing components (Home, Quick Glance, Project Detail, navigation)
// expect, so they render without any changes.
//
//   - Catalog:  /projects/index.json           (ordered by display_order)
//   - Project:  /projects/<slug>/project.json  (full data)
//
// Relative media paths stored as "media/..." are resolved to
// "./projects/<slug>/media/..." so they load from the exported files. External
// URLs (http/https, YouTube, embeds, play/download links) are never touched.
//
// A synthetic `id` is set to the slug so components that key/route on
// `project.id` continue to work without modification.

import { catalog, projects } from "virtual:static-project-data";

const STATIC_BASE = "./projects";

function isExternalUrl(v) {
  return typeof v === "string" && /^https?:\/\//i.test(v);
}

// Resolve a single media value: "media/x.jpg" -> "./projects/<slug>/media/x.jpg".
// External URLs and empty strings are returned unchanged.
function resolveMedia(value, slug) {
  if (typeof value !== "string" || value === "") return value;
  if (isExternalUrl(value)) return value;
  if (value.startsWith("media/")) return `${STATIC_BASE}/${slug}/${value}`;
  return value;
}

// Walk every known media-bearing field in a project and resolve its relative
// "media/..." paths to absolute URLs. Returns a NEW object (input is not
// mutated). Rich-text HTML and external URLs are never touched — only the
// known media fields below are rewritten.
export function resolveProjectMedia(project) {
  const slug = project.slug;
  const out = { ...project, id: slug };

  out.cover_image = resolveMedia(project.cover_image, slug);
  out.video_url = resolveMedia(project.video_url, slug);

  if (Array.isArray(project.screenshots)) {
    out.screenshots = project.screenshots.map((s) => resolveMedia(s, slug));
  }

  if (Array.isArray(project.content_blocks)) {
    out.content_blocks = project.content_blocks.map((block) => {
      const b = { ...block };
      switch (block.type) {
        case "image":
          b.image_url = resolveMedia(block.image_url, slug);
          break;
        case "gallery":
          if (Array.isArray(block.images)) {
            b.images = block.images.map((entry) => {
              if (typeof entry === "string") return resolveMedia(entry, slug);
              if (entry && typeof entry === "object") {
                return { ...entry, url: resolveMedia(entry.url, slug) };
              }
              return entry;
            });
          }
          break;
        case "video":
          b.video_url = resolveMedia(block.video_url, slug);
          break;
        case "gif":
          b.gif_url = resolveMedia(block.gif_url, slug);
          break;
        case "pdf":
          b.pdf_url = resolveMedia(block.pdf_url, slug);
          break;
        case "before_after":
          b.before_image = resolveMedia(block.before_image, slug);
          b.after_image = resolveMedia(block.after_image, slug);
          break;
        default:
          break;
      }
      return b;
    });
  }

  return out;
}

// Returns the full list of published projects in display_order (full records,
// not just the catalog fields).
export async function fetchPublishedProjects() {
  return catalog
    .filter((entry) => entry.is_published !== false)
    .map((entry) => projects[entry.slug])
    .filter(Boolean)
    .map(resolveProjectMedia);
}

// Returns a single full project by slug (the :id route param in static mode).
export async function getProject(slug) {
  const data = projects[slug];
  if (!data) return null;
  return resolveProjectMedia(data);
}
