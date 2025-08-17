// RFC 7807-style problem details used by presentation layer.
export type Problem = {
  type: string; // URI/URN for programmatic identification
  title: string; // short, human-readable summary
  status: number; // HTTP status
  detail?: string; // more info (safe to show)
  instance?: string; // request correlation id / path
  errors?: ReadonlyArray<{ field: string; message: string }>;
  meta?: Record<string, unknown>;
} & Readonly<Record<never, never>>; // prevent excess props via exactness in TS configs
