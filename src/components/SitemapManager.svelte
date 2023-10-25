<script lang="ts">
  import { Select, Input, Button, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Checkbox } from 'flowbite-svelte';
  import type { Map as LeafletMap, Marker, Circle, Polygon } from 'leaflet';
  import TestresultUploadModal from '../routes/fddproject/map/crud/TestresultUploadModal.svelte';
	import { onMount } from 'svelte';
  import TestResult from './TestResult.svelte';
  import L from 'leaflet'
  import TestResultMapDrawer from '../routes/fddproject/map/TestResultMapDrawer.svelte';

  export let map: LeafletMap  | null;
  // let L: any;
  let markers: Marker[] = [];
  let circles: Circle[] = [];
  let polygons: Polygon[] = [];

  let region: string = '';
  let freqband: string = '20';
  let siteid: string = '';
  let radius: string = '3';

  let siteId = '';
  let testresultCreateModal = false;
  let testdataUrl: string = ''

  let selected_btsManagerData: any[] = [];

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

  // if (typeof window !== 'undefined') {
  //   import('leaflet').then(leaflet => {
  //     L = leaflet
  //   });
  // }
  // onMount(() => {
  //   if (typeof window !== 'undefined') {
  //     import('leaflet').then(leaflet => {
  //       L = leaflet
  //     })
  //   }
  // })

  function calculateArcPoints(lat: number, lon: number, azimuth: number, angle: number, radius: number): number[][] {
    const sectorPoints: number[][] = [[lat, lon]];
    const correctedAzimuth = 90 - azimuth;
    const startAngle = correctedAzimuth - angle / 2;
    const endAngle = correctedAzimuth + angle / 2;

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
      polygons.forEach(polygon => polygon.remove());
      markers = [];
      circles = [];
      polygons = [];

      // 검색 사이트 정보.
      const firstResult = data.find((item: any) => item.siteid === siteid);

      if (firstResult && firstResult.lat && firstResult.lon) {
        map?.flyTo([firstResult.lat, firstResult.lon], 13);

        const siteIds = data.map((item: any) => item.siteid).join(',');

        const managerUrl = `http://10.24.8.120:8000/api/nonpagebtsmanager/?siteid=${siteIds}&freqband=${freqband}`;
        const managerResponse = await fetch(managerUrl);
        const managerData = await managerResponse.json();
        

        btsManagerData.push(...managerData)
        selected_btsManagerData = managerData;


        data.forEach((item: any) => {
          if (item.lat && item.lon) {
            const fillColor = item.siteid === siteid ? '#0000ff' : '#ff7800';
            const marker = L.circleMarker([item.lat, item.lon], {
              pane: 'overlayPane',
              radius: 4,
              fillColor: fillColor,
              color: '#000',
              weight: 0,
              opacity: 1,
              fillOpacity: 1
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
        const pss = item.pss

        let edgeColor;

        if (pss === 0 || pss === 3) {
          edgeColor = 'red';
        } else if (pss === 1 || pss === 4) {
          edgeColor = 'green';
        } else if (pss === 2 || pss === 5) {
          edgeColor = 'blue';
        } else {
          edgeColor = 'black'
        }

        const sectorPoints = calculateArcPoints(lat, lon, azimuth, angle, radius);

        const polygon = L.polygon(sectorPoints, {
          pane: 'mapPane',
          color: edgeColor
        });
        polygon.addTo(map);
        polygons.push(polygon);

        // add btsManager info click event
        const popupContent = `
        <div class="flex flex-col text-xs w-52">
          <h1 class="text-md text-slate-900 font-bold mb-3">Site Info</h1>

          <div class="flex items-start mb-2 gap-2">
            <span class="text-xs text-slate-900 font-bold">${item.siteid}</span>
            <span class="text-xs text-slate-900">Sector ID: ${item.phyinfo.secid}</span>
          </div>

          <h1 class="text-xs text-slate-50 text-start font-bold mb-1 rounded-md bg-purple-600 py-1 px-2">
            Antenna information
          </h1>
          <div class="flex items-center justify-center mb-2 gap-2">
            <div class="flex items-center gap-2">
              <span class="text-xs text-purple-600">Type</span>
              <span class="text-xs font-bold text-purple-600">${item.phyinfo.antennatype}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-purple-600">Height</span>
              <span class="text-xs font-bold text-purple-600">${item.phyinfo.antennaheight}m</span>
            </div>
          </div>

          <hr class="mb-2 border-1 border-slate-200">

          <h1 class="text-xs text-slate-50 text-start font-bold mb-1 rounded-md bg-indigo-600 py-1 px-2">
            Physical Parameter Information
          </h1>
          <div class="flex items-center justify-center mb-2 gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs text-indigo-600">Azimuth</span>
              <span class="text-xs font-bold text-indigo-600">${item.phyinfo.azimuth}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-indigo-600">M-Tilt</span>
              <span class="text-xs font-bold text-indigo-600">${item.phyinfo.mtilt}</span>
            </div>
          </div>

          <hr class="mb-2 border-1 border-slate-200">

          <h1 class="text-xs text-slate-50 text-start font-bold mb-1 rounded-md bg-rose-600 py-1 px-2">
            Physical Parameter Information
          </h1>
          <div class="flex items-center justify-center mb-2 gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs text-rose-600">E-Tilt</span>
              <span class="text-xs font-bold text-rose-600">${item.etilt}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-rose-600">PCI</span>
              <span class="text-xs font-bold text-rose-600">${item.pci}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-rose-600">PSS</span>
              <span class="text-xs font-bold text-rose-50 h-6 w-6 rounded-full flex items-center justify-center ${
                item.pss === 0 ? 'bg-red-600' : 
                item.pss === 1 ? 'bg-green-600' : 'bg-blue-600'}">${item.pss}</span>
            </div>
          </div>
        </div>
        `;
        polygon.bindPopup(popupContent)
      });

    } catch (error) {
      console.error('Error fetching BTS info:', error);
    }
  }

  let siteidInput: string = ''
  let testResults: any[] = [];
  let testresultDrawer = true;
  async function handleSearch() {
    siteid = siteidInput;
    await fetchAndDisplayBTSInfo();
    testresultDrawer = false

    try {
      const testResultUrl = `http://10.24.8.120:8000/api/testresult/?sitebasicinfo=${siteid}`;
      const testResultResponse = await fetch(testResultUrl);
      if (!testResultResponse.ok) {
        throw new Error(`HTTP error! status: ${testResultResponse.status}`);
      }

      const testResultsData = await testResultResponse.json()
      testResults = await testResultsData.results
    } catch (error) {
      console.error(`Error fetching test results:`, error);
    }
  }

</script>

<div class="btsload-container flex items-center gap-1">
  <Select class="py-1 w-fit" size="sm" items={regions} bind:value={region}></Select>
  <Select class="py-1 w-28" size="sm" items={freqbands} bind:value={freqband}></Select>
  <Select class="py-1 w-24" size="sm" items={searchraidus} bind:value={radius}></Select>
  <Input id="mapSearchSiteid" class="w-fit py-1.5" size="sm" bind:value={siteidInput} placeholder="Search Full Site ID" />
  <Button class="py-1.5" size="xs" color="purple" on:click={handleSearch}>Search</Button>
</div>

<TestresultUploadModal bind:testresultCreateModal={testresultCreateModal} {siteId} />
<TestResult {map} {testdataUrl} {selected_btsManagerData} />

<!-- Drawer -->
<TestResultMapDrawer bind:testresultDrawer={testresultDrawer} {testResults} {selected_btsManagerData} {map} />

<style>
  .btsload-container {
    position: absolute;
    top: 17px;
    right: 20px;
    z-index: 700;
  }
  .leaflet-overlay-pane { z-index: 1000; }
  .leaflet-map-pane { z-index: 900; }
</style>