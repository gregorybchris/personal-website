import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface MetaTagsOptions {
  title?: string;
  url?: string;
  favicon?: string;
}

const DEFAULT_FAVICON =
  "https://storage.googleapis.com/cgme/icons/logo/favicon.ico";

function updateMetaTag(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.querySelector(`meta[name="${property}"]`);
  }
  if (element) {
    element.setAttribute("content", content);
  }
}

function updateFavicon(href: string) {
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (link) {
    link.href = href;
  }
}

export function useMetaTags(options: MetaTagsOptions) {
  useEffect(() => {
    const { title } = options;

    if (!title) return;

    document.title = title;
    updateMetaTag("og:title", title);

    return () => {
      document.title = "Chris Gregory";
      updateMetaTag("og:title", "Chris Gregory");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.title]);

  useEffect(() => {
    const { favicon } = options;

    if (favicon) {
      updateFavicon(favicon);
    }

    return () => {
      updateFavicon(DEFAULT_FAVICON);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.favicon]);
}

// Route-based meta tags configuration
const ROUTE_REGEX_META: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/blog/, title: "Blog - Chris Gregory" },
  { pattern: /^\/projects(\/.*)?/, title: "Projects - Chris Gregory" },
  { pattern: /^\/running(\/.*)?/, title: "Running - Chris Gregory" },
  { pattern: /^\/books/, title: "Books - Chris Gregory" },
  { pattern: /^\/music/, title: "Music - Chris Gregory" },
  { pattern: /^\/pottery/, title: "chris gregory" },
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
