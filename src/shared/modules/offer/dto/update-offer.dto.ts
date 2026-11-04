import {Amenity, City, Coordinates, HousingType} from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public publicationDate?: Date;
  public city?: City;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public housingType?: HousingType;
  public rooms?: number;
  public guests?: number;
  public price?: number;
  public amenities?: Amenity[];
  public coordinates?: Coordinates;
}
