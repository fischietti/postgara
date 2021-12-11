<script>
  import "../app.css";
  import { assets } from "$app/paths";
</script>

<svelte:head>
  <link rel="icon" href="{assets}/favicon.png" />
  <link rel="manifest" href="{assets}/manifest.json" />
</svelte:head>

<slot />
