import {createReadStream} from 'node:fs';
import {EventEmitter} from 'node:events';
import {getErrorMessage} from '../../helpers/index.js';
import {FileReader} from './file-reader.interface.js';

export type LineProcessedCallback = (error?: Error) => void;

export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(private readonly filename: string) {
    super();
  }

  private async processLine(line: string, lineNumber: number): Promise<boolean> {
    const normalizedLine = line.replace(/^\uFEFF/, '').replace(/\r$/, '');
    if (normalizedLine.trim().length === 0) {
      return false;
    }
    try {
      await new Promise<void>((resolve, reject) => {
        const done: LineProcessedCallback = (error) => error ? reject(error) : resolve();
        if (!this.emit('line', normalizedLine, lineNumber, done)) {
          resolve();
        }
      });
    } catch (error) {
      throw new Error(`Строка ${lineNumber}: ${getErrorMessage(error)}`);
    }
    return true;
  }

  public async read(): Promise<void> {
    const stream = createReadStream(this.filename, {encoding: 'utf8', highWaterMark: 64 * 1024});
    let remaining = '';
    let lineNumber = 0;
    let count = 0;

    try {
      for await (const chunk of stream) {
        remaining += chunk;
        let end = remaining.indexOf('\n');
        while (end !== -1) {
          const line = remaining.slice(0, end);
          remaining = remaining.slice(end + 1);
          lineNumber++;
          if (await this.processLine(line, lineNumber)) {
            count++;
          }
          end = remaining.indexOf('\n');
        }
      }
      if (remaining.length > 0 && await this.processLine(remaining, lineNumber + 1)) {
        count++;
      }
      this.emit('end', count);
    } finally {
      stream.destroy();
    }
  }
}
