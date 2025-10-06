import { useEffect } from "react";

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
    const { title, url } = options;

    if (title) {
      document.title = title;

      updateMetaTag("og:title", title);
      updateMetaTag("twitter:title", title);
      if (url) {
        updateMetaTag("og:url", url);
        updateMetaTag("twitter:url", url);
      }
    }

    return () => {
      document.title = "Chris Gregory";
      updateMetaTag("og:title", "Chris Gregory");
      updateMetaTag("og:url", "http://chrisgregory.me");
      updateMetaTag("twitter:title", "Chris Gregory");
      updateMetaTag("twitter:url", "http://chrisgregory.me");
    };
  }, [options.title, options.url]);
}
