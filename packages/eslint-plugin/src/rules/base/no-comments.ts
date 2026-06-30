import { createRule } from '@eslint-plugin/utils/create-rule';
import { AST_TOKEN_TYPES, type TSESTree } from '@typescript-eslint/utils';

type Options = [{ allow: string[] }];
type MessageIds = 'comment';

const DIRECTIVE =
  /^(eslint\b|globals?\b|exported\b|@ts-(expect-error|ignore|nocheck)\b)/;

const isDirective = (comment: TSESTree.Comment): boolean =>
  DIRECTIVE.test(comment.value.trim());

const TRIPLE_SLASH = /^\/\s*<(reference|amd-(module|dependency))\b/;

const isTripleSlash = (comment: TSESTree.Comment): boolean =>
  comment.type === AST_TOKEN_TYPES.Line &&
  TRIPLE_SLASH.test(comment.value.trim());

export default createRule<Options, MessageIds>({
  name: 'base/no-comments',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow comments except tool directives; rationale belongs in commit messages, ADRs, or docs.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Extra regular-expression patterns; a comment whose trimmed text matches any of them is allowed (e.g. "^TODO", "^FIXME").',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      comment:
        'Remove this comment — code should be self-documenting; put rationale in the commit message, an ADR, or docs.',
    },
  },
  defaultOptions: [{ allow: [] }],
  create(context, [{ allow }]) {
    const allowed = allow.map((pattern) => new RegExp(pattern));
    const isAllowed = (comment: TSESTree.Comment): boolean =>
      allowed.some((re) => re.test(comment.value.trim()));
    return {
      Program(): void {
        context.sourceCode.getAllComments().forEach((comment) => {
          if (
            isDirective(comment) ||
            isTripleSlash(comment) ||
            isAllowed(comment)
          )
            return;
          context.report({ loc: comment.loc, messageId: 'comment' });
        });
      },
    };
  },
});
