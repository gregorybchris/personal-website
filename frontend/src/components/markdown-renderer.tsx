/* eslint-disable @typescript-eslint/no-explicit-any */
import { GithubLogoIcon, LinkIcon } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSmartypants from "remark-smartypants";
import remarkToc from "remark-toc";
import { toast } from "sonner";
import { CodeBlock } from "./code-block";
import { CollapsibleSection } from "./collapsible-section";

SyntaxHighlighter.registerLanguage("python", python);

function createHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface HeadingWithAnchorProps {
  level: number;
  children: React.ReactNode;
}

function HeadingWithAnchor({
  level,
  children,
  ...props
}: HeadingWithAnchorProps) {
  const text = String(children);
  const id = createHeadingId(text);
  const link = `${window.location.origin}${window.location.pathname}#${id}`;

  const heading = (
    <span className="flex flex-row items-center p-0">
      {children}
      <a
        href={`#${id}`}
        className="px-2 opacity-0 transition-all duration-200 group-hover:opacity-100"
        aria-label={`Link to ${text}`}
        onClick={async () => {
          await navigator.clipboard.writeText(link);
          toast.success("Copied section link to clipboard!", {
            duration: 2000,
            position: "top-right",
          });
        }}
      >
        <LinkIcon size={20} />
      </a>
    </span>
  );

  const commonProps = { id, className: "group relative", ...props };

  switch (level) {
    case 1:
      return <h1 {...commonProps}>{heading}</h1>;
    case 2:
      return <h2 {...commonProps}>{heading}</h2>;
    case 3:
      return <h3 {...commonProps}>{heading}</h3>;
    default:
      return <h2 {...commonProps}>{heading}</h2>;
  }
}

interface GitHubButtonProps {
  user: string;
  repo: string;
}

function GitHubButton({ user, repo }: GitHubButtonProps) {
  return (
    <a
      href={`https://github.com/${user}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className="github-button group"
    >
      <div className="github-button-content">
        <div className="group relative h-8 w-8">
          <GithubLogoIcon
            size={18}
            weight="regular"
            className="absolute inset-0 h-8 w-8 text-gray-500 opacity-100 transition-opacity duration-300 group-hover:opacity-0"
          />
          <GithubLogoIcon
            size={18}
            weight="duotone"
            className="text-sky absolute inset-0 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
        <span className="github-button-label">Open Source</span>
      </div>
      <span className="github-button-repo">
        <span className="github-button-repo-user">{user}</span>
        <span className="github-button-repo-slash">/</span>
        <span className="github-button-repo-name">{repo}</span>
      </span>
    </a>
  );
}

type MarkdownRendererProps = {
  children: string;
};

export function MarkdownRenderer({ children }: MarkdownRendererProps) {
  const components: Record<string, React.ComponentType<any>> & {
    h2: React.ComponentType<any>;
    h3: React.ComponentType<any>;
    code: React.ComponentType<any>;
    details: React.ComponentType<any>;
  } = {
    h2({ children, ...props }) {
      return (
        <HeadingWithAnchor level={2} {...props}>
          {children}
        </HeadingWithAnchor>
      );
    },
    h3({ children, ...props }) {
      return (
        <HeadingWithAnchor level={3} {...props}>
          {children}
        </HeadingWithAnchor>
      );
    },
    code({
      inline,
      className = "",
      children,
      ...props
    }: {
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
    }) {
      const match = /language-(\w+)/.exec(className);
      return !inline && match ? (
        <CodeBlock language={match[1]}>{String(children)}</CodeBlock>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    details({ children, ...props }: { children?: React.ReactNode }) {
      // Extract summary and content from children
      const childArray = Array.isArray(children) ? children : [children];
      let summaryText = "Show details";
      const content: React.ReactNode[] = [];

      childArray.forEach((child: any) => {
        if (child?.type === "summary") {
          summaryText = child.props.children;
        } else if (child) {
          content.push(child);
        }
      });

      // Parse summary text for collapsed|||expanded format
      const summaryParts =
        typeof summaryText === "string" ? summaryText.split("|||") : [];
      const summaryCollapsed =
        summaryParts.length > 0 ? summaryParts[0].trim() : undefined;
      const summaryExpanded =
        summaryParts.length > 1 ? summaryParts[1].trim() : undefined;

      const defaultOpen = (props as any).open !== undefined;

      return (
        <CollapsibleSection
          summaryCollapsed={summaryCollapsed}
          summaryExpanded={summaryExpanded}
          defaultOpen={defaultOpen}
        >
          {content}
        </CollapsibleSection>
      );
    },

    "github-button"({ ...props }: any) {
      return <GitHubButton user={props.user} repo={props.repo} />;
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkMath,
        remarkGfm,
        remarkSmartypants,
        [remarkToc, { heading: "contents|table of contents" }],
      ]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}

// Other themes:
// - atomOneLight - comments are nice and distinct from code, also nice string literal colors
// - atelierDuneLight - I like the pastel colors
// - colorBrewer - very blue, which matches the site theme
// - atelierSavannaLight - muted green colors are nice
// - atelierForestLight - bright blues and oranges
// - docco - has bold that I don't like
// - googlecode - good, but dark colors don't match site theme
