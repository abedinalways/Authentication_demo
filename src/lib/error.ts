interface ErrorLike {
  data?: { message?: string };
  message?: string;
  error?: string;
}

/** Extracts a human-readable message from an RTK Query thrown error. */
export function extractErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null) {
    const e = err as ErrorLike;
    if (e.data?.message) return e.data.message;
    if (e.message) return e.message;
    if (e.error) return e.error;
  }
  return "Something went wrong. Please try again.";
}