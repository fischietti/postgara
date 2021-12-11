<script context="module" lang="ts">
  import type { LatLong } from "./locations";
  export type SelectedLocation = { coordinates: LatLong };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import LocationSelect from "./SearchBar/LocationSelect.svelte";
  import type { Item } from "./SearchBar/LocationSelect.svelte";

  import { zones, restaurants } from "./locations";

  export let maxOverflow: number;

  const zoneItems: Item[] = zones.map((zone) => ({
    value: zone,
    label: zone.name,
    icon: "city",
  }));

  const restaurantItems: Item[] = restaurants.map((res) => ({
    value: res,
    label: res.name,
    icon: "place",
  }));

  const items = zoneItems.concat(restaurantItems);

  const dispatch = createEventDispatcher();

  function handleSelect({ detail }: CustomEvent<Item>) {
    const event = { coordinates: detail.value.coordinates };
    dispatch("search-select", event);
  }
</script>

<div
  class="absolute top-4 left-4 right-4 sm:right-2/3 flex flex-col bg-white text-base"
  style="z-index: 1000;"
  on:pointerenter
  on:pointerleave
>
  <LocationSelect
    {items}
    {maxOverflow}
    on:select={handleSelect}
    on:focus
    on:blur
  />
</div>
