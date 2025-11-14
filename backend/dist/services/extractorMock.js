"use strict";
/**
 * extractorMock.ts
 * Placeholder for content extraction (PDF/URL/YouTube). Returns trimmed text for demo.
 * Replace with real extractor logic (pdf-parse, cheerio, youtube-transcript) when needed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractText = extractText;
async function extractText(context) {
    if (!context || !context.type)
        return '';
    // demo: if content provided, return trimmed content
    if (context.content)
        return String(context.content).slice(0, 2000);
    if (context.type === 'url') {
        return `Extracted text from URL: ${context.url || 'unknown'}. (demo)`;
    }
    if (context.type === 'pdf') {
        return `Extracted text from uploaded PDF. (demo)`;
    }
    if (context.type === 'youtube') {
        return `Extracted subtitles/transcript for YouTube link: ${context.url || 'unknown'}. (demo)`;
    }
    return '';
}
