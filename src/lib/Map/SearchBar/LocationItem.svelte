<script lang="ts">
  import { assets } from "$app/paths";

  export let label: string;
  export let icon: string | undefined = undefined;
  export let highlighted = false;
  export let disabled = false;
</script>

<li
  class="autocomplete-items"
  class:disabled
  class:autocomplete-active={highlighted}
  on:click
>
  <div class="flex">
    {#if icon}
      <img class="w-6 mr-2" src="{assets}/icons/{icon}.svg" alt="Place" />
    {/if}
    <span class="flex-1">{label}</span>
  </div>
</li>

<style>
  li.autocomplete-items {
    list-style: none;
    border-bottom: 1px solid #d4d4d4;
    z-index: 1000;
    /*position the autocomplete items to be the same width as the container:*/
    top: 100%;
    left: 0;
    right: 0;
    padding: 10px;
    background-color: #fff;
  }

  li.autocomplete-items:not(.disabled):hover {
    /*when hovering with the mouse*/
    background-color: DodgerBlue !important;
    color: white;
    cursor: pointer;
  }

  li.autocomplete-active {
    /*when navigating using the arrow keys:*/
    background-color: DodgerBlue !important;
    color: #ffffff;
  }
</style>
