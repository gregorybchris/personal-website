import { CopyIcon } from "@phosphor-icons/react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import py from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import atomOneLight from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light";
import { toast } from "sonner";

SyntaxHighlighter.registerLanguage("python", py);

interface CodeBlockProps {
  language: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  async function onClick() {
    try {
      await navigator.clipboard.writeText(children);
      toast.success("Copied to clipboard!", {
        duration: 2000,
        position: "top-right",
      });
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  }

  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className="hover:bg-darker-parchment/80 bg-dark-parchment/60 absolute top-5 right-3 cursor-pointer items-center rounded p-1 opacity-0 transition-all duration-300 group-hover:opacity-100"
        title="Copy code"
      >
        <CopyIcon size={18} weight="duotone" color="#555" />
      </button>
      <SyntaxHighlighter
        style={atomOneLight}
        language={language}
        PreTag="div"
        customStyle={{
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          backgroundColor: "#eaeae3",
        }}
      >
        {children.replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
}
