import {Amenity, City, Coordinates, HousingType, Offer} from '../../../types/index.js';

export class CreateOfferDto implements Omit<Offer, 'commentCount' | 'rating' | 'isFavorite'> {
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public housingType!: HousingType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public amenities!: Amenity[];
  public author!: string;
  public coordinates!: Coordinates;
}
