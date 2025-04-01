import { describe, it, expect } from 'vitest';

import { autoTry } from '../try';

describe('autoTry', () => {
  it('should return the result of the function if no error is thrown', () => {
    const result = autoTry(() => 42);
    expect(result).toBe(42);
  });

  it('should return the default value if an error is thrown', () => {
    const result = autoTry(() => {
      throw new Error('Test error');
    }, 'default');
    expect(result).toBe('default');
  });

  it('should call the error handler if an error is thrown', () => {
    const handler = (e: Error) => `Handled: ${e.message}`;
    const result = autoTry(() => {
      throw new Error('Test error');
    }, undefined, handler);
    expect(result).toBe('Handled: Test error');
  });

  it('should return undefined if an error is thrown and no default value or handler is provided', () => {
    const result = autoTry(() => {
      throw new Error('Test error');
    });
    expect(result).toBeUndefined();
  });
});
