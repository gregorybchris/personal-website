import ReactMarkdown from "react-markdown";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";

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
            <SyntaxHighlighter
              style={atomOneLight}
              language={match[1]}
              PreTag="div"
              customStyle={{
                paddingTop: "1.5rem",
                paddingBottom: "1.5rem",
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                backgroundColor: "#eaeae3",
              }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
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
