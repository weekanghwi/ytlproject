<script lang="ts">
  import type { Map as LeafletMap, Marker } from 'leaflet';
	import { Button, Input } from 'flowbite-svelte';
  export let map: LeafletMap | null;
  let L: any;
  let marker: Marker | null = null;

  let coordinates: string = '';

  if (typeof window !== 'undefined') {
    import('leaflet').then(leaflet => {
      L = leaflet;
    })
  }

  function searchLocationAndPlaceMarker() {
    const coordsArray = coordinates.split(/[\s,]+/).map(Number);

    if (coordsArray.length !== 2 || coordsArray.includes(NaN)) {
      alert('Invalid coordinates');
      return;
    }

    const [lat, lng] = coordsArray;

    if (marker) {
      marker.remove();
    }

    marker = L.marker([lat, lng]);
    marker?.addTo(map);
    marker?.bindPopup('This is the searched location').openPopup()
  }
</script>

<div class="search-container flex text-sm gap-2">
  <Input size="sm" id="coordinates" type="text" bind:value={coordinates} placeholder="Enter coordinates lat, lon" />
  <Button size="xs" color="red" on:click={searchLocationAndPlaceMarker}>Search</Button>
</div>

<style>
  .search-container {
    position: absolute;
    top: 17px;
    left: 120px;
    z-index: 1000;
  }
</style>