import { ESLintUtils } from '@typescript-eslint/utils';

const REPOSITORY = 'https://github.com/archward/ddd-typescript';
const BRANCH = 'main';
const DOCS_DIR = 'packages/eslint-plugin/docs/rules';

const docsUrl = (name: string): string =>
  `${REPOSITORY}/blob/${BRANCH}/${DOCS_DIR}/${name}.md`;

export const createRule = ESLintUtils.RuleCreator(docsUrl);
