const COMBINING_MARKS = /[̀-ͯ]/g;

/** Case- and accent-free, so "jose" finds "José". */
export function foldForSearch(text: string): string {
  return text.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase();
}
