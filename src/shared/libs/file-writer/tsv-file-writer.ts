import {createWriteStream, WriteStream} from 'node:fs';
import {once} from 'node:events';
import {finished} from 'node:stream/promises';
import {FileWriter} from './file-writer.interface.js';

export class TSVFileWriter implements FileWriter {
  private readonly stream: WriteStream;
  private readonly completion: Promise<void>;
  private error?: Error;

  constructor(filename: string) {
    this.stream = createWriteStream(filename, {flags: 'w', encoding: 'utf8', highWaterMark: 64 * 1024});
    this.completion = finished(this.stream);
    this.completion.catch((error: Error) => {
      this.error = error;
    });
  }

  public async write(line: string): Promise<void> {
    if (this.error) {
      throw this.error;
    }
    if (!this.stream.write(`${line}\n`)) {
      await once(this.stream, 'drain');
    }
  }

  public async close(): Promise<void> {
    this.stream.end();
    await this.completion;
  }

  public destroy(): void {
    this.stream.destroy();
  }
}
