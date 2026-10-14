export type ParsedCommand = {name: string; arguments: string[]};

export class CommandParser {
  public static parse(argumentsList: string[]): ParsedCommand {
    const [name = '--help', ...parameters] = argumentsList;
    return {name, arguments: parameters};
  }
}
