import * as readline from 'readline';
import chalk from 'chalk';
import { BaseConverter } from './converter';
import { REPLConfig, ConversionError } from './types';
import { log } from '@onamfc/developer-log';

export class REPL {
  private config: REPLConfig;
  private converter: BaseConverter;
  private rl: readline.Interface;

  constructor(config: REPLConfig) {
    this.config = config;
    this.converter = new BaseConverter(config.customDigits);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('base-convert> ')
    });
  }

  start(): void {
    console.log(chalk.bold('\nBase Converter REPL'));
    console.log(chalk.gray(`Converting from base ${this.config.fromBase} to base ${this.config.toBase}`));
    console.log(chalk.gray('Commands: :from <base>, :to <base>, :steps, :help, :quit\n'));

    this.rl.prompt();

    this.rl.on('line', (line: string) => {
      const input = line.trim();
      
      if (!input) {
        this.rl.prompt();
        return;
      }

      if (input.startsWith(':')) {
        this.handleCommand(input);
      } else {
        this.handleConversion(input);
      }

      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log(chalk.yellow('\nGoodbye!'));
      process.exit(0);
    });
  }

  private handleCommand(cmd: string): void {
    const parts = cmd.split(/\s+/);
    const command = parts[0];

    switch (command) {
      case ':from':
        if (parts[1]) {
          this.config.fromBase = parseInt(parts[1], 10);
          console.log(chalk.green(`Source base set to ${this.config.fromBase}`));
        }
        break;
      case ':to':
        if (parts[1]) {
          this.config.toBase = parseInt(parts[1], 10);
          console.log(chalk.green(`Target base set to ${this.config.toBase}`));
        }
        break;
      case ':steps':
        this.config.showSteps = !this.config.showSteps;
        console.log(chalk.green(`Steps ${this.config.showSteps ? 'enabled' : 'disabled'}`));
        break;
      case ':help':
        this.showHelp();
        break;
      case ':quit':
      case ':exit':
        this.rl.close();
        break;
      default:
        console.log(chalk.red(`Unknown command: ${command}`));
    }
  }

  private handleConversion(input: string): void {
    try {
      const result = this.converter.convert(input, this.config);
      console.log(chalk.green(`${result.output}`));
      
      if (result.steps) {
        console.log(chalk.gray('\nSteps:'));
        result.steps.forEach(step => console.log(chalk.gray(`  ${step}`)));
      }
    } catch (error) {
      if (error instanceof ConversionError) {
        console.log(chalk.red(`Error: ${error.message}`));
      } else {
        console.log(chalk.red('Unexpected error occurred'));
        log.error('REPL conversion error', error);
      }
    }
  }

  private showHelp(): void {
    console.log(chalk.bold('\nAvailable commands:'));
    console.log('  :from <base>  - Set source base');
    console.log('  :to <base>    - Set target base');
    console.log('  :steps        - Toggle step display');
    console.log('  :help         - Show this help');
    console.log('  :quit         - Exit REPL\n');
  }
}