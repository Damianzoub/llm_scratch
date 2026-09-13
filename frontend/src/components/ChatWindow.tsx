import { sampleMessages } from "@/lib/sample-data";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

export default function ChatWindow() {
  return (
    <div className="flex h-dvh flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-center border-b border-border px-4 text-sm font-medium text-foreground md:justify-start md:px-8">
        OpenJarvis
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {sampleMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>

      <InputBar />
    </div>
  );
}
