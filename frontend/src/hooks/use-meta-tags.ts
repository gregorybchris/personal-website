import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface MetaTagsOptions {
  title?: string;
  url?: string;
}

function updateMetaTag(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.querySelector(`meta[name="${property}"]`);
  }
  if (element) {
    element.setAttribute("content", content);
  }
}

export function useMetaTags(options: MetaTagsOptions) {
  useEffect(() => {
    const { title } = options;

    if (title) {
      document.title = title;
      updateMetaTag("og:title", title);
    } else {
      document.title = "Chris Gregory";
      updateMetaTag("og:title", "Chris Gregory");
    }

    return () => {
      document.title = "Chris Gregory";
      updateMetaTag("og:title", "Chris Gregory");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.title]);
}

// Route-based meta tags configuration
const ROUTE_REGEX_META: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/blog/, title: "Blog - Chris Gregory" },
  { pattern: /^\/projects(\/.*)?/, title: "Projects - Chris Gregory" },
  { pattern: /^\/running(\/.*)?/, title: "Running - Chris Gregory" },
  { pattern: /^\/books/, title: "Books - Chris Gregory" },
  { pattern: /^\/music/, title: "Music - Chris Gregory" },
  { pattern: /^\/pottery/, title: "Pottery - Chris Gregory" },
  { pattern: /^\/contact/, title: "Contact - Chris Gregory" },
];

export function useRouteMetaTags() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    let title = "Chris Gregory"; // default fallback

    for (const { pattern, title: routeTitle } of ROUTE_REGEX_META) {
      if (pattern.test(pathname)) {
        title = routeTitle;
        break;
      }
    }

    document.title = title;
    updateMetaTag("og:title", title);
  }, [location.pathname]);
}
