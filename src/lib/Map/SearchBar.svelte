<script context="module" lang="ts">
  import type { LatLong } from "./locations";
  export type SelectedLocation = { coordinates: LatLong };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import LocationSelect from "./SearchBar/LocationSelect.svelte";
  import type { Item } from "./SearchBar/LocationSelect.svelte";

  import { restaurants } from "./locations";

  export let maxOverflow: number;

  const restaurantItems: Item[] = restaurants.map((res) => ({
    value: res,
    label: res.name,
  }));

  const items = restaurantItems;

  const dispatch = createEventDispatcher();

  function handleSelect({ detail }: CustomEvent<Item>) {
    const event = { coordinates: detail.value.coordinates };
    dispatch("search", event);
  }
</script>

<div
  class="absolute top-4 left-1/3 sm:left-4 w-1/3 flex flex-col bg-white text-base"
  style="z-index: 1000;"
  on:mouseenter
  on:mouseleave
>
  <LocationSelect {items} {maxOverflow} on:select={handleSelect} />
</div>
