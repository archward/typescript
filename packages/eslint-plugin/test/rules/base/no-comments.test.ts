import rule from '@eslint-plugin/rules/base/no-comments';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  linterOptions: { reportUnusedDisableDirectives: 'off' },
});

ruleTester.run('no-comments', rule, {
  valid: [
    {
      name: 'an eslint directive is allowed',
      code: '// eslint-disable-next-line no-undef\nx();\n',
    },
    {
      name: 'a ts-expect-error directive is allowed',
      code: '// @ts-expect-error legacy\nx();\n',
    },
    {
      name: 'a triple-slash reference directive is allowed',
      code: '/// <reference types="node" />\nconst a = 1;\n',
    },
    {
      name: 'a consumer-allowed pattern is honored',
      code: '// TODO: revisit\nconst a = 1;\n',
      options: [{ allow: ['^TODO'] }],
    },
    {
      name: 'code without comments is accepted',
      code: 'const a = 1;\n',
    },
  ],
  invalid: [
    {
      name: 'a prose line comment is rejected',
      code: '// explain\nconst a = 1;\n',
      errors: [{ messageId: 'comment' }],
    },
    {
      name: 'a prose block comment is rejected',
      code: '/* note */\nconst a = 1;\n',
      errors: [{ messageId: 'comment' }],
    },
    {
      name: 'a tag-less JSDoc block is rejected',
      code: '/** just prose */\nconst a = 1;\n',
      errors: [{ messageId: 'comment' }],
    },
    {
      name: 'a triple-slash prose comment is still rejected',
      code: '/// just prose\nconst a = 1;\n',
      errors: [{ messageId: 'comment' }],
    },
    {
      name: 'a ts-check directive is rejected (TypeScript-only standard)',
      code: '// @ts-check\nconst a = 1;\n',
      errors: [{ messageId: 'comment' }],
    },
    {
      name: 'a JSDoc type annotation is rejected (TypeScript-only standard)',
      code: '/** @type {number} */\nconst a = 1;\n',
      errors: [{ messageId: 'comment' }],
    },
  ],
});
