<script lang="ts">
  import type { Map as LeafletMap, LayerGroup } from 'leaflet';

  export let map: LeafletMap | null = null;
  let L: any;
  let regionLayers: { [region: string]: LayerGroup } = {};
  let selectedRegion: any | null = null;

  const regionMapping = {
    1: 'Central',
    2: 'Northern',
    3: 'Southern',
    4: 'Eastern',
    5: 'Sabah',
    6: 'Sarawak'
  };

  interface Cluster {
    id: number;
    cluster: string;
    region: string;
    polygon: {
      coordinates: [[[number, number]]];
    }
  }


  if (typeof window !== 'undefined') {
    import('leaflet').then(leaflet => {
      L = leaflet;
    });
  }

  function showPolygonInfo(cluster: Cluster, latlng: L.LatLng) {
    const info = `
      <strong>Cluster</strong> ${cluster.cluster}<br>
      <strong>Region</strong> ${cluster.region}
    `;
    L.popup()
      .setLatLng(latlng)
      .setContent(info)
      .openOn(map);
  }

  async function fetchClustersByRegion(regions: number[]) {
    if (!L || !map) return;

    try {
      const regionParams = regions.map(r => `region=${r}`).join('&');
      const regionKey = regions.join(',');
      const response = await fetch(`http://10.24.8.120:8000/api/clusters?${regionParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} `);
      }

      const clustersData: Cluster[] = await response.json();
      
      regions.forEach(region => {
        regionLayers[region]?.clearLayers();
      })

      clustersData.forEach(cluster => {
        const coordinates = cluster.polygon.coordinates[0].map(coord => [coord[1], coord[0]]);
        const polygon = L.polygon(coordinates, { color: 'green' });

        polygon.on('click', (event: L.LeafletMouseEvent) => {
          const clickLocation = event.latlng
          showPolygonInfo(cluster, clickLocation);
        });

        if (!regionLayers[regionKey]) {
          regionLayers[regionKey] = L.layerGroup();
        }
        regionLayers[regionKey].addLayer(polygon);
      });

      regionLayers[regionKey]?.addTo(map);
    } catch (error) {
      console.error('An error occurred while fetching clusters:', error)
    }
  }

  function toggleAllRegions() {
    if (map === null) {
      return;  // map이 null인 경우 함수를 빠져나갑니다.
    }

    if (selectedRegion === 'all') {
      Object.values(regionLayers).forEach(layerGroup => layerGroup.remove());
      selectedRegion = null;
    } else {
      Object.values(regionLayers).forEach(layerGroup => layerGroup.addTo(map));
      selectedRegion = 'all';
    }
  }

  function toggleRegion(region: number) {
    if (selectedRegion === region) {
      regionLayers[region]?.remove();
      selectedRegion = null;
    } else {
      Object.values(regionLayers).forEach(layerGroup => layerGroup.remove());
      fetchClustersByRegion([region]);  // 여기서 API 호출
      selectedRegion = region;
    }
  }


  $: if (map && L) {
    const regionsControl = L.control({ position: 'topleft' });

    regionsControl.onAdd = function () {
      const container = L.DomUtil.create('div', 'flex flex-col gap-1');
      const toggleButton = L.DomUtil.create('button', 'bg-slate-800 text-slate-200 py-2 px-3 rounded-lg text-xs', container);
      toggleButton.innerHTML = 'Cluster Layer';
      container.appendChild(toggleButton);

      const dropdown = L.DomUtil.create('div', 'hidden flex flex-col items-start bg-slate-700 rounded-lg py-2 px-2 gap-1', container);

      const regions = [1, 2, 3, 4, 5, 6];  // 'all'을 제거
      const selectedRegions: { [key: number]: HTMLButtonElement } = {};

      regions.forEach((region) => {
        const regionButton = L.DomUtil.create('button', 'text-xs text-slate-200 px-3 w-full text-start rounded-sm', dropdown);
        regionButton.innerHTML = regionMapping[region];

        L.DomEvent.on(regionButton, 'click', () => {
          const numericRegion = typeof region === 'string' ? parseInt(region, 10) : region;

          if (selectedRegions[numericRegion]) {
            delete selectedRegions[numericRegion];
            regionButton.classList.remove('bg-blue-500'); // 원래 색깔로 돌아감
            regionButton.classList.add('bg-slate-700'); // 원래의 Tailwind 클래스
          } else {
            selectedRegions[numericRegion] = regionButton;
            regionButton.classList.remove('bg-slate-700'); // 원래의 Tailwind 클래스 제거
            regionButton.classList.add('bg-blue-500'); // 선택되면 파란색으로 변경
          }

          toggleRegion(numericRegion);
        });
      });

      L.DomEvent.on(toggleButton, 'click', () => {
        dropdown.classList.toggle('hidden');
      });

      return container;
    };

    regionsControl.addTo(map);
  }
</script>
