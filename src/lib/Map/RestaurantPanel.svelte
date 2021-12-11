<script lang="ts">
  import { assets } from "$app/paths";
  import type { Restaurant } from "./locations";
  import { createEventDispatcher } from "svelte";

  export let restaurant: Restaurant;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }
</script>

<div
  class="absolute right-0 h-full w-full sm:w-4/12 bg-white flex flex-col text-base"
  style="z-index: 1100"
  on:pointerdown
  on:pointerup
  on:pointerenter
  on:pointerleave
>
  <div class="flex items-center">
    <h1 class="flex-1 ml-4 text-xl font-bold">{restaurant.name}</h1>
    <button class="m-2 w-8" on:click={close}>
      <img src="{assets}/icons/close.svg" alt="Chiudi" />
    </button>
  </div>

  <div class="flex mx-4 my-2 items-center">
    <img class="mr-2 w-8" src="{assets}/icons/place.svg" alt="Indirizzo" />
    <span class="flex-1">{restaurant.address}</span>
  </div>

  {#if restaurant.google}
    <div class="flex mx-4 my-2 items-center">
      <img class="mr-2 w-8" src="{assets}/icons/map.svg" alt="Google Maps" />
      <a class="flex-1 hover:underline" href={restaurant.google} target="_blank"
        >Link Google Maps</a
      >
    </div>
  {/if}

  {#if restaurant.tripadvisor}
    <div class="flex mx-4 my-2 items-center">
      <img
        class="mr-2 w-8"
        src="{assets}/icons/tripadvisor.svg"
        alt="Tripadvisor"
      />
      <a
        class="flex-1 hover:underline"
        href={restaurant.tripadvisor}
        target="_blank">Link Tripadvisor</a
      >
    </div>
  {/if}

  {#if restaurant.note}
    <div class="flex-1 flex flex-col ml-4 mt-2 min-h-0">
      <div class="font-semibold">Note</div>
      <div class="flex-1 overflow-auto">{restaurant.note}</div>
    </div>
  {/if}
</div>
