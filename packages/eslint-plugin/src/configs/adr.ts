import markdown from '@eslint/markdown';
import type { TSESLint } from '@typescript-eslint/utils';

export default (
  plugin: TSESLint.FlatConfig.Plugin,
): TSESLint.FlatConfig.ConfigArray => [
  {
    files: ['docs/decisions/*.md'],
    plugins: { markdown, arch: plugin },
    language: 'markdown/gfm',
    rules: { 'arch/base/adr-structure': 'error' },
  },
];
