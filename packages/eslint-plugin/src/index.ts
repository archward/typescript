import type { TSESLint } from '@typescript-eslint/utils';

import adrConfig from './configs/adr';
import architectureConfig from './configs/architecture';
import baseRules from './rules/base/index';

const plugin = {
  meta: { name: '@ddd-arch/eslint-plugin', version: '0.0.0' },
  rules: { ...baseRules },
} satisfies TSESLint.FlatConfig.Plugin;

export default {
  ...plugin,
  configs: { adr: adrConfig(plugin), architecture: architectureConfig },
};
