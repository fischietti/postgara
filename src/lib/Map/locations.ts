export type LatLong = [number, number];

export type Restaurant = {
  name: string;
  coordinates: LatLong;
  address: string;
  proposalDate: string;
  google: string;
};

import restaurantCollection from "./restaurants.json";

export const restaurants = restaurantCollection as Restaurant[];
