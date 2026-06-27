import adrConfig from './configs/adr.mjs';
import baseRules from './rules/base/index.mjs';

const plugin = {
  meta: { name: '@ddd-arch/eslint-plugin', version: '0.0.0' },
  rules: {
    ...baseRules,
  },
};

plugin.configs = { adr: adrConfig(plugin) };

export default plugin;
