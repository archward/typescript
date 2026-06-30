import type { GenerateOptions } from 'eslint-doc-generator';
import prettier from 'prettier';

const config: GenerateOptions = {
  ruleDocTitleFormat: 'name',
  ruleListColumns: ['name', 'description', 'fixable'],
  postprocess: async (content, path) => {
    const options = await prettier.resolveConfig(path);
    return prettier.format(content, { ...options, parser: 'markdown' });
  },
};

export default config;
