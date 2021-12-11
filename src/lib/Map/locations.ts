import type { Nullable } from "$lib/types";
import restaurantCollection from "./restaurants.json";
import zoneCollection from "./zones.json";

export type LatLong = [number, number];

export type Restaurant = {
  name: string;
  proposalDate: string;
  address: string;
  coordinates: LatLong;
  zone: Nullable<string>;
  google: Nullable<string>;
  tripadvisor: Nullable<string>;
  note: Nullable<string>;
};

export const restaurants = restaurantCollection as Restaurant[];

export type Zone = {
  name: string;
  coordinates: LatLong;
};

export const zones = zoneCollection as Zone[];
