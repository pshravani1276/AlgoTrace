import { useCallback, useEffect, useRef, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://127.0.0.1:5000" : "")
).replace(/\/+$/, "");
const PROGRESS_EVENT = "algotrace:progress";
const PROGRESS_ERROR_EVENT = "algotrace:progress-error";
const SESSION_INVALID_EVENT = "algotrace:session-invalid";

export interface LearnerProgress {
  completedActivities: string[];
  activityDays: string[];
  lastActivity: {
    id: string;
    completedAt: string;
  } | null;
}

interface ProgressResponse extends LearnerProgress {
  success: true;
}

interface ApiErrorResponse {
  success?: false;
  message?: string;
}

interface ProgressState {
  ownerId: number | null;
  progress: LearnerProgress;
  loading: boolean;
  error: string | null;
}

const EMPTY_PROGRESS: LearnerProgress = {
  completedActivities: [],
  activityDays: [],
  lastActivity: null,
};

export class ProgressApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ProgressApiError";
    this.status = status;
  }
}

function isProgressResponse(value: unknown): value is ProgressResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const response = value as Partial<ProgressResponse>;
  return (
    response.success === true &&
    Array.isArray(response.completedActivities) &&
    response.completedActivities.every((item) => typeof item === "string") &&
    Array.isArray(response.activityDays) &&
    response.activityDays.every((item) => typeof item === "string") &&
    (response.lastActivity === null ||
      (typeof response.lastActivity === "object" &&
        typeof response.lastActivity.id === "string" &&
        typeof response.lastActivity.completedAt === "string"))
  );
}

async function apiRequest(
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ProgressApiError(
      "Unable to connect to the progress service. Check your connection and retry.",
      0,
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ProgressApiError(
      "The progress service returned an invalid response.",
      response.status,
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event(SESSION_INVALID_EVENT));
    }
    const message =
      typeof data === "object" &&
      data !== null &&
      typeof (data as ApiErrorResponse).message === "string"
        ? (data as ApiErrorResponse).message!
        : "Unable to update your learning progress.";
    throw new ProgressApiError(message, response.status);
  }
  return data;
}

export async function loadLearnerProgress(): Promise<LearnerProgress> {
  const data = await apiRequest("/api/progress");
  if (!isProgressResponse(data)) {
    throw new ProgressApiError(
      "The progress service returned an invalid response.",
      502,
    );
  }
  return {
    completedActivities: data.completedActivities,
    activityDays: data.activityDays,
    lastActivity: data.lastActivity,
  };
}

export function useLearnerProgress(userId: number | null) {
  const [state, setState] = useState<ProgressState>({
    ownerId: null,
    progress: EMPTY_PROGRESS,
    loading: userId !== null,
    error: null,
  });
  const requestGeneration = useRef(0);

  const refresh = useCallback(async () => {
    if (userId === null) {
      requestGeneration.current += 1;
      setState({
        ownerId: null,
        progress: EMPTY_PROGRESS,
        loading: false,
        error: null,
      });
      return;
    }
    const generation = ++requestGeneration.current;
    setState({
      ownerId: userId,
      progress: EMPTY_PROGRESS,
      loading: true,
      error: null,
    });
    try {
      const progress = await loadLearnerProgress();
      if (requestGeneration.current === generation) {
        setState({ ownerId: userId, progress, loading: false, error: null });
      }
    } catch (error) {
      if (requestGeneration.current === generation) {
        setState({
          ownerId: userId,
          progress: EMPTY_PROGRESS,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load your learning progress.",
        });
      }
    }
  }, [userId]);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);

    const onProgressChanged = () => void refresh();
    window.addEventListener(PROGRESS_EVENT, onProgressChanged);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(PROGRESS_EVENT, onProgressChanged);
    };
  }, [refresh]);

  const visibleState =
    state.ownerId === userId
      ? state
      : {
          ownerId: userId,
          progress: EMPTY_PROGRESS,
          loading: userId !== null,
          error: null,
        };

  return { ...visibleState, refresh };
}

export async function markActivityCompleted(activityId: string): Promise<boolean> {
  try {
    await apiRequest("/api/progress/completions", {
      method: "POST",
      body: JSON.stringify({ activityId }),
    });
    window.dispatchEvent(new Event(PROGRESS_EVENT));
    return true;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to save your learning progress.";
    window.dispatchEvent(
      new CustomEvent(PROGRESS_ERROR_EVENT, {
        detail: { activityId, message },
      }),
    );
    return false;
  }
}

export function getStreakStats(activityDays: string[], today = new Date()) {
  const activeDaySet = new Set(activityDays);
  const todayKey = getUtcDateKey(today);
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayKey = getUtcDateKey(yesterday);
  const startingDate = activeDaySet.has(todayKey)
    ? new Date(`${todayKey}T00:00:00.000Z`)
    : activeDaySet.has(yesterdayKey)
      ? new Date(`${yesterdayKey}T00:00:00.000Z`)
      : null;

  let currentStreak = 0;
  if (startingDate) {
    while (activeDaySet.has(getUtcDateKey(startingDate))) {
      currentStreak += 1;
      startingDate.setUTCDate(startingDate.getUTCDate() - 1);
    }
  }

  let longestStreak = 0;
  let sequence = 0;
  let previousDateKey: string | null = null;

  for (const day of [...activeDaySet].sort()) {
    let nextDateKey: string | null = null;
    if (previousDateKey) {
      const nextDate = new Date(`${previousDateKey}T00:00:00.000Z`);
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      nextDateKey = getUtcDateKey(nextDate);
    }
    sequence = nextDateKey === day ? sequence + 1 : 1;
    longestStreak = Math.max(longestStreak, sequence);
    previousDateKey = day;
  }

  return { currentStreak, longestStreak };
}

export function getUtcDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export { PROGRESS_ERROR_EVENT };
