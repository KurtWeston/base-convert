#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as readline from 'readline';
import { BaseConverter } from './converter';
import { REPL } from './repl';
import { ConversionError } from './types';
import { log } from '@onamfc/developer-log';

const program = new Command();

program
  .name('base-convert')
  .description('Convert numbers between arbitrary bases (2-62)')
  .version('1.0.0');

program
  .argument('[number]', 'Number to convert')
  .option('-f, --from <base>', 'Source base (2-62)', '10')
  .option('-t, --to <base>', 'Target base (2-62)', '10')
  .option('-d, --digits <chars>', 'Custom digit set')
  .option('-s, --steps', 'Show conversion steps', false)
  .option('-u, --uppercase', 'Output uppercase letters', false)
  .option('-b, --batch <file>', 'Batch convert from file')
  .option('-i, --interactive', 'Start interactive REPL mode', false)
  .action(async (number, options) => {
    try {
      const fromBase = parseInt(options.from, 10);
      const toBase = parseInt(options.to, 10);

      if (options.interactive) {
        const repl = new REPL({
          fromBase,
          toBase,
          customDigits: options.digits,
          showSteps: options.steps,
          uppercase: options.uppercase
        });
        repl.start();
        return;
      }

      const converter = new BaseConverter(options.digits);

      if (options.batch) {
        await processBatch(options.batch, converter, { fromBase, toBase, showSteps: options.steps, uppercase: options.uppercase });
        return;
      }

      if (!number) {
        if (process.stdin.isTTY) {
          program.help();
        } else {
          await processStdin(converter, { fromBase, toBase, showSteps: options.steps, uppercase: options.uppercase });
        }
        return;
      }

      const result = converter.convert(number, {
        fromBase,
        toBase,
        customDigits: options.digits,
        showSteps: options.steps,
        uppercase: options.uppercase
      });

      console.log(result.output);
      
      if (result.steps) {
        console.log(chalk.gray('\nConversion steps:'));
        result.steps.forEach(step => console.log(chalk.gray(`  ${step}`)));
      }
    } catch (error) {
      if (error instanceof ConversionError) {
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
      }
      throw error;
    }
  });

async function processStdin(converter: BaseConverter, options: any): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin });
  
  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed) {
      try {
        const result = converter.convert(trimmed, options);
        console.log(result.output);
      } catch (error) {
        if (error instanceof ConversionError) {
          console.error(chalk.red(`Error converting '${trimmed}': ${error.message}`));
        }
      }
    }
  }
}

async function processBatch(file: string, converter: BaseConverter, options: any): Promise<void> {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed) {
      try {
        const result = converter.convert(trimmed, options);
        console.log(`${trimmed} -> ${result.output}`);
      } catch (error) {
        if (error instanceof ConversionError) {
          console.error(chalk.red(`Error: ${trimmed} -> ${error.message}`));
        }
      }
    }
  }
}

program.parse();