import { describe, it, expect } from 'vitest';
import { log } from './logger';

describe('logger', () => {
  it('does not throw when called', () => {
    expect(() => log('INFO', 'test')).not.toThrow();
  });
});
