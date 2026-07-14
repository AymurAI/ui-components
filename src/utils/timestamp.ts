/**
 * Shared timestamp format used across Voz a texto (Marca de tiempo in
 * SidePanel, the `time` shown per turn in TranscriptBlock): `[HH]:MM:SS`.
 *
 * HH is optional and flexible (1-2 digits, hence the brackets in the format
 * name). MM and SS are always exactly 2 digits (00-59) — same kind of field,
 * so there's no reason for one to allow a single digit and not the other.
 */
const TIMESTAMP_RE = /^(?:([0-9]{1,2}):)?([0-5][0-9]):([0-5][0-9])$/;

export function isValidTimestamp(value: string): boolean {
  return TIMESTAMP_RE.test(value.trim());
}
