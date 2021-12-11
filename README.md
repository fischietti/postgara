# Postgara

Una [mappa interattiva](https://fischietti.github.io/postgara/) di posti dove andare a mangiare dopo la partita.

## Contribuisci

Consiglia un nuovo posto compilando [questo form](https://docs.google.com/forms/d/e/1FAIpQLSfX8cw8hqlewxoig6UUvKbgxjjIizP3qUU5S1ZLJpZqaRoClQ/viewform?usp=sf_link)

## Architettura

L'anagrafica dei posti è censita su un Google Sheet che viene aggiornato manualmente a seguito di segnalazioni tramite Google Form.  
Il sito è statico, hostato su Github Pages ed ri-buildato periodicamente tramite Github Actions recuperando l'anagrafica aggiornata.

## Strumenti

|---------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|
|[Svelte](https://svelte.dev/) |Framework web |
|[SvelteKit](https://kit.svelte.dev/) |Build del sito statico |
|[TailwindCSS](https://tailwindcss.com/) |Prevent me from touching CSS files|
|[Typescript](https://www.typescriptlang.org/) ||
|[Leaflet](https://leafletjs.com/) |Mappa interattiva |
|[OpenStreetMap](https://www.openstreetmap.org/) |Fonte dati geografici |
|[MaterialIcons](https://fonts.google.com/icons?selected=Material+Icons&icon.query=map) |Set di icone|
