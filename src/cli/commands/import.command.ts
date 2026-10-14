import chalk from 'chalk';
import {TSVFileReader} from '../../shared/libs/file-reader/index.js';
import {Command} from './command.interface.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    if (!filename) {
      throw new Error('Укажите путь к TSV-файлу: --import [path]');
    }
    const fileReader = new TSVFileReader(filename);
    fileReader.read();
    const offers = fileReader.toArray();
    let count = 0;
    offers.forEach((offer) => {
      count++;
      console.log(chalk.cyan(`Предложение ${count}:`));
      console.log(JSON.stringify(offer, null, 2));
    });
    console.log(chalk.green(`Импортировано предложений: ${count}`));
  }
}
