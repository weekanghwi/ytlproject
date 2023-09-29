<script lang="ts">
  import Basemap from "../../../components/Basemap.svelte";
  import ClustermapManager from "../../../components/ClustermapManager.svelte";
  import ClusterPolygonadd from "../../../components/ClusterPolygonadd.svelte";
  import GpsSearch from "../../../components/GpsSearch.svelte";
  import SitemapManager from "../../../components/SitemapManager.svelte";

  let map: L.Map | null = null;

  function handleMapReady(leafletMap: CustomEvent) {
    map = leafletMap.detail;
  }

</script>

<div class="p-2 w-full pt-2 relative">
  <Basemap on:ready={handleMapReady} />
  {#if map}<ClustermapManager {map} />{/if}
  {#if map}<ClusterPolygonadd {map} />{/if}
  {#if map}<GpsSearch {map} />{/if}
  {#if map}<SitemapManager {map} />{/if}
</div>
