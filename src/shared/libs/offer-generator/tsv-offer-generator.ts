import {generateRandomValue, getRandomItem, getRandomItems} from '../../helpers/index.js';
import {MockServerData} from '../../types/index.js';
import {OfferGenerator} from './offer-generator.interface.js';

const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const city = getRandomItem(this.mockData.cities);
    const publicationDate = new Date(Date.now() - generateRandomValue(0, WEEK_IN_MILLISECONDS));

    return [
      getRandomItem(this.mockData.titles),
      getRandomItem(this.mockData.descriptions),
      publicationDate.toISOString(),
      city.name,
      getRandomItem(this.mockData.previewImages),
      Array.from({length: 6}, () => getRandomItem(this.mockData.images)).join(';'),
      getRandomItem([true, false]),
      getRandomItem([true, false]),
      generateRandomValue(10, 50) / 10,
      getRandomItem(this.mockData.housingTypes),
      generateRandomValue(1, 8),
      generateRandomValue(1, 10),
      generateRandomValue(100, 100000),
      getRandomItems(this.mockData.amenities).join(';'),
      getRandomItem(this.mockData.authorEmails),
      city.coordinates.latitude,
      city.coordinates.longitude,
    ].join('\t');
  }
}
