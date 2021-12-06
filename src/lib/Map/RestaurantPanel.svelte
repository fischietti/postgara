<script lang="ts">
  import type { Restaurant } from "./types";
  export let restaurant: Restaurant;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }
</script>

<div
  class="absolute right-0 h-full w-full sm:w-4/12 bg-white flex flex-col"
  style="z-index: 1100"
>
  <div class="flex text-base">
    <h3 class="flex-1">{restaurant.name}</h3>
    <button on:click={close}>Chiudi</button>
  </div>
</div>
