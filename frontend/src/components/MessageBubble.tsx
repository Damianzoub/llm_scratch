import Image from "next/image";
import type { Message } from "@/lib/sample-data";
import Markdown from "./Markdown";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black">
          <Image
            src="/openjarvis-icon.png"
            alt="Assistant"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-surface-hover text-foreground"
            : "text-foreground"
        }`}
      >
        <Markdown content={message.content} />
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-sm font-semibold text-foreground">
          U
        </div>
      )}
    </div>
  );
}
