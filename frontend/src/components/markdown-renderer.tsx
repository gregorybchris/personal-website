import ReactMarkdown from "react-markdown";
import { atelierDuneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";

// Other themes:
// - colorBrewer
// - atelierDuneLight
// - atomOneLight
// - docco
// - googlecode
// - atelierSavannaLight
// - atelierForestLight

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
              style={atelierDuneLight}
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
