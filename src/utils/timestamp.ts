/**
 * Shared timestamp format used across Voz a texto (Marca de tiempo in
 * SidePanel, the `time` shown per turn in TranscriptBlock): `[HH:]MM:SS`.
 *
 * "HH:" (hours and its separator) is optional as a pair and flexible (1-2
 * digits) — there's no dangling colon when hours are omitted. MM and SS are
 * always exactly 2 digits (00-59) — same kind of field, so there's no reason
 * for one to allow a single digit and not the other.
 *
 * HH represents elapsed recording time, not wall-clock time, so it's
 * intentionally uncapped (a long hearing/deposition can run past 24h).
 */
const TIMESTAMP_RE = /^(?:([0-9]{1,2}):)?([0-5][0-9]):([0-5][0-9])$/;

export function isValidTimestamp(value: string): boolean {
  if (typeof value !== "string") return false;
  return TIMESTAMP_RE.test(value);
}
