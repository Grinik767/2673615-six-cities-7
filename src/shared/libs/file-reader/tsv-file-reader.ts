import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import {Offer} from '../../types/index.js';
import {parseOffer} from './offer-parser.js';
import {FileReader} from './file-reader.interface.js';

export class TSVFileReader implements FileReader<Offer> {
  constructor(private readonly filename: string) {}

  public async *read(): AsyncGenerator<Offer> {
    const input = createReadStream(this.filename, {encoding: 'utf8'});
    const lines = createInterface({input, crlfDelay: Infinity});
    let lineNumber = 0;
    try {
      for await (const line of lines) {
        lineNumber++;
        if (!line.trim()) {
          continue;
        }
        try {
          yield parseOffer(line.replace(/^\uFEFF/, ''));
        } catch (error) {
          throw new Error(`Строка ${lineNumber}: ${(error as Error).message}`);
        }
      }
    } finally {
      lines.close();
      input.destroy();
    }
  }
}
