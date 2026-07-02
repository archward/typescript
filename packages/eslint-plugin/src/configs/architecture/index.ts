import type { TSESLint } from '@typescript-eslint/utils';

import { resolveLayout } from './layout';
import type { ArchitectureOptions } from './types';

export default (
  options: ArchitectureOptions,
): TSESLint.FlatConfig.ConfigArray => [
  {
    name: 'ddd/architecture',
    settings: { ddd: resolveLayout(options) },
  },
];
