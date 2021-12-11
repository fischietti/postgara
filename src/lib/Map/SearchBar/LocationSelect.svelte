<script context="module" lang="ts">
  export type Item = {
    value: any;
    label: string;
    icon?: string;
  };
</script>

<script lang="ts">
  import { assets } from "$app/paths";
  import { createEventDispatcher } from "svelte";
  import LocationItem from "./LocationItem.svelte";

  import type { Nullable } from "$lib/types";

  export let items: Item[];
  export let maxOverflow: number;

  let searchText = "";

  function clear() {
    searchText = "";
  }

  /* Events */

  const dispatch = createEventDispatcher();

  function selectItem(item: Item) {
    dispatch("select", item);
    clear();
  }

  /* Autocomplete  */

  $: autocompleteItems = autocomplete(items, searchText);

  function autocomplete(items: Item[], searchText: string): Item[] {
    if (searchText === "") {
      return [];
    }
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  /* Keyboard navigation */

  let arrowIndex: Nullable<number> = null;

  function clearKeyboardSelection() {
    arrowIndex = null;
  }

  $: if (!searchText) {
    clearKeyboardSelection();
  }

  function ensureBoundaries(index: number): number {
    return (autocompleteItems.length + index) % autocompleteItems.length;
  }

  function onKeyboardEvent(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      arrowIndex = ensureBoundaries((arrowIndex ?? -1) + 1);
    } else if (e.key === "ArrowUp") {
      arrowIndex = ensureBoundaries((arrowIndex ?? 0) - 1);
    } else if (e.key === "Enter") {
      selectItem(autocompleteItems[arrowIndex]);
    } else if (e.key === "Escape") {
      clear();
    }
  }
</script>

<svelte:window on:keydown={onKeyboardEvent} />

<div class="flex flex-col">
  <div class="flex border">
    <input
      class="flex-1 p-3 focus:outline-none"
      type="text"
      placeholder="Cerca"
      bind:value={searchText}
    />

    <button class="mr-2 w-8" on:click={clear}>
      <img src="{assets}/icons/close.svg" alt="Cancella" />
    </button>
  </div>

  {#if searchText}
    {#if autocompleteItems.length}
      <ul
        class="overflow-auto flex-1"
        style="max-height: {maxOverflow}px"
        on:mouseenter={clearKeyboardSelection}
      >
        {#each autocompleteItems as item, i}
          <LocationItem
            label={item.label}
            icon={item.icon}
            highlighted={i === arrowIndex}
            on:click={() => selectItem(item)}
          />
        {/each}
      </ul>
    {:else}
      <ul>
        <LocationItem label="Nessun risultato" disabled />
      </ul>
    {/if}
  {/if}
</div>
