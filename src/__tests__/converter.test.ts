import { BaseConverter } from '../converter';
import { ConversionError } from '../types';

describe('BaseConverter', () => {
  let converter: BaseConverter;

  beforeEach(() => {
    converter = new BaseConverter();
  });

  describe('constructor', () => {
    it('should create converter with default digits', () => {
      expect(() => new BaseConverter()).not.toThrow();
    });

    it('should throw error for invalid custom digits', () => {
      expect(() => new BaseConverter('0')).toThrow(ConversionError);
      expect(() => new BaseConverter('0')).toThrow('Digit set must contain at least 2 characters');
    });
  });

  describe('convert - basic conversions', () => {
    it('should convert decimal to binary', () => {
      const result = converter.convert('10', { fromBase: 10, toBase: 2 });
      expect(result.output).toBe('1010');
      expect(result.fromBase).toBe(10);
      expect(result.toBase).toBe(2);
    });

    it('should convert binary to decimal', () => {
      const result = converter.convert('1010', { fromBase: 2, toBase: 10 });
      expect(result.output).toBe('10');
    });

    it('should convert decimal to hexadecimal', () => {
      const result = converter.convert('255', { fromBase: 10, toBase: 16 });
      expect(result.output).toBe('ff');
    });

    it('should handle zero', () => {
      const result = converter.convert('0', { fromBase: 10, toBase: 2 });
      expect(result.output).toBe('0');
    });
  });

  describe('convert - negative numbers', () => {
    it('should handle negative numbers', () => {
      const result = converter.convert('-10', { fromBase: 10, toBase: 2 });
      expect(result.output).toBe('-1010');
    });

    it('should preserve negative sign in conversion', () => {
      const result = converter.convert('-ff', { fromBase: 16, toBase: 10 });
      expect(result.output).toBe('-255');
    });
  });

  describe('convert - uppercase option', () => {
    it('should output uppercase when specified', () => {
      const result = converter.convert('255', { fromBase: 10, toBase: 16, uppercase: true });
      expect(result.output).toBe('FF');
    });

    it('should output lowercase by default', () => {
      const result = converter.convert('255', { fromBase: 10, toBase: 16, uppercase: false });
      expect(result.output).toBe('ff');
    });
  });

  describe('convert - show steps', () => {
    it('should include steps when showSteps is true', () => {
      const result = converter.convert('10', { fromBase: 10, toBase: 2, showSteps: true });
      expect(result.steps).toBeDefined();
      expect(result.steps!.length).toBeGreaterThan(0);
    });

    it('should not include steps when showSteps is false', () => {
      const result = converter.convert('10', { fromBase: 10, toBase: 2, showSteps: false });
      expect(result.steps).toBeUndefined();
    });
  });

  describe('convert - large numbers', () => {
    it('should handle large numbers with BigInt', () => {
      const result = converter.convert('9007199254740991', { fromBase: 10, toBase: 16 });
      expect(result.output).toBe('1fffffffffffff');
    });
  });

  describe('convert - custom digits', () => {
    it('should use custom digit set', () => {
      const customConverter = new BaseConverter('01');
      const result = customConverter.convert('10', { fromBase: 10, toBase: 2 });
      expect(result.output).toBe('1010');
    });
  });

  describe('convert - error handling', () => {
    it('should throw error for invalid base (too low)', () => {
      expect(() => converter.convert('10', { fromBase: 1, toBase: 10 })).toThrow(ConversionError);
    });

    it('should throw error for invalid base (too high)', () => {
      expect(() => converter.convert('10', { fromBase: 10, toBase: 63 })).toThrow(ConversionError);
    });

    it('should throw error for invalid digit in input', () => {
      expect(() => converter.convert('2', { fromBase: 2, toBase: 10 })).toThrow(ConversionError);
      expect(() => converter.convert('2', { fromBase: 2, toBase: 10 })).toThrow("Invalid digit '2' for base 2");
    });

    it('should throw error for invalid character', () => {
      expect(() => converter.convert('g', { fromBase: 16, toBase: 10 })).toThrow(ConversionError);
    });
  });

  describe('convert - base 62', () => {
    it('should handle base 62 conversions', () => {
      const result = converter.convert('100', { fromBase: 10, toBase: 62 });
      expect(result.output).toBe('1C');
    });
  });
});
