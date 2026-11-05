import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('ReportHero colours', () => {
  const css = readFileSync(join(__dirname, 'ReportHero.module.css'), 'utf8');
  const titleRule = css.slice(css.indexOf('.title {'), css.indexOf('}', css.indexOf('.title {')));

  it('lets the institution name take the cover colour, because the default navy heading is invisible on navy-deep', () => {
    expect(titleRule).toContain('color: inherit');
  });
});
