"use client";

import { useState, type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown-body prose prose-sm prose-invert max-w-none leading-relaxed prose-p:my-2 prose-pre:my-0 prose-pre:bg-transparent prose-pre:p-0 prose-headings:mt-4 prose-headings:mb-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{ pre: CodeBlock }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock(props: ComponentProps<"pre">) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
    const pre = e.currentTarget
      .closest("div")
      ?.querySelector("pre");
    const text = pre?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative my-2 overflow-hidden rounded-lg border border-border">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md bg-surface-hover px-2 py-1 text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre {...props} className="overflow-x-auto p-3 text-xs" />
    </div>
  );
}
