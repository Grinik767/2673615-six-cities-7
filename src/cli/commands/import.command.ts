import {once} from 'node:events';
import chalk from 'chalk';
import {LineProcessedCallback, TSVFileReader} from '../../shared/libs/file-reader/index.js';
import {parseOffer} from '../../shared/libs/file-reader/offer-parser.js';
import {getErrorMessage} from '../../shared/helpers/index.js';
import {Command} from './command.interface.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private async onLine(line: string, lineNumber: number, done: LineProcessedCallback): Promise<void> {
    try {
      const offer = parseOffer(line);
      const output = `${chalk.cyan(`Предложение (строка ${lineNumber}):`)}\n${JSON.stringify(offer, null, 2)}\n`;
      if (!process.stdout.write(output)) {
        await once(process.stdout, 'drain');
      }
      done();
    } catch (error) {
      done(new Error(getErrorMessage(error)));
    }
  }

  private onComplete(count: number): void {
    console.log(chalk.green(`Импортировано предложений: ${count}`));
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    if (parameters.length !== 1 || !filename) {
      throw new Error('Укажите путь к TSV-файлу: --import <filepath>');
    }
    const fileReader = new TSVFileReader(filename);
    fileReader.on('line', this.onLine.bind(this));
    fileReader.on('end', this.onComplete.bind(this));
    await fileReader.read();
  }
}
