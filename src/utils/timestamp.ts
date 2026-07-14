/**
 * Shared timestamp format used across Voz a texto (Marca de tiempo in
 * SidePanel, the `time` shown per turn in TranscriptBlock): `MM:SS` or
 * `H+:MM:SS`.
 *
 * "HH:" (hours and its separator) is optional as a pair and accepts one or
 * more digits — there's no dangling colon when hours are omitted. MM and SS are
 * always exactly 2 digits (00-59) — same kind of field, so there's no reason
 * for one to allow a single digit and not the other.
 *
 * HH represents elapsed recording time, not wall-clock time, so it's
 * intentionally uncapped (a long hearing/deposition can run past 24h).
 */
const TIMESTAMP_RE = /^(?:[0-9]+:)?[0-5][0-9]:[0-5][0-9]$/;

export function isValidTimestamp(value: string): boolean {
  if (typeof value !== "string") return false;
  return TIMESTAMP_RE.test(value);
}

/**
 * Formats elapsed milliseconds using the same timestamp contract accepted by
 * {@link isValidTimestamp}: `MM:SS` below one hour and `H+:MM:SS` from one
 * hour onward. Invalid, infinite, or negative values fall back to `00:00` so
 * presentational consumers such as Player never render a malformed timestamp.
 */
export function formatTimestamp(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);

  if (totalSeconds < 3600) {
    return `${String(totalMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
