import * as vscode from 'vscode';
import MarkdownIt from 'markdown-it';
import * as fs from 'fs';
import * as path from 'path';

// Create an output channel for logging
const outputChannel = vscode.window.createOutputChannel("Markdown Tags Extension");

// Define label and color maps for tags
const labelMap = [
    "todo", "planned", "in-progress", "doing", "done", "tip",
    "on-hold", "tbd", "proposed", "draft", "wip", "mvp",
    "blocked", "canceled", "error", "warning", "warn"
];
const colorMap = ["grey", "green", "yellow", "orange", "blue", "purple", "red"];

// Regular expression to match custom tag syntax like [[tag|label|bgcolor|fgcolor]]
const tagSyntaxRegex = /\[\[<?tag\|(?<label>[^\]|]+)(?:\|(?<bgcolor>[^\]|]*))?(?:\|(?<fgcolor>[^\]|]*))?\]\]/g;

/**
 * Determines if a given string is a valid hexadecimal color.
 * @param color - The color string to validate.
 * @returns True if the color is a valid hex color, otherwise false.
 */
const isValidHexColor = (color: string): boolean => /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);

/**
 * Validates whether a color string is a valid hexadecimal color or matches a predefined color.
 * @param color - The color string to validate.
 * @returns True if the color is valid; otherwise, false.
 */
const isValidColor = (color: string): boolean => isValidHexColor(color) || colorMap.includes(color.toLowerCase());

/**
 * Escapes HTML special characters in a string to prevent HTML injection.
 * @param str - The string to escape.
 * @returns A string with HTML special characters escaped.
 */
const escapeHtml = (str: string): string => str.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

/**
 * Generates an HTML span element styled based on the provided label, background color, foreground color, and arrow option.
 * @param label - The label text for the tag.
 * @param bgcolor - Optional background color, either a predefined color or a valid hex code.
 * @param fgcolor - Optional foreground (text) color, specified as a valid hex code.
 * @param arrow - Optional flag indicating whether to add an arrow styling class.
 * @returns An HTML string representing the styled span element.
 */
function generateTagSpan(label: string, bgcolor?: string, fgcolor?: string, arrow: boolean = false): string {
    const labelClass = labelMap.includes(label.toLowerCase()) ? label.toLowerCase() : '';
    const bgColorClass = bgcolor && colorMap.includes(bgcolor.toLowerCase()) ? bgcolor.toLowerCase() : 'grey';
    const bgCustomColor = bgcolor && isValidHexColor(bgcolor) ? bgcolor : null;
    const fgCustomColor = fgcolor && isValidHexColor(fgcolor) ? fgcolor : null;

    const combinedClasses = `tags ${labelClass} ${bgColorClass} ${arrow ? 'arrow-tags' : ''}`.trim();
    const style = bgCustomColor || fgCustomColor
        ? `style="${bgCustomColor ? `background-color: ${bgCustomColor};` : ''}${fgCustomColor ? ` color: ${fgCustomColor};` : ''}"`
        : '';

    return `<span class="${combinedClasses}" ${arrow ? '' : style}>${label}</span>`;
}

/**
 * Markdown-it plugin that processes custom tag syntax in Markdown files and replaces it with styled HTML spans.
 * @param md - The Markdown-it instance to extend.
 * @param cssPath - The path to the CSS file used for styling.
 */
function tagsPlugin(md: MarkdownIt, cssPath: string): void {
    const defaultRender = md.renderer.rules.text;
    let cssContent = '';

    // Load CSS content from specified path, with error handling
    try {
        cssContent = fs.readFileSync(cssPath, 'utf-8');
        outputChannel.appendLine(`CSS loaded successfully from: ${cssPath}`);
    } catch (error) {
        outputChannel.appendLine(`Error loading CSS file: ${(error as Error).message}`);
        vscode.window.showErrorMessage('Could not load CSS file for tag styling. Ensure the file path is correct.');
    }

    // Extend Markdown-it text renderer to process custom tag syntax
    md.renderer.rules.text = (tokens, idx, options, env, self) => {
        const content = tokens[idx].content;

        // Replace custom tag syntax with generated HTML
        if (content.match(tagSyntaxRegex)) {
            const updatedText = content.replace(tagSyntaxRegex, (match: string, label: string, bgcolor: string, fgcolor: string): string => {
                const escapedLabel = escapeHtml(label);
                const validBgColor = bgcolor && isValidColor(bgcolor) ? bgcolor : '';
                const validFgColor = fgcolor && isValidColor(fgcolor) ? fgcolor : '';
                const arrow = match.startsWith('[[<');

                return generateTagSpan(escapedLabel, validBgColor, validFgColor, arrow);
            });

            // Inject CSS content from file if available
            const styleTag = cssContent ? `<style>${cssContent}</style>` : '';
            return `${styleTag}${updatedText}`;
        }

        // Default rendering for non-matching content
        return defaultRender ? defaultRender(tokens, idx, options, env, self) : content;
    };
}

/**
 * Activates the extension by setting up a custom Markdown-it plugin to render custom tags with styles.
 * @param context - The VS Code extension context.
 * @returns An object containing the extended Markdown-it instance with the custom plugin.
 */
export function activate(context: vscode.ExtensionContext) {
    const cssPath = path.join(context.extensionPath, 'style.css');

    outputChannel.appendLine('Activating markdown-tag extension.');

    return {
        extendMarkdownIt(md: MarkdownIt) {
            outputChannel.appendLine('Extending Markdown-It with tagsPlugin function.');
            md.set({ html: true });
            md.use((mdInstance: MarkdownIt) => {
                tagsPlugin(mdInstance, cssPath);
            });
            return md;
        }
    };
}
