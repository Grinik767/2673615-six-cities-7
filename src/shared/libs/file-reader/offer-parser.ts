import {Amenity, City, HousingType, Offer} from '../../types/index.js';

const cities: City[] = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];
const housingTypes: HousingType[] = ['apartment', 'house', 'room', 'hotel'];
const amenities: Amenity[] = ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'];

function numberInRange(value: string, name: string, min: number, max: number, integer = false): number {
  const result = Number(value);
  if (value.trim() === '' || !Number.isFinite(result) || result < min || result > max || (integer && !Number.isInteger(result))) {
    throw new Error(`Некорректное поле ${name}: ${value}`);
  }
  return result;
}

function booleanValue(value: string): boolean {
  if (value !== 'true' && value !== 'false') {
    throw new Error(`Некорректное логическое значение: ${value}`);
  }
  return value === 'true';
}

export function parseOffer(line: string): Offer {
  const fields = line.split('\t');
  if (fields.length !== 17) {
    throw new Error(`Ожидалось 17 полей, получено ${fields.length}`);
  }
  const [title, description, date, city, previewImage, images, premium, favorite,
    rating, housingType, rooms, guests, price, amenityList, authorEmail, latitude, longitude] = fields;
  if (!cities.includes(city as City) || !housingTypes.includes(housingType as HousingType)) {
    throw new Error('Некорректный город или тип жилья');
  }
  if (title.length < 10 || title.length > 100 || description.length < 20 || description.length > 1024) {
    throw new Error('Некорректная длина названия или описания');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
    throw new Error('Некорректный email автора');
  }
  const publicationDate = new Date(date);
  if (Number.isNaN(publicationDate.getTime())) {
    throw new Error(`Некорректная дата: ${date}`);
  }
  const photoList = images.split(';');
  const selectedAmenities = amenityList.split(';') as Amenity[];
  if (photoList.length !== 6 || photoList.some((item) => !item) || selectedAmenities.length === 0 || selectedAmenities.some((item) => !amenities.includes(item))) {
    throw new Error('Некорректный список фотографий или удобств');
  }
  if (!/^\d(?:[.,]\d)?$/.test(rating)) {
    throw new Error(`Некорректный рейтинг: ${rating}`);
  }
  return {
    title, description, publicationDate, city: city as City, previewImage, images: photoList,
    isPremium: booleanValue(premium), isFavorite: booleanValue(favorite),
    rating: numberInRange(rating.replace(',', '.'), 'rating', 1, 5), housingType: housingType as HousingType,
    rooms: numberInRange(rooms, 'rooms', 1, 8, true), guests: numberInRange(guests, 'guests', 1, 10, true),
    price: numberInRange(price, 'price', 100, 100000, true), amenities: selectedAmenities,
    author: authorEmail,
    commentCount: 0,
    coordinates: {latitude: numberInRange(latitude, 'latitude', -90, 90), longitude: numberInRange(longitude, 'longitude', -180, 180)},
  };
}
