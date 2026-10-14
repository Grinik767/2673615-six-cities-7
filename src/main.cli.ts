#!/usr/bin/env node
import process from 'node:process';
import chalk from 'chalk';
import {CLIApplication, HelpCommand, ImportCommand, VersionCommand} from './cli/index.js';

const application = new CLIApplication();
application.registerCommands([new HelpCommand(), new VersionCommand(), new ImportCommand()]);

application.processCommand(process.argv.slice(2)).catch((error: Error) => {
  console.error(chalk.red(error.message));
  process.exitCode = 1;
});
