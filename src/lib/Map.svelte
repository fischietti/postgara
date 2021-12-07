<script lang="ts">
  import { onMount } from "svelte";
  import classNames from "classnames";

  import { restaurants } from "./Map/locations";
  import RestaurantPanel from "./Map/RestaurantPanel.svelte";
  import Contribute from "./Map/Contribute.svelte";
  import SearchBar from "./Map/SearchBar.svelte";

  import type { Nullable } from "$lib/types";
  import type { Map, LatLngExpression, Layer, LocationEvent } from "leaflet";
  import type { Restaurant } from "./Map/locations";
  import type { FeatureCollection, Feature, Point } from "geojson";
  import type { SelectedLocation } from "./Map/SearchBar.svelte";

  import "leaflet/dist/leaflet.css";

  export let classname: string;

  let mapHeight: number;

  // Selection
  let restaurant: Nullable<Restaurant> = null;

  function select(selected: Restaurant) {
    restaurant = selected;
  }

  function deselect() {
    restaurant = null;
  }

  // Leaflet map
  let map: Nullable<Map> = null;

  const DEFAULT_ZOOM = 13;

  function setLocation(latLong: LatLngExpression) {
    map?.setView(latLong, DEFAULT_ZOOM);
  }

  async function initializeMap() {
    const L = await import("leaflet");

    //https://stackoverflow.com/questions/41144319/leaflet-marker-not-found-production-env
    L.Icon.Default.prototype.options.imagePath = "icons/";

    const MILANO = { lat: 45.45142, lng: 9.181 };
    map = L.map("map", { zoomControl: false }).setView(MILANO, DEFAULT_ZOOM);

    // add map layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // add current location
    function onLocationFound(e: LocationEvent) {
      L.circleMarker(e.latlng, {
        radius: 8,
        fill: true,
        fillOpacity: 1,
        opacity: 0.5,
      })
        .bindPopup("La tua posizione")
        .addTo(map);
    }
    map.on("locationfound", onLocationFound);
    map.locate({ setView: true, maxZoom: 16, watch: false });

    // add restaurants
    const restaurantCollection: FeatureCollection = {
      type: "FeatureCollection",
      features: restaurants.map((res) => ({
        type: "Feature",
        properties: res,
        geometry: {
          type: "Point",
          coordinates: res.coordinates.slice().reverse(),
        },
      })),
    };

    L.geoJSON(restaurantCollection, {
      pointToLayer: function (
        feature: Feature<Point, Restaurant>,
        latlng: LatLngExpression
      ) {
        return L.marker(latlng).bindTooltip(feature.properties.name, {
          permanent: true,
          direction: "right",
          opacity: 1,
        });
      },
      onEachFeature: function (
        feature: Feature<Point, Restaurant>,
        layer: Layer
      ) {
        layer.on("click", () => {
          select(feature.properties);
        });
      },
    }).addTo(map);
  }

  function disableMapInteraction() {
    if (!map) return;
    (map as any)._handlers.forEach((handler) => handler.disable());
  }

  function enableMapInteraction() {
    if (!map) return;
    (map as any)._handlers.forEach((handler) => handler.enable());
  }

  onMount(initializeMap);

  // Search
  function handleSearch({ detail }: CustomEvent<SelectedLocation>) {
    setLocation(detail.coordinates);
    enableMapInteraction();
  }
</script>

<div id="map" class={classNames(classname)} bind:clientHeight={mapHeight}>
  <SearchBar
    maxOverflow={mapHeight / 2}
    on:search={handleSearch}
    on:mouseenter={disableMapInteraction}
    on:mouseleave={enableMapInteraction}
  />

  <Contribute />

  {#if restaurant}
    <RestaurantPanel
      {restaurant}
      on:close={deselect}
      on:mouseenter={disableMapInteraction}
      on:mouseleave={enableMapInteraction}
    />
  {/if}
</div>
