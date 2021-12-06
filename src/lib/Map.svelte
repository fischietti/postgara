<script lang="ts">
  import { onMount } from "svelte";
  import classNames from "classnames";

  import restaurants from "./Map/restaurants.json";
  import DetailsPanel from "./Map/RestaurantPanel.svelte";
  import Contribute from "./Map/Contribute.svelte";

  import type { Nullable } from "$lib/types";
  import type { Layer, LocationEvent } from "leaflet";
  import type { FeatureCollection } from "geojson";
  import type { Restaurant } from "./Map/types";
  import type { Feature, Point } from "geojson";

  import "leaflet/dist/leaflet.css";

  export let classname: string;

  let restaurant: Nullable<Restaurant>;

  function select(selected: Restaurant) {
    restaurant = selected;
  }

  function deselect() {
    restaurant = null;
  }

  async function initializeMap() {
    const L = await import("leaflet");

    //https://stackoverflow.com/questions/41144319/leaflet-marker-not-found-production-env
    L.Icon.Default.prototype.options.imagePath = "icons/";

    const MILANO = { lat: 45.45142, lng: 9.181 };
    const map = L.map("map", { zoomControl: false }).setView(MILANO, 13);

    // add map layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // add current location
    map.locate({ setView: true, maxZoom: 16, watch: false });
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

    // add restaurants
    L.geoJSON(restaurants as FeatureCollection, {
      pointToLayer: function (feature, latlng) {
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

  onMount(initializeMap);
</script>

<div id="map" class={classNames(classname)}>
  <Contribute />
  {#if restaurant}
    <DetailsPanel {restaurant} on:close={deselect} />
  {/if}
</div>
