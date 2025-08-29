/**
 * Escapes special regex characters in a string
 * @param string String to escape
 * @returns Escaped string safe for regex
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
