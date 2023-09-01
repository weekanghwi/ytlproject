<script lang="ts">
  import Basemap from "../../../components/Basemap.svelte";
  import ClustermapManager from "../../../components/ClustermapManager.svelte";
  import ClusterPolygonadd from "../../../components/ClusterPolygonadd.svelte";

  let map: L.Map | null = null;

  function handleMapReady(leafletMap: CustomEvent) {
    map = leafletMap.detail;
  }

</script>

<div class="p-2 w-full pt-2">
  <Basemap on:ready={handleMapReady} />
  {#if map}<ClustermapManager {map} />{/if}
  {#if map}<ClusterPolygonadd {map} />{/if}
</div>
