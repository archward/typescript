import { slugify, stripHeading } from '@eslint-plugin/utils/markdown';
import type { Heading } from '@eslint-plugin/utils/mdast';

import { nodeText } from './checks';
import type { AdrContext, CheckedAdrModel } from './types';

interface TitleModel {
  h1: Heading;
  h1text: string;
  numberStr: string;
  number: number;
  title: string;
  numRange: [number, number];
  titleStart: number;
}

export const reportTitle = (
  context: AdrContext,
  model: CheckedAdrModel,
  maxLength: Record<string, number>,
): void => {
  const { text, h1, fileMatch } = model;
  const h1text = nodeText(text, h1);
  const match = TITLE.exec(stripHeading(h1text));
  if (!match) {
    context.report({ loc: h1.position, messageId: 'heading' });
    return;
  }
  const title = titleModel(h1, h1text, match);
  reportTitleNumber(context, title, fileMatch);
  reportTitleText(context, title, fileMatch);
  reportTitleLength(context, title, maxLength);
};

const titleModel = (
  h1: Heading,
  h1text: string,
  match: RegExpExecArray,
): TitleModel => {
  const [, numberStr = '', title = ''] = match;
  const numStart = h1.position.start.offset + h1text.search(/\d/);
  return {
    h1,
    h1text,
    numberStr,
    number: Number(numberStr),
    title,
    numRange: [numStart, numStart + numberStr.length],
    titleStart: h1.position.start.offset + h1text.lastIndexOf(title),
  };
};

const reportTitleNumber = (
  context: AdrContext,
  { h1, numberStr, number, numRange }: TitleModel,
  fileMatch: RegExpExecArray | null,
): void => {
  if (numberStr !== String(number)) {
    context.report({
      loc: h1.position,
      messageId: 'titleZeroPad',
      fix: (fixer) => fixer.replaceTextRange(numRange, String(number)),
    });
  }
  if (fileMatch) {
    const fileNumber = Number(fileMatch[1]);
    if (fileNumber !== number) {
      context.report({
        loc: h1.position,
        messageId: 'numberMismatch',
        data: { file: String(fileNumber), title: String(number) },
        fix: (fixer) => fixer.replaceTextRange(numRange, String(fileNumber)),
      });
    }
  }
};

const reportTitleText = (
  context: AdrContext,
  { h1, title, titleStart }: TitleModel,
  fileMatch: RegExpExecArray | null,
): void => {
  const slug = fileMatch?.[2];
  if (slug !== undefined && slugify(title) !== slug) {
    context.report({
      loc: h1.position,
      messageId: 'titleMismatch',
      data: { slug },
    });
  }
  const first = title[0] ?? '';
  if (first !== first.toUpperCase()) {
    context.report({
      loc: h1.position,
      messageId: 'titleCase',
      fix: (fixer) =>
        fixer.replaceTextRange(
          [titleStart, titleStart + 1],
          first.toUpperCase(),
        ),
    });
  }
  reportTitlePeriod(context, h1, title, titleStart);
};

const reportTitlePeriod = (
  context: AdrContext,
  h1: Heading,
  title: string,
  titleStart: number,
): void => {
  if (!title.endsWith('.')) return;
  let dots = 1;
  while (title[title.length - 1 - dots] === '.') dots += 1;
  const dotsEnd = titleStart + title.length;
  context.report({
    loc: h1.position,
    messageId: 'titlePeriod',
    fix: (fixer) => fixer.removeRange([dotsEnd - dots, dotsEnd]),
  });
};

const reportTitleLength = (
  context: AdrContext,
  { h1, h1text }: TitleModel,
  maxLength: Record<string, number>,
): void => {
  const max = maxLength.Title;
  if (max === undefined || h1text.length <= max) return;
  context.report({
    loc: h1.position,
    messageId: 'length',
    data: { part: 'Title', count: String(h1text.length), max: String(max) },
  });
};

const TITLE = /^(\d+)\. (\S.*)$/;
