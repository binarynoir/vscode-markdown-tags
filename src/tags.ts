import type MarkdownIt from 'markdown-it';

// Labels that have a predefined color in style.css
const labelMap = [
    "todo", "planned", "in-progress", "doing", "done", "tip",
    "on-hold", "tbd", "proposed", "draft", "wip", "mvp",
    "blocked", "canceled", "error", "warning", "warn"
];
const colorMap = ["grey", "green", "yellow", "orange", "blue", "purple", "red"];

// Labels rendered in upper case
const upperCaseLabels = ["tbd", "mvp", "wip", "draft"];

// Matches ((tag|label|bgcolor|fgcolor)) or ((tag/label/bgcolor/fgcolor)); a leading ((< makes an arrow tag
const tagSyntaxRegex = /\(\(<?tag[|/](?<label>[^|/)]+)(?:[|/](?<bgcolor>[^|/)]*))?(?:[|/](?<fgcolor>[^|/)]*))?\)\)/g;

/**
 * Determines if a given string is a valid 3 or 6 digit hexadecimal color.
 * @param color - The color string to validate.
 * @returns True if the color is a valid hex color, otherwise false.
 */
export const isValidHexColor = (color: string): boolean => /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);

/**
 * Escapes HTML special characters in a string to prevent HTML injection.
 * @param str - The string to escape.
 * @returns A string with HTML special characters escaped.
 */
export const escapeHtml = (str: string): string =>
    str.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

/**
 * Generates the HTML span for a single tag. The label is escaped here, and colors are
 * only emitted when they are a predefined color name (background) or a hex code.
 * @param label - The label text for the tag.
 * @param bgcolor - Optional background color: a predefined color name or a hex code.
 * @param fgcolor - Optional text color, as a hex code.
 * @param arrow - Whether to render the tag with an arrow.
 * @returns An HTML string representing the styled span element.
 */
export function generateTagSpan(label: string, bgcolor?: string, fgcolor?: string, arrow: boolean = false): string {
    const lowerLabel = label.toLowerCase();
    const lowerBg = bgcolor?.toLowerCase() ?? '';
    const bgHex = bgcolor && isValidHexColor(bgcolor) ? bgcolor : null;
    const fgHex = fgcolor && isValidHexColor(fgcolor) ? fgcolor : null;
    const labelClass = labelMap.includes(lowerLabel) ? lowerLabel : '';

    // An explicit color always wins over the label's default color
    const colorClass = colorMap.includes(lowerBg) ? lowerBg : bgHex ? '' : labelClass || 'grey';

    const classes = ['bn-tags', colorClass, upperCaseLabels.includes(lowerLabel) ? 'bn-upper' : '', arrow ? 'bn-arrow-tags' : '']
        .filter(Boolean)
        .join(' ');

    // Custom colors are passed as CSS variables so that arrow tags (which draw their point with a pseudo-element) get them too
    const vars = [bgHex && `--bn-bg: ${bgHex}`, fgHex && `--bn-fg: ${fgHex}`].filter(Boolean).join('; ');
    const style = vars ? ` style="${vars}"` : '';

    return `<span class="${classes}"${style}>${escapeHtml(label)}</span>`;
}

/**
 * Renders a run of text, replacing tag syntax with spans and escaping everything else.
 * @param content - The raw (unescaped) text token content.
 * @returns HTML for the text.
 */
export function renderTextWithTags(content: string): string {
    let html = '';
    let last = 0;

    for (const match of content.matchAll(tagSyntaxRegex)) {
        const start = match.index ?? 0;
        const { label, bgcolor, fgcolor } = match.groups ?? {};
        html += escapeHtml(content.slice(last, start)) + generateTagSpan(label, bgcolor, fgcolor, match[0].startsWith('((<'));
        last = start + match[0].length;
    }

    return html + escapeHtml(content.slice(last));
}

/**
 * Markdown-it plugin that replaces custom tag syntax in text with styled HTML spans.
 * Tags inside a single text token only: a label containing emphasis characters such as `*` is split by the parser and will not render as a tag.
 * @param md - The Markdown-it instance to extend.
 */
export function tagsPlugin(md: MarkdownIt): void {
    const defaultRender = md.renderer.rules.text
        ?? ((tokens, idx) => escapeHtml(tokens[idx].content));

    md.renderer.rules.text = (tokens, idx, options, env, self) => {
        const content = tokens[idx].content;
        return content.includes('((')
            ? renderTextWithTags(content)
            : defaultRender(tokens, idx, options, env, self);
    };
}
