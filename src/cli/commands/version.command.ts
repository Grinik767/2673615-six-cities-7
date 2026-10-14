import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import chalk from 'chalk';
import {Command} from './command.interface.js';

type PackageJSONConfig = {version: string};

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return typeof value === 'object' && value !== null && 'version' in value && typeof value.version === 'string';
}

export class VersionCommand implements Command {
  public getName(): string {
    return '--version';
  }

  public async execute(): Promise<void> {
    const packagePath = resolve(dirname(fileURLToPath(import.meta.url)), '../../../package.json');
    const packageJson: unknown = JSON.parse(await readFile(packagePath, 'utf8'));
    if (!isPackageJSONConfig(packageJson)) {
      throw new Error('Не удалось прочитать версию из package.json');
    }
    console.log(chalk.green(packageJson.version));
  }
}
