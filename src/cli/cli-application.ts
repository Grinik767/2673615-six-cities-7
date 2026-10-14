import {CommandParser} from './command-parser.js';
import {Command} from './commands/command.interface.js';

export class CLIApplication {
  private readonly commands = new Map<string, Command>();

  constructor(private readonly defaultCommand = '--help') {}

  public registerCommands(commands: Command[]): void {
    for (const command of commands) {
      const name = command.getName();
      if (this.commands.has(name)) {
        throw new Error(`Команда ${name} уже зарегистрирована`);
      }
      this.commands.set(name, command);
    }
  }

  public async processCommand(argumentsList: string[]): Promise<void> {
    const {name, arguments: parameters} = CommandParser.parse(argumentsList);
    const command = this.commands.get(name);
    if (!command) {
      throw new Error(`Неизвестная команда: ${name}. Используйте ${this.defaultCommand}.`);
    }
    await command.execute(...parameters);
  }
}
