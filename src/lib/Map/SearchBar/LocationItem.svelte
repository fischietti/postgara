<script lang="ts">
  export let itemLabel: string;
  export let highlighted = false;
  export let disabled = false;
</script>

<li
  class="autocomplete-items"
  class:disabled
  class:autocomplete-active={highlighted}
  on:click
>
  {itemLabel}
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
