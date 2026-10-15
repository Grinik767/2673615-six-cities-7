import {Amenity, City, Coordinates, HousingType} from './offer.type.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: {name: City; coordinates: Coordinates}[];
  previewImages: string[];
  images: string[];
  housingTypes: HousingType[];
  amenities: Amenity[];
  authorEmails: string[];
};
