/// <reference types="node" />
import fs from 'fs';
import path from 'path';

const SOURCE_ROOT = path.join(__dirname, '..');
const SOURCE_EXTENSIONS = ['.ts', '.tsx'];
const ALIAS_ESCAPING_PATTERN = /['"]@\/\.\.\//;

function listSourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listSourceFiles(entryPath);
    return SOURCE_EXTENSIONS.includes(path.extname(entry.name)) ? [entryPath] : [];
  });
}

describe('path aliases', () => {
  it('never climbs out of the @/ alias, which Metro cannot resolve', () => {
    const offendingFiles = listSourceFiles(SOURCE_ROOT)
      .filter((filePath) => ALIAS_ESCAPING_PATTERN.test(fs.readFileSync(filePath, 'utf8')))
      .map((filePath) => path.relative(SOURCE_ROOT, filePath));

    expect(offendingFiles).toEqual([]);
  });
});
