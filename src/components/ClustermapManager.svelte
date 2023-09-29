<script lang="ts">
  import type { Map as LeafletMap, LayerGroup } from 'leaflet';

  export let map: LeafletMap | null = null;
  let L: any;
  let regionLayers: { [region: string]: LayerGroup } = {};
  let selectedRegion: any | null = null;
  let selectedPolygon: L.Polygon | null = null;

  const regionMapping: { [key: string]: string} = {
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


  function showPolygonInfo(cluster: Cluster, latlng: L.LatLng, polygon: L.Polygon) {
    const regionName = regionMapping[cluster.region] || 'Unknown';
    const info = `
      <strong>Cluster: </strong> ${cluster.cluster}<br>
      <strong>Region: </strong> ${regionName}
    `;

    if (selectedPolygon) {
      selectedPolygon.setStyle({ color: 'green' });
    }

    polygon.setStyle({ color: 'red' });

    selectedPolygon = polygon;

    L.popup()
      .setLatLng(latlng)
      .setContent(info)
      .openOn(map);
  }

  function onMapClick(event: L.LeafletMouseEvent) {
    if (selectedPolygon) {
      selectedPolygon.setStyle({ color: 'green' });
      selectedPolygon = null;
    }
  }

  async function fetchClustersByRegion(regions: number[]) {
    if (!L || !map) return;

    try {
      const allClusters: Cluster[] = []; // 모든 클러스터를 저장할 배열
      const regionParams = regions.map(r => `region=${r}`).join('&');
      const regionKey = regions.join(',');
      let nextUrl: string | null = `http://10.24.8.120:8000/api/clusters?${regionParams}`;

      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { results, next }: { results: Cluster[], next: string | null } = await response.json();
        allClusters.push(...results);

        nextUrl = next;  // 다음 페이지의 URL
      }

      if (Array.isArray(allClusters)) {
        regions.forEach(region => {
          regionLayers[region]?.clearLayers();
        });

        allClusters.forEach(cluster => {
          const coordinates = cluster.polygon.coordinates[0].map(coord => [coord[1], coord[0]]);
          const polygon = L.polygon(coordinates, { color: 'green' });

          polygon.on('click', (event: L.LeafletMouseEvent) => {
            const clickLocation = event.latlng;
            showPolygonInfo(cluster, clickLocation, polygon);
          });

          if (!regionLayers[regionKey]) {
            regionLayers[regionKey] = L.layerGroup();
          }
          regionLayers[regionKey].addLayer(polygon);
        });

        regionLayers[regionKey]?.addTo(map);
      } else {
        console.error('ClusterData is not an array:', allClusters);
      }

    } catch (error) {
      console.error('An error occurred while fetching clusters:', error);
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

  // fetch cluster polygon from server and show menu
  $: if (map && L) {
    const regionsControl = L.control({ position: 'topleft' });

    // map.on('click', onMapClick)

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