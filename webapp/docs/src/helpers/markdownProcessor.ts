import { type Placeholder, placeholders } from '../constants/constants';
import { escapeRegExp } from './escapeRegExp';

/**
 * Processes markdown content by replacing placeholders with actual values
 * @param markdown Raw markdown content
 * @param placeholder Optional placeholder, if not specified all placeholders in MARKDOWN_PLACEHOLDERS will be replaced.
 * @returns Processed markdown with placeholders replaced
 */
export function processMarkdown(markdown: string, placeholder?: Placeholder): string {
  if (placeholder) {
    return markdown.replace(new RegExp(escapeRegExp(placeholder), 'g'), placeholders[placeholder]);
  }

  return Object.entries(placeholders).reduce(
    (processed, [ph, replaceValue]) => processed.replace(new RegExp(escapeRegExp(ph), 'g'), replaceValue),
    markdown,
  );
}
