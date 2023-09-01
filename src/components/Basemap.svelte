<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import 'leaflet/dist/leaflet.css';

  let map: L.Map | null = null;
  const dispatch = createEventDispatcher();

  function createMap(container: HTMLElement) {
    // Leaflet 라이브러리 동적으로 불러오기
    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        map = L.map(container, {
          zoomControl: false,
        }).setView([3.180941, 101.695946], 15);

        L.control.zoom({ position: 'bottomright' }).addTo(map);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
            &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map);
        
        dispatch('ready', map);
      });
    }
  }

  function mapAction(container: HTMLElement) {
    createMap(container);
    return {
      destroy: () => {
        map?.remove();
      },
    };
  }
</script>

<div id="map" use:mapAction class="w-full h-[calc(100vh-90.8px)] rounded-lg">
</div>
