export const stripHeading = (raw: string): string =>
  raw.replace(/^#+\s*/, '').trim();

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
