import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const getHashId = (hash) => {
  const rawId = hash.slice(1);

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const prevPath = useRef(pathname);
  const prevHash = useRef(hash);

  useEffect(() => {
    const pathChanged = pathname !== prevPath.current;
    const hashChanged = hash !== prevHash.current;
    prevPath.current = pathname;
    prevHash.current = hash;

    // Ignore search-only updates (archive filters, sorting, pagination) so
    // interacting with the Archive preserves the user's scroll position.
    if (!pathChanged && !hashChanged) return;

    // On back / forward, let the browser restore the remembered position.
    if (pathChanged && navigationType === "POP") return;

    if (hash) {
      const id = getHashId(hash);
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => window.clearTimeout(timer);
    }

    if (pathChanged) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash, navigationType]);

  return null;
}