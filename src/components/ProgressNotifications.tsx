import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  markActivityCompleted,
  PROGRESS_ERROR_EVENT,
} from "../data/learnerProgress";

interface CompletionError {
  activityId: string;
  message: string;
}

export default function ProgressNotifications() {
  const [failure, setFailure] = useState<CompletionError | null>(null);

  useEffect(() => {
    const onProgressError = (event: Event) => {
      if (
        event instanceof CustomEvent &&
        typeof event.detail === "object" &&
        event.detail !== null &&
        typeof event.detail.activityId === "string" &&
        typeof event.detail.message === "string"
      ) {
        setFailure(event.detail as CompletionError);
      }
    };

    window.addEventListener(PROGRESS_ERROR_EVENT, onProgressError);
    return () => {
      window.removeEventListener(PROGRESS_ERROR_EVENT, onProgressError);
    };
  }, []);

  if (!failure) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed bottom-5 right-5 z-[300] flex max-w-sm items-start gap-4 rounded-2xl border border-red-500/30 bg-slate-900 p-4 text-sm text-red-100 shadow-2xl"
    >
      <div>
        <p>{failure.message}</p>
        <button
          type="button"
          onClick={() => void markActivityCompleted(failure.activityId)}
          className="mt-3 font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Retry saving
        </button>
      </div>
      <button
        type="button"
        onClick={() => setFailure(null)}
        aria-label="Dismiss progress error"
        className="shrink-0 text-red-200 hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  );
}
