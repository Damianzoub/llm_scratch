"use client";

import { useRef, useState } from "react";

type Attachment = {
  id: string;
  file: File;
  previewUrl: string | null;
};

type VoiceState = "idle" | "recording" | "processing" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function InputBar() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  async function startRecording() {
    setVoiceError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        void sendVoiceMessage(audioBlob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setVoiceState("recording");
    } catch {
      setVoiceState("error");
      setVoiceError("Microphone access denied or unavailable.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  function handleMicClick() {
    if (voiceState === "recording") {
      stopRecording();
    } else if (voiceState !== "processing") {
      void startRecording();
    }
  }

  async function sendVoiceMessage(audioBlob: Blob) {
    setVoiceState("processing");
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice-message.webm");

      const response = await fetch(`${API_URL}/voice`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Voice request failed: ${response.status}`);
      }

      // TODO: once the /voice endpoint (Pipecat) is implemented, wire the
      // returned transcript/response into the chat message list here.
      setVoiceState("idle");
    } catch {
      setVoiceState("error");
      setVoiceError("Couldn't reach the voice service. Try again.");
    }
  }

  function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;

    const next: Attachment[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setAttachments((prev) => [...prev, ...next]);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  }

  return (
    <div className="border-t border-border bg-background px-4 pb-4 pt-3 md:px-8">
      <div className="mx-auto max-w-3xl">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group relative flex items-center gap-2 rounded-xl border border-border bg-surface py-1.5 pl-2 pr-7 text-xs text-foreground"
              >
                {attachment.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={attachment.previewUrl}
                    alt={attachment.file.name}
                    className="h-8 w-8 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-hover">
                    <FileIcon />
                  </div>
                )}
                <span className="max-w-[10rem] truncate">
                  {attachment.file.name}
                </span>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  aria-label={`Remove ${attachment.file.name}`}
                  className="absolute right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-muted hover:bg-surface-hover hover:text-foreground"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface px-3 py-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFilesSelected(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach files"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-surface-hover"
          >
            <PlusIcon />
          </button>

          <textarea
            rows={1}
            placeholder="Message OpenJarvis..."
            className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none"
          />

          <button
            onClick={handleMicClick}
            disabled={voiceState === "processing"}
            aria-label={voiceState === "recording" ? "Stop recording" : "Record voice message"}
            aria-pressed={voiceState === "recording"}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-40 ${
              voiceState === "recording"
                ? "bg-red-500 text-white"
                : "text-foreground hover:bg-surface-hover"
            }`}
          >
            {voiceState === "processing" ? <SpinnerIcon /> : <MicIcon />}
          </button>

          <button
            disabled
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-background disabled:opacity-40"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>

        {voiceError && (
          <p className="mt-2 text-center text-xs text-red-500">{voiceError}</p>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted">
        This is a UI shell — sending isn&apos;t wired up yet.
      </p>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1" strokeLinecap="round" />
      <path d="M12 18v4M9 22h6" strokeLinecap="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin"
    >
      <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        strokeLinejoin="round"
      />
      <path d="M14 3v4h4" strokeLinejoin="round" />
    </svg>
  );
}
