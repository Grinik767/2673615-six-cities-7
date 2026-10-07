import {readFileSync} from 'node:fs';
import {Offer} from '../../types/index.js';
import {parseOffer} from './offer-parser.js';
import {FileReader} from './file-reader.interface.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf8'});
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .map((line, index) => ({line, lineNumber: index + 1}))
      .filter(({line}) => line.trim().length > 0)
      .map(({line, lineNumber}) => {
        try {
          return parseOffer(line.replace(/^\uFEFF/, '').replace(/\r$/, ''));
        } catch (error) {
          throw new Error(`Строка ${lineNumber}: ${(error as Error).message}`);
        }
      });
  }
}
