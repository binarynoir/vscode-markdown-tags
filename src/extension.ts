import type MarkdownIt from 'markdown-it';
import { tagsPlugin } from './tags';

/**
 * Activates the extension, contributing the tags plugin to VS Code's Markdown preview.
 * @returns An object whose extendMarkdownIt hook VS Code's Markdown extension calls.
 */
export function activate() {
    return {
        extendMarkdownIt(md: MarkdownIt) {
            return md.use(tagsPlugin);
        }
    };
}
