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
  }, [options.title]);
}

// Route-based meta tags configuration
const ROUTE_META_TAGS: Record<string, string> = {
  "/blog": "Blog - Chris Gregory",
  "/projects": "Projects - Chris Gregory",
  "/running": "Running - Chris Gregory",
  "/music": "Music - Chris Gregory",
  "/books": "Books - Chris Gregory",
  "/contact": "Contact - Chris Gregory",
};

export function useRouteMetaTags() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const title = ROUTE_META_TAGS[pathname];

    if (title) {
      document.title = title;
      updateMetaTag("og:title", title);
    } else {
      document.title = "Chris Gregory";
      updateMetaTag("og:title", "Chris Gregory");
    }
  }, [location.pathname]);
}
