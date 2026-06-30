import { readdirSync } from 'node:fs';

const dir = 'docs/decisions';
const numbers = readdirSync(dir)
  .filter((name) => /^\d{4}-.+\.md$/.test(name))
  .map((name) => Number(name.slice(0, 4)))
  .sort((a, b) => a - b);

const errors: string[] = [];
if (numbers.length === 0) {
  errors.push('no ADRs found in docs/decisions');
} else {
  if (numbers[0] !== 1) {
    errors.push(`numbering must start at 1, found ${String(numbers[0])}`);
  }
  for (let i = 1; i < numbers.length; i += 1) {
    const prev = numbers[i - 1];
    const curr = numbers[i];
    if (prev === undefined || curr === undefined) continue;
    if (curr === prev) {
      errors.push(`duplicate ADR number ${String(curr)}`);
    } else if (curr !== prev + 1) {
      errors.push(`gap between ADR ${String(prev)} and ${String(curr)}`);
    }
  }
}

if (errors.length > 0) {
  console.error('ADR numbering failed:');
  for (const line of errors) console.error(`  ${line}`);
  process.exit(1);
}

const last = numbers[numbers.length - 1];
console.log(
  `ADR numbering OK: ${String(numbers.length)} ADRs, 1..${String(last)}, no gaps.`,
);
