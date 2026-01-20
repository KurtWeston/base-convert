export interface ConversionOptions {
  fromBase: number;
  toBase: number;
  customDigits?: string;
  showSteps?: boolean;
  uppercase?: boolean;
}

export interface ConversionResult {
  input: string;
  output: string;
  fromBase: number;
  toBase: number;
  steps?: string[];
}

export interface REPLConfig {
  fromBase: number;
  toBase: number;
  customDigits?: string;
  showSteps: boolean;
  uppercase: boolean;
}

export class ConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConversionError';
  }
}