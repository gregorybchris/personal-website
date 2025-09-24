import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import { CodeBlock } from "./code-block";

SyntaxHighlighter.registerLanguage("python", python);

type MarkdownRendererProps = {
  children: string;
};

export function MarkdownRenderer({ children }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        code({ node, inline, className = "", children, ...props }: any) {
          const match = /language-(\w+)/.exec(className);
          return !inline && match ? (
            <CodeBlock language={match[1]}>
              {String(children)}
            </CodeBlock>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
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
