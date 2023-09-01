<script lang="ts">
  export let map: L.Map;
  export let sites = [];

  async function fetchSites() {
    const response = await fetch('http://10.24.8.120:8000/api/sitebasicinfo/');
    sites = await response.json();

    sites.forEach(site => {
      // 마커 처리
      const marker = L.marker([site.latitude, site.longitude]);
      marker.addTo(map);
    });
  }

  $: if (map) {
    fetchSites();
  }
</script>