import { describe, it, expect } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  it('does not throw when called', () => {
    expect(() => logger.info('Test', 'test')).not.toThrow();
  });
});
