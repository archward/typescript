import { isRealDate, today } from '@eslint-plugin/utils/date';
import { stripHeading } from '@eslint-plugin/utils/markdown';
import type { Heading, MdastNode, Root } from '@eslint-plugin/utils/mdast';

import type { AdrContext, AdrModel, CheckedAdrModel } from './types';

export const nodeText = (text: string, node: MdastNode): string =>
  text.slice(node.position.start.offset, node.position.end.offset);

export const analyze = (context: AdrContext, node: Root): AdrModel => {
  const text = context.sourceCode.getText();
  const base = context.filename.split('/').pop() ?? '';
  const headings = node.children.filter(
    (child): child is Heading => child.type === 'heading',
  );
  const h2 = headings.filter((heading) => heading.depth === 2);
  return {
    node,
    text,
    fileMatch: FILENAME.exec(base),
    headings,
    h1: headings.find((heading) => heading.depth === 1),
    h2,
    sectionNames: h2.map((heading) => stripHeading(nodeText(text, heading))),
  };
};

export const reportFilename = (
  context: AdrContext,
  { node, fileMatch }: AdrModel,
): void => {
  if (!fileMatch) context.report({ loc: node.position, messageId: 'filename' });
};

export const reportDate = (
  context: AdrContext,
  { text, node, h1 }: CheckedAdrModel,
): void => {
  const dateNode = node.children.find(
    (child) =>
      child.type === 'paragraph' &&
      DATE_LINE.test(nodeText(text, child).trim()),
  );
  if (!dateNode) {
    const end = h1.position.end.offset;
    context.report({
      loc: h1.position,
      messageId: 'date',
      fix: (fixer) =>
        fixer.replaceTextRange([end, end], `\n\nDate: ${today()}`),
    });
    return;
  }
  const value = nodeText(text, dateNode).trim().replace(DATE_LINE, '');
  if (!ISO.test(value) || !isRealDate(value)) {
    context.report({
      loc: dateNode.position,
      messageId: 'dateInvalid',
      data: { value },
    });
  }
};

export const reportSubheadings = (
  context: AdrContext,
  { headings }: AdrModel,
): void => {
  headings
    .filter((heading) => heading.depth >= 3)
    .forEach((heading) => {
      context.report({ loc: heading.position, messageId: 'subheading' });
    });
};

export const reportSections = (
  context: AdrContext,
  { h1, sectionNames }: CheckedAdrModel,
  sections: string[],
): void => {
  if (sectionNames.join('|') !== sections.join('|')) {
    context.report({
      loc: h1.position,
      messageId: 'sections',
      data: { expected: sections.join(', ') },
    });
  }
};

export const reportSectionBodies = (
  context: AdrContext,
  { text, h2, sectionNames }: AdrModel,
  sections: string[],
  statuses: string[],
  maxLength: Record<string, number>,
): void => {
  h2.forEach((heading, index) => {
    const name = sectionNames[index];
    if (name === undefined || !sections.includes(name)) return;
    const body = sectionBody(text, heading, h2[index + 1]);
    checkSectionBody(context, heading, name, body, statuses, maxLength);
  });
};

const sectionBody = (
  text: string,
  current: Heading,
  next: Heading | undefined,
): string => {
  const start = current.position.end.offset;
  const end = next ? next.position.start.offset : text.length;
  return text.slice(start, end).replace(COMMENT, '').trim();
};

const checkSectionBody = (
  context: AdrContext,
  heading: Heading,
  name: string,
  body: string,
  statuses: string[],
  maxLength: Record<string, number>,
): void => {
  if (body === '' || PLACEHOLDERS.has(body)) {
    context.report({
      loc: heading.position,
      messageId: 'empty',
      data: { name },
    });
    return;
  }
  checkSectionLength(context, heading, name, body, maxLength);
  checkSectionStatus(context, heading, name, body, statuses);
};

const checkSectionLength = (
  context: AdrContext,
  heading: Heading,
  name: string,
  body: string,
  maxLength: Record<string, number>,
): void => {
  const limit = maxLength[name];
  if (limit === undefined || body.length <= limit) return;
  context.report({
    loc: heading.position,
    messageId: 'length',
    data: { part: name, count: String(body.length), max: String(limit) },
  });
};

const checkSectionStatus = (
  context: AdrContext,
  heading: Heading,
  name: string,
  body: string,
  statuses: string[],
): void => {
  if (name !== 'Status' || statuses.includes(body) || SUPERSEDED.test(body)) {
    return;
  }
  context.report({
    loc: heading.position,
    messageId: 'status',
    data: { allowed: statuses.join(', ') },
  });
};

const SUPERSEDED = /^Superseded by \S/;
const DATE_LINE = /^Date:\s+/;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const FILENAME = /^(\d{4,})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const COMMENT = /<!--[\s\S]*?-->/g;
const PLACEHOLDERS = new Set([
  'The issue motivating this decision, and any context that influences or constrains the decision.',
  "The change that we're proposing or have agreed to implement.",
  'What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.',
]);
