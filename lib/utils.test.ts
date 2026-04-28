import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('px-2', 'py-3')).toBe('px-2 py-3');
  });

  it('resolves Tailwind conflicts — last one wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('drops false conditional classes', () => {
    expect(cn('base', false && 'conditional')).toBe('base');
  });

  it('handles undefined inputs', () => {
    expect(cn('base', undefined)).toBe('base');
  });

  it('returns empty string with no arguments', () => {
    expect(cn()).toBe('');
  });
});
