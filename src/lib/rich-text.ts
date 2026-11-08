export interface RichSegment<L extends string> {
  text: string;
  bold: boolean;
  link: L | null;
}

const BOLD_MARK = '**';

function escapeForRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Legal copy is kept verbatim with `**bold**` marks; named documents inside it become links. */
export function richSegments<L extends string>(text: string, links: Record<string, L>): RichSegment<L>[] {
  const phrases = Object.keys(links).map(escapeForRegExp);
  const linkPattern = phrases.length > 0 ? new RegExp(`(${phrases.join('|')})`) : null;
  return text
    .split(/(\*\*.*?\*\*)/)
    .filter((part) => part.length > 0)
    .flatMap((part): RichSegment<L>[] => {
      if (part.startsWith(BOLD_MARK) && part.endsWith(BOLD_MARK)) return [{ text: part.slice(BOLD_MARK.length, -BOLD_MARK.length), bold: true, link: null }];
      const pieces = linkPattern ? part.split(linkPattern) : [part];
      return pieces.filter((piece) => piece.length > 0).map((piece) => ({ text: piece, bold: false, link: links[piece] ?? null }));
    });
}
