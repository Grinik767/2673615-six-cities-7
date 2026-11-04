import chalk from 'chalk';
import {LineProcessedCallback, TSVFileReader} from '../../shared/libs/file-reader/index.js';
import {parseOffer} from '../../shared/libs/file-reader/offer-parser.js';
import {getErrorMessage} from '../../shared/helpers/index.js';
import {Command} from './command.interface.js';
import {MongoDatabaseClient} from '../../shared/libs/database-client/index.js';
import {PinoLogger} from '../../shared/libs/logger/index.js';
import {DefaultUserService, UserModel} from '../../shared/modules/user/index.js';
import {DefaultOfferService, OfferModel} from '../../shared/modules/offer/index.js';
import {CommentModel} from '../../shared/modules/comment/index.js';
import {DEFAULT_USER_NAME, DEFAULT_USER_PASSWORD, DEFAULT_USER_TYPE} from './command.constant.js';

export class ImportCommand implements Command {
  private readonly logger = new PinoLogger();
  private readonly databaseClient = new MongoDatabaseClient(this.logger);
  private readonly userService = new DefaultUserService(this.logger, UserModel, OfferModel);
  private readonly offerService = new DefaultOfferService(this.logger, OfferModel, CommentModel, UserModel);

  public getName(): string {
    return '--import';
  }

  private async onLine(salt: string, line: string, _lineNumber: number, done: LineProcessedCallback): Promise<void> {
    try {
      const offer = parseOffer(line);
      const user = await this.userService.findOrCreate({
        name: DEFAULT_USER_NAME,
        email: offer.author,
        password: DEFAULT_USER_PASSWORD,
        type: DEFAULT_USER_TYPE,
      }, salt);
      await this.offerService.create({...offer, author: user.id});
      done();
    } catch (error) {
      done(new Error(getErrorMessage(error)));
    }
  }

  private onComplete(count: number): void {
    console.log(chalk.green(`Импортировано предложений: ${count}`));
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, uri, salt] = parameters;
    if (parameters.length !== 3 || !filename?.trim() || !uri?.trim() || !salt?.trim()) {
      throw new Error('Укажите TSV-файл, URI MongoDB и соль: --import <filepath> <mongodb-uri> <salt>');
    }
    const fileReader = new TSVFileReader(filename);
    fileReader.on('line', this.onLine.bind(this, salt));
    fileReader.on('end', this.onComplete.bind(this));
    try {
      await this.databaseClient.connect(uri);
      await UserModel.init();
      await fileReader.read();
    } finally {
      await this.databaseClient.disconnect();
    }
  }
}
