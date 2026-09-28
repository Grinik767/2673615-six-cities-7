import chalk from 'chalk';
import {Command} from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(): Promise<void> {
    console.log(chalk.blue(`Программа для подготовки данных для REST API сервера.

Пример: npm run cli -- --<command> [arguments]

Команды:
  --version                    выводит номер версии
  --help                       печатает этот текст
  --import <path>              читает предложения из TSV и выводит их в консоль
  --generate <n> <path> <url>   создаёт TSV с тестовыми данными`));
  }
}
