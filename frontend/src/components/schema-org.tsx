import { useEffect } from "react";

interface BlogPostingSchemaProps {
  title: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  url: string;
  image?: string;
}

export function BlogPostingSchema(props: BlogPostingSchemaProps) {
  const {
    title,
    description,
    datePublished,
    dateModified,
    author = { name: "Chris Gregory", url: "https://chrisgregory.me" },
    url,
    image,
  } = props;

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "blog-post-schema";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      ...(description && { description }),
      datePublished,
      ...(dateModified && { dateModified }),
      author: {
        "@type": "Person",
        name: author.name,
        ...(author.url && { url: author.url }),
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      ...(image && { image }),
      publisher: {
        "@type": "Person",
        name: "Chris Gregory",
        url: "https://chrisgregory.me",
      },
    });

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById("blog-post-schema");
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [title, description, datePublished, dateModified, author, url, image]);

  return null;
}
