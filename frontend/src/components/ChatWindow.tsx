import { sampleMessages } from "@/lib/sample-data";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

type ChatWindowProps = {
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
};

export default function ChatWindow({ sidebarOpen, onOpenSidebar }: ChatWindowProps) {
  return (
    <div className="flex h-dvh flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 text-sm font-medium text-foreground md:px-8">
        {!sidebarOpen && (
          <button
            onClick={onOpenSidebar}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-surface-hover"
            aria-label="Show sidebar"
          >
            <MenuIcon />
          </button>
        )}
        <span className="flex-1 text-center md:flex-none md:text-left">
          OpenJarvis
        </span>
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

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}
