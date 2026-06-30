import type { Heading, Root } from '@eslint-plugin/utils/mdast';
import type { TSESLint } from '@typescript-eslint/utils';

export type AdrMessageId =
  | 'filename'
  | 'numberMismatch'
  | 'titleZeroPad'
  | 'titleMismatch'
  | 'heading'
  | 'titleCase'
  | 'titlePeriod'
  | 'length'
  | 'date'
  | 'dateInvalid'
  | 'sections'
  | 'subheading'
  | 'empty'
  | 'status';

export interface AdrOptions {
  sections: string[];
  statuses: string[];
  maxLength: Record<string, number>;
}

export type AdrContext = TSESLint.RuleContext<AdrMessageId, [AdrOptions]>;

export interface AdrModel {
  node: Root;
  text: string;
  fileMatch: RegExpExecArray | null;
  headings: Heading[];
  h1: Heading | undefined;
  h2: Heading[];
  sectionNames: string[];
}

export type CheckedAdrModel = AdrModel & { h1: Heading };
