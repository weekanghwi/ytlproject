<script lang="ts">
  import { onMount } from "svelte";
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.heat';
	import { Button } from "flowbite-svelte";

  let map: L.Map;
  let loading = false;
  let heatmapData: { lat: number; lon: number; totalprbdl: number }[] = [];
  let regions = {
    'Central': [3.1390, 101.6869],
    'Northern': [5.4141, 100.3288],
    'Southern': [1.4927, 103.7414],
    'Eastern': [3.1698, 113.0371],
    'Sabah': [5.9788, 116.0753],
    'Sarawak': [1.5533, 110.3592]
  };

  let bands: string[] = ['2.3GHz', '2.6GHz', '800M'];
  let clusters: string[] = [];
  let selectedRegion: keyof typeof regions | null = null;
  let selectedBand: string | null = null;
  let selectedCluster: string | null = null;
  let showAll = false;
  let heatLayer: L.HeatLayer | null = null;

  const fetchHeatmapData = async () => {
    const query = new URLSearchParams();
    if (selectedRegion) query.set('region', selectedRegion);
    if (selectedCluster) query.set('cluster', selectedCluster);
    if (selectedBand) query.set('band', selectedBand);
    if (showAll) query.set('show_all', 'true');

    const response = await fetch(`http://10.24.8.120:8000/api/prbdlheatmap/?${query.toString()}`);
    const data = await response.json();
    heatmapData = data.heatmap_data;
  };

  const initializeMap = () => {
    map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([3.115196667, 101.6536514], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      noWrap: true
    }).addTo(map);
  };

  const updateMap = async () => {
    loading = true;
    await fetchHeatmapData();

    const formattedData: [number, number, number][] = heatmapData.map(item => [
      item.lat,
      item.lon,
      Number(item.totalprbdl) || 0
    ]);

    if (heatLayer) {
      map.removeLayer(heatLayer);
    }

    if (formattedData.length > 0) {
      heatLayer = L.heatLayer(formattedData, {
        radius: 30,
        blur: 15,
        maxZoom: 18,
        max: 40,
        gradient: {
          0.0: 'rgb(19,8,236)',
          0.2: 'rgb(8,236,232)',
          0.4: 'rgb(46,236,8)',
          0.6: 'rgb(236,221,8)',
          0.8: 'rgb(236,141,8)',
          1.0: 'rgb(236,8,8)'
        }
      });
      heatLayer.addTo(map);
    }

    if (selectedRegion && regions[selectedRegion]) {
      map.setView(regions[selectedRegion] as [number, number], 10)
    }

    loading = false;
  };

  onMount(() => {
    initializeMap();
  });
</script>

<style>

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }

  .spinner {
    border: 16px solid #f3f3f3;
    border-top: 16px solid #3498db;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 1s linear infinite;
  }

  .filters {
    z-index: 999
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

{#if loading}
  <div class="loading flex items-center justify-center h-full w-full">
    <div class="spinner"></div>
  </div>
{/if}

<div id="map" class="h-[calc(100vh-100px)] rounded-md ms-4 relative -z-10">

</div>
<div class="filters flex items-center justify-center gap-2 absolute top-[95px] left-[285px] rounded-md bg-black/20 p-1">

  <select bind:value={selectedBand} class="rounded-md h-8">
    <option value="">Select Band</option>
    {#each bands as band}
      <option value={band}>{band}</option>
    {/each}
  </select>

  <select bind:value={selectedRegion} class="rounded-md h-8">
    <option value="">Select Region</option>
    {#each Object.keys(regions) as region}
      <option value={region}>{region}</option>
    {/each}
  </select>

  <select bind:value={selectedCluster} class="rounded-md h-8">
    <option value="">Select Cluster</option>
    {#each clusters as cluster}
      <option value={cluster}>{cluster}</option>
    {/each}
  </select>

  <label class="flex items-center gap-1">
    <input type="checkbox" bind:checked={showAll} class="rounded-md" />
      <p class="text-md text-white font-bold">Show All</p>
  </label>

  <Button size="xs" color="blue" on:click={updateMap}>Apply Filters</Button>
</div>

