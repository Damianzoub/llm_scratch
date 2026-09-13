"use client";

import Image from "next/image";
import { chatHistory } from "@/lib/sample-data";

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-10 flex w-64 flex-col overflow-hidden bg-surface transition-all duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:w-0"
        }`}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2 px-1">
            <Image
              src="/openjarvis-icon.png"
              alt=""
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-sm font-semibold whitespace-nowrap text-foreground">
              OpenJarvis
            </span>
          </div>
          <button
            onClick={onToggle}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-hover"
            aria-label="Hide sidebar"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-2">
          <button className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm whitespace-nowrap text-foreground hover:bg-surface-hover">
            <PlusIcon />
            New chat
          </button>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto px-2">
          <p className="px-2 pb-1 text-xs font-medium whitespace-nowrap text-muted">
            Recent
          </p>
          <ul className="flex flex-col gap-0.5">
            {chatHistory.map((item, i) => (
              <li key={item.id}>
                <button
                  className={`w-full truncate rounded-md px-2 py-2 text-left text-sm hover:bg-surface-hover ${
                    i === 0 ? "bg-surface-hover text-foreground" : "text-muted"
                  }`}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2 rounded-md px-2 py-2 text-sm whitespace-nowrap text-foreground hover:bg-surface-hover">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-background">
              U
            </div>
            <span>Your account</span>
          </div>
        </div>
      </aside>

      {open && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-[5] bg-black/50 md:hidden"
        />
      )}
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
