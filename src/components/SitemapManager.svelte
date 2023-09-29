<script lang="ts">
  import { Select, Input, Button } from 'flowbite-svelte';
import type { Map as LeafletMap, Marker, Circle } from 'leaflet';
  export let map: LeafletMap  | null;
  let L: any;
  let markers: Marker[] = [];
  let circles: Circle[] = [];

  let region: string = '';
  let freqband: string = '20';
  let siteid: string = '';
  let radius: string = '3';

  let regions = [
    {value: 'Central', name: 'Central'},
    {value: 'Northern', name: 'Northern'},
    {value: 'Southern', name: 'Southern'},
    {value: 'Eastern', name: 'Eastern'},
    {value: 'Sabah', name: 'Sabah'},
    {value: 'Sarawak', name: 'Sarawak'},
  ]

  let freqbands = [
    {value: '20', name: 'FDD 800'},
    {value: '38', name: 'TDD 2.6'},
    {value: '40', name: 'TDD 2.3'},
  ]

  let searchraidus = [
    {value: '3', name: '3Km'},
    {value: '5', name: '5Km'},
    {value: '7', name: '7Km'},
    {value: '10', name: '10Km'},
    {value: '15', name: '15Km'}
  ]

  if (typeof window !== 'undefined') {
    import('leaflet').then(leaflet => {
      L = leaflet
    });
  }

  function calculateArcPoints(lat: number, lon: number, azimuth: number, angle: number, radius: number): number[][] {
    const sectorPoints: number[][] = [[lat, lon]];
    const arcPoints: number[][] = [];
    const startAngle = azimuth - angle / 2;
    const endAngle = azimuth + angle / 2;

    for (let theta = startAngle; theta <= endAngle; theta += 1) {
      const dx = radius * Math.cos(theta * Math.PI / 180.0);
      const dy = radius * Math.sin(theta * Math.PI / 180.0);

      const R = 6371;

      const newLat = lat + (dy / R) * (180 / Math.PI);
      const newLon = lon + (dx / (R * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);

      sectorPoints.push([newLat, newLon]);
    }

    return sectorPoints;
  }

  async function fetchAndDisplayBTSInfo() {
    try {
      const url = `http://10.24.8.120:8000/api/nonpagesitebasicinfo/?region=${region}&radius=${radius}&siteid=${siteid}`;
      const response = await fetch(url);
      const data = await response.json();

      // BTSManager data array
      const btsManagerData: any = [];

      // 기존 마커와 원을 지웁니다.
      markers.forEach(marker => marker.remove());
      circles.forEach(circle => circle.remove());
      markers = [];
      circles = [];

      // 검색 사이트 정보.
      const firstResult = data.find((item: any) => item.siteid === siteid);

      if (firstResult && firstResult.lat && firstResult.lon) {
        map?.flyTo([firstResult.lat, firstResult.lon], 13);

        // const circle = L.circle([firstResult.lat, firstResult.lon], {
        //   radius: parseInt(radius) * 1000,
        //   color: 'black',
        //   weight: 2,
        //   fillOpacity: 0
        // });
        // circle.addTo(map);
        // circles.push(circle);

        const siteIds = data.map((item: any) => item.siteid).join(',');

        const managerUrl = `http://10.24.8.120:8000/api/nonpagebtsmanager/?siteid=${siteIds}&freqband=${freqband}`;
        const managerResponse = await fetch(managerUrl);
        const managerData = await managerResponse.json();

        btsManagerData.push(...managerData)

        data.forEach((item: any) => {
          if (item.lat && item.lon) {
            const fillColor = item.siteid === siteid ? '#0000ff' : '#ff7800';
            const marker = L.circleMarker([item.lat, item.lon], {
              pane: 'overlayPane',
              radius: 6,
              fillColor: fillColor,
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            });
            marker.bindPopup(`
              <span class="text-xs font-bold">${item.siteid}</span><br>
              <span class="text-xs font-bold">${item.cluster}</span>
            `);
            marker.addTo(map);
            markers.push(marker);
          }
        });
      }

      const flatBtsManagerData = btsManagerData.flat();

      flatBtsManagerData.forEach((item: any) => {
        const lat = item.lat;
        const lon = item.lon;
        const azimuth = item.phyinfo.azimuth;
        const angle = item.angle;
        const radius = item.radius;
        const secid = item.phyinfo.secid;

        let edgeColor;

        if (secid === 0 || secid === 3) {
          edgeColor = 'red';
        } else if (secid === 1 || secid === 4) {
          edgeColor = 'green';
        } else if (secid === 2 || secid === 5) {
          edgeColor = 'blue';
        } else {
          edgeColor = 'black'
        }

        const sectorPoints = calculateArcPoints(lat, lon, azimuth, angle, radius);

        const polygon = L.polygon(sectorPoints, {
          pane: 'mapPane',
          color: edgeColor
        }).addTo(map);

        // add btsManager info click event
        const popupContent = `
        <div class="grid grid-cols-2 items-center text-xs w-52 gap-1">
          <span class="text-xs text-center py-0.5 px-1 m-0 bg-purple-400 rounded-lg">SiteID</span>
          <span class="font-bold text-xs py-0.5 px-1 m-0">${item.siteid}</span>
          <span class="text-xs text-center py-0.5 px-1 m-0 bg-purple-400 rounded-lg">Type</span>
          <span class="font-bold text-xs py-0.5 px-1 m-0">${item.phyinfo.antennatype}</span>
          <span class="text-xs text-center py-0.5 px-1 m-0 bg-purple-400 rounded-lg">Height</span>
          <span class="font-bold text-xs py-0.5 px-1 m-0">${item.phyinfo.antennaheight}</span>
          <span class="text-xs text-center py-0.5 px-1 m-0 bg-purple-400 rounded-lg">Azimuth</span>
          <span class="font-bold text-xs py-0.5 px-1 m-0">${item.phyinfo.azimuth}</span>
          <span class="text-xs text-center py-0.5 px-1 m-0 bg-purple-400 rounded-lg">MTILT</span>
          <span class="font-bold text-xs py-0.5 px-1 m-0">${item.phyinfo.mtilt}</span>
          <span class="text-xs text-center py-0.5 px-1 m-0 bg-purple-400 rounded-lg">ETILT</span>
          <span class="font-bold text-xs py-0.5 px-1 m-0">${item.retinfo.ret}</span>
          <span class="text-xs text-center py-0.5 px-1 m-0 bg-purple-400 rounded-lg">PCI</span>
          <span class="font-bold text-xs py-0.5 px-1 m-0">${item.pci}</span>
          <span class="text-xs text-center py-0.5 px-1 m-0 bg-purple-400 rounded-lg">PSS</span>
          <span class="font-bold text-xs py-0.5 px-1 m-0">${item.pss}</span>
        </div>
        `;
        polygon.bindPopup(popupContent)
      });

    } catch (error) {
      console.error('Error fetching BTS info:', error);
    }
  }

</script>

<div class="btsload-container flex items-center gap-1">
  <Select class="py-1.5 w-fit" size="sm" items={regions} bind:value={region}></Select>
  <Select class="py-1.5 w-28" size="sm" items={freqbands} bind:value={freqband}></Select>
  <Select class="py-1.5 w-24" size="sm" items={searchraidus} bind:value={radius}></Select>
  <Input class="w-fit w-" size="sm" bind:value={siteid} placeholder="Search Full Site ID" />
  <Button size="xs" color="purple" on:click={fetchAndDisplayBTSInfo}>Search</Button>
</div>

<style>
  .btsload-container {
    position: absolute;
    top: 17px;
    right: 10px;
    z-index: 1000;
  }
  .leaflet-overlay-pane { z-index: 700; }
  .leaflet-map-pane { z-index: 600; }
</style>