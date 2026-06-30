import markdown from '@eslint/markdown';
import rule from '@eslint-plugin/rules/base/adr-structure';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it, vi } from 'vitest';

vi.mock('@eslint-plugin/utils/date', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@eslint-plugin/utils/date')>()),
  today: () => '2026-06-30',
}));

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  plugins: { markdown },
  language: 'markdown/gfm',
});

const FILE = 'docs/decisions/0001-lint-adr-structure.md';

const DEFAULTS = {
  sections: ['Status', 'Context', 'Decision', 'Consequences'],
  statuses: ['Proposed', 'Accepted', 'Rejected', 'Deprecated'],
  maxLength: {
    Title: 80,
    Status: 120,
    Context: 600,
    Decision: 600,
    Consequences: 600,
  },
};

const VALID = `# 1. Lint ADR structure

Date: 2026-06-26

## Status

Accepted

## Context

Free-form rationale drifts and gets padded; we want a deterministic gate.

## Decision

Lint the four ordered sections and per-section limits over the markdown AST.

## Consequences

Rationale stays terse and machine-checked; prose grammar is out of scope.
`;

const swapTitle = (title: string): string =>
  VALID.replace('# 1. Lint ADR structure', title);

const swapContext = (body: string): string =>
  VALID.replace(
    'Free-form rationale drifts and gets padded; we want a deterministic gate.',
    body,
  );

ruleTester.run('adr-structure', rule, {
  valid: [
    { name: 'a well-formed ADR is accepted', code: VALID, filename: FILE },
    {
      name: 'a partial maxLength override keeps the other defaults',
      code: VALID,
      filename: FILE,
      options: [{ ...DEFAULTS, maxLength: { ...DEFAULTS.maxLength } }],
    },
    {
      name: 'a custom sections set is honored',
      code: `# 1. Lint ADR structure\n\nDate: 2026-06-26\n\n## Status\n\nAccepted\n\n## Decision\n\nA concise decision.\n`,
      filename: FILE,
      options: [{ ...DEFAULTS, sections: ['Status', 'Decision'] }],
    },
  ],
  invalid: [
    {
      name: 'a lowercase title is rejected and capitalized',
      code: swapTitle('# 1. lint ADR structure'),
      filename: FILE,
      output: VALID,
      errors: [{ messageId: 'titleCase' }],
    },
    {
      name: 'a title ending in a period is rejected and stripped',
      code: swapTitle('# 1. Lint ADR structure.'),
      filename: FILE,
      output: VALID,
      errors: [{ messageId: 'titlePeriod' }],
    },
    {
      name: 'all trailing periods are stripped at once',
      code: swapTitle('# 1. Lint ADR structure...'),
      filename: FILE,
      output: VALID,
      errors: [{ messageId: 'titlePeriod' }],
    },
    {
      name: 'a zero-padded title number is rejected and trimmed',
      code: swapTitle('# 01. Lint ADR structure'),
      filename: FILE,
      output: VALID,
      errors: [{ messageId: 'titleZeroPad' }],
    },
    {
      name: 'a malformed title is rejected',
      code: swapTitle('# No number here'),
      filename: FILE,
      errors: [{ messageId: 'heading' }],
    },
    {
      name: 'a missing date is rejected and inserted',
      code: VALID.replace('Date: 2026-06-26\n\n', ''),
      filename: FILE,
      output: VALID.replace('2026-06-26', '2026-06-30'),
      errors: [{ messageId: 'date' }],
    },
    {
      name: 'an impossible date is rejected',
      code: VALID.replace('2026-06-26', '2026-06-32'),
      filename: FILE,
      errors: [{ messageId: 'dateInvalid' }],
    },
    {
      name: 'a renamed section is rejected',
      code: VALID.replace('## Context', '## Background'),
      filename: FILE,
      errors: [{ messageId: 'sections' }],
    },
    {
      name: 'a sub-heading is rejected',
      code: VALID.replace('## Decision', '## Decision\n\n### Detail'),
      filename: FILE,
      errors: [{ messageId: 'subheading' }],
    },
    {
      name: 'a placeholder section is rejected',
      code: swapContext(
        'The issue motivating this decision, and any context that influences or constrains the decision.',
      ),
      filename: FILE,
      errors: [{ messageId: 'empty' }],
    },
    {
      name: 'a comment-only section is rejected',
      code: swapContext('<!-- to be written -->'),
      filename: FILE,
      errors: [{ messageId: 'empty' }],
    },
    {
      name: 'an over-long section is rejected',
      code: swapContext('x'.repeat(700)),
      filename: FILE,
      errors: [{ messageId: 'length' }],
    },
    {
      name: 'a status outside the enum is rejected',
      code: VALID.replace('Accepted', 'Done'),
      filename: FILE,
      errors: [{ messageId: 'status' }],
    },
    {
      name: 'a custom maxLength is honored',
      code: VALID,
      filename: FILE,
      options: [
        { ...DEFAULTS, maxLength: { ...DEFAULTS.maxLength, Context: 20 } },
      ],
      errors: [{ messageId: 'length' }],
    },
    {
      name: 'a custom status set is honored',
      code: VALID,
      filename: FILE,
      options: [{ ...DEFAULTS, statuses: ['Draft'] }],
      errors: [{ messageId: 'status' }],
    },
    {
      name: 'a bad filename is rejected',
      code: VALID,
      filename: 'docs/decisions/1-bad.md',
      errors: [{ messageId: 'filename' }],
    },
    {
      name: 'a filename number not matching the title is rejected and fixed',
      code: VALID,
      filename: 'docs/decisions/0009-lint-adr-structure.md',
      output: VALID.replace('# 1. Lint', '# 9. Lint'),
      errors: [{ messageId: 'numberMismatch' }],
    },
    {
      name: 'a title not matching the filename slug is rejected',
      code: VALID,
      filename: 'docs/decisions/0001-different-slug.md',
      errors: [{ messageId: 'titleMismatch' }],
    },
  ],
});
