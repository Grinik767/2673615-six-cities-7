import chalk from 'chalk';
import got from 'got';
import {TSVFileWriter} from '../../shared/libs/file-writer/index.js';
import {TSVOfferGenerator} from '../../shared/libs/offer-generator/index.js';
import {MockServerData} from '../../shared/types/index.js';
import {Command} from './command.interface.js';

export class GenerateCommand implements Command {
  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filename, url] = parameters;
    if (parameters.length !== 3 || !filename || !url) {
      throw new Error('Укажите количество, путь к TSV-файлу и URL: --generate <n> <filepath> <url>');
    }
    const offerCount = Number(count);
    if (!/^\d+$/.test(count) || !Number.isSafeInteger(offerCount) || offerCount < 1) {
      throw new Error('Количество предложений должно быть положительным целым числом');
    }

    const mockData = await got.get(url, {timeout: {request: 10000}, retry: {limit: 0}}).json<MockServerData>();
    if (!mockData || !['titles', 'descriptions', 'cities', 'previewImages', 'images', 'housingTypes', 'amenities', 'authorEmails']
      .every((key) => Array.isArray(mockData[key as keyof MockServerData]) && mockData[key as keyof MockServerData].length > 0)) {
      throw new Error('JSON-сервис вернул некорректные или пустые заготовки данных');
    }
    const generator = new TSVOfferGenerator(mockData);
    const fileWriter = new TSVFileWriter(filename);

    try {
      for (let index = 0; index < offerCount; index++) {
        await fileWriter.write(generator.generate());
      }
      await fileWriter.close();
    } finally {
      fileWriter.destroy();
    }

    console.log(chalk.green(`Сгенерировано предложений: ${offerCount}. Файл: ${filename}`));
  }
}
