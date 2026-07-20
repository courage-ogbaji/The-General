import DOMPurify from "isomorphic-dompurify";

/** Strips all HTML, leaving plain text — for user-submitted names/bios/captions. */
export function sanitizePlainText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}
