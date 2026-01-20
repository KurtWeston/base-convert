import { ConversionOptions, ConversionResult, ConversionError } from './types';
import { log } from '@onamfc/developer-log';

const DEFAULT_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export class BaseConverter {
  private digits: string;

  constructor(customDigits?: string) {
    this.digits = customDigits || DEFAULT_DIGITS;
    if (this.digits.length < 2) {
      throw new ConversionError('Digit set must contain at least 2 characters');
    }
  }

  convert(input: string, options: ConversionOptions): ConversionResult {
    const { fromBase, toBase, showSteps, uppercase } = options;
    
    this.validateBase(fromBase);
    this.validateBase(toBase);

    const isNegative = input.startsWith('-');
    const cleanInput = isNegative ? input.slice(1) : input;

    this.validateInput(cleanInput, fromBase);

    const steps: string[] = [];
    const decimalValue = this.toDecimal(cleanInput, fromBase, steps, showSteps);
    const result = this.fromDecimal(decimalValue, toBase, steps, showSteps);
    
    const output = (isNegative ? '-' : '') + (uppercase ? result.toUpperCase() : result);

    return {
      input,
      output,
      fromBase,
      toBase,
      steps: showSteps ? steps : undefined
    };
  }

  private validateBase(base: number): void {
    if (base < 2 || base > this.digits.length) {
      throw new ConversionError(`Base must be between 2 and ${this.digits.length}`);
    }
  }

  private validateInput(input: string, base: number): void {
    const validDigits = this.digits.slice(0, base);
    for (const char of input) {
      if (!validDigits.includes(char)) {
        throw new ConversionError(`Invalid digit '${char}' for base ${base}`);
      }
    }
  }

  private toDecimal(input: string, base: number, steps: string[], showSteps?: boolean): bigint {
    let result = 0n;
    const len = input.length;

    for (let i = 0; i < len; i++) {
      const digit = this.digits.indexOf(input[i]);
      const power = len - 1 - i;
      result += BigInt(digit) * (BigInt(base) ** BigInt(power));
      
      if (showSteps) {
        steps.push(`${input[i]} * ${base}^${power} = ${digit * Math.pow(base, power)}`);
      }
    }

    if (showSteps) {
      steps.push(`Decimal value: ${result}`);
    }

    return result;
  }

  private fromDecimal(value: bigint, base: number, steps: string[], showSteps?: boolean): string {
    if (value === 0n) return this.digits[0];

    let result = '';
    let remaining = value;

    while (remaining > 0n) {
      const digit = Number(remaining % BigInt(base));
      result = this.digits[digit] + result;
      
      if (showSteps) {
        steps.push(`${remaining} % ${base} = ${digit} (${this.digits[digit]})`);
      }
      
      remaining = remaining / BigInt(base);
    }

    return result;
  }
}