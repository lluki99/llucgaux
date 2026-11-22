// Project data is read from the local static export under /projects/.
//   - Catalog: /projects/index.json
//   - Project: /projects/<slug>/project.json
//
// Both functions return the same project shape the views already consume, so
// Home, Quick Glance, and Project Detail work without any rendering changes.
import * as staticProjects from "@/lib/projectsStatic";

export function fetchPublishedProjects() {
  return staticProjects.fetchPublishedProjects();
}

export function getProject(slug) {
  return staticProjects.getProject(slug);
}