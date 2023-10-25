<script lang="ts">
  import { Accordion, AccordionItem, Button, CloseButton, Drawer, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Tooltip } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
  import { sineIn } from 'svelte/easing'
  import type { Map as LeafletMap, Marker, Circle, Polygon, curve } from 'leaflet';
  import L from 'leaflet'
  // import { curve } from 'leaflet'; // for TypeScript
  import '@elfalem/leaflet-curve'
  import { writable } from 'svelte/store';
  import Papa from 'papaparse';
  import type { TestResult } from '../../../lib/types';
  import { getFillColorBySINR } from '$lib/ColorLegent';
  import TestresultUploadModal from './crud/TestresultUploadModal.svelte';

  export let testresultDrawer = true;
  export let testResults: any[] = [];
  export let map: LeafletMap | null = null; 
  export let selected_btsManagerData: any[];

  let testresultCreateModal = false;
  let siteId: string;

  
  let markers: L.CircleMarker[] = [];
  let transitionParamsRight = {
    x: -320,
    duration: 200,
    easing: sineIn
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  async function fetchCSV(url: string): Promise<TestResult[]> {
    const response = await fetch(url);
    const text = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            console.log('Papa parse errors: ', result.errors);
            reject(result.errors);
            return;
          }
          const testResultData: TestResult[] = result.data.map((row: any) => ({
            lon: row['Lon'],
            lat: row['Lat'],
            RSRP: row['RSRP'],
            SINR: row['SINR'],
            Serving: row['PCI'],
            TOP1_PCI: row['TOP1_PCI'],
            TOP1_RSRP: row['TOP1_RSRP'],
            TOP2_PCI: row['TOP2_PCI'],
            TOP2_RSRP: row['TOP2_RSRP'],
            TOP3_PCI: row['TOP3_PCI'],
            TOP3_RSRP: row['TOP3_RSRP'],
            TOP4_PCI: row['TOP4_PCI'],
            TOP4_RSRP: row['TOP4_RSRP'],
            TOP5_PCI: row['TOP5_PCI'],
            TOP5_RSRP: row['TOP5_RSRP'],
          }));
          resolve(testResultData);
        }
      });
    });
  }

  function clearPreviousMarkers() {
    markers.forEach(marker => {
      map?.removeLayer(marker);
    });
    markers = [];
  }

  async function displayTestResults() {
    clearPreviousMarkers();
    try {
      for (const result of testResults) {
        const testdataUrl: string = result.testdata;
        const testresultData: TestResult[] = await fetchCSV(testdataUrl)
        console.log(testresultData);
        generateServingLineGroup(testresultData);
        generateInterferenceTopGroups(testresultData);
        originalInterferenceTopGroups = JSON.parse(JSON.stringify(interferenceTopGroups));

        testresultData.forEach(data => {
          const fillColor: string = getFillColorBySINR(data.SINR);
          const marker = L.circleMarker([data.lat, data.lon], {
            radius: 3,
            fillColor: fillColor,
            color: '#000',
            weight: 0,
            opacity: 0.1,
            fillOpacity: 0.7,
          }).addTo(map!);
          markers.push(marker);
        });
      }
    } catch (error) {
      console.error('Error :', JSON.stringify(error, null, 2));
    }
  }

  // CSV Data grouping

  type ServingGroupData = {
    PCI: number;
    avgRSRP: number;
    count: number;
    PSS: number;
    ServingPCI: number;
    lat: number[];
    lon: number[];
  }
  type GroupData = {
    PCI: number;
    avgRSRP: number;
    count: number;
    PSS: number;
    dataPoints: { servingPCI: number, lat: number, lon: number }[];
  };

  let servingLineGroup: ServingGroupData[] = []
  let interferenceTopGroups: {
    [key: string]: GroupData[];
  } = {
    Interference_TOP1_Line: [],
    Interference_TOP2_Line: [],
    Interference_TOP3_Line: [],
    Interference_TOP4_Line: [],
    Interference_TOP5_Line: [],
  };


  function generatePSS(pci: number): number {
    return pci % 3;
  }

  // create Serving group
  function generateServingLineGroup(testresultData: TestResult[]) {
    const servingData: { [key: number]: { totalRSRP: number; count: number; lat: number[]; lon: number[] } } = {};

    testresultData.forEach(data => {
      if (servingData[data.Serving]) {
        servingData[data.Serving].totalRSRP += data.RSRP;
        servingData[data.Serving].count++
        servingData[data.Serving].lat.push(data.lat);
        servingData[data.Serving].lon.push(data.lon);
      } else {
        servingData[data.Serving] = { totalRSRP: data.RSRP, count: 1, lat: [data.lat], lon: [data.lon] };
      }
    });

    servingLineGroup = Object.keys(servingData).map((key) => {
      const PCI = parseInt(key);
      const PSS = generatePSS(PCI);
      const ServingPCI = parseInt(key);

      return {
        PCI,
        avgRSRP: servingData[PCI].totalRSRP / servingData[PCI].count,
        count: servingData[PCI].count,
        PSS,
        ServingPCI,
        lat: servingData[PCI].lat,
        lon: servingData[PCI].lon,
      };
    });
  }

  // create Interference top line
  function generateInterferenceTopGroups(testresultData: TestResult[]) {
    const topKeys = ['TOP1', 'TOP2', 'TOP3', 'TOP4', 'TOP5'];

    topKeys.forEach(topKey => {
      const interferenceData: { [key: number]: {totalRSRP: number; count: number; dataPoints: { servingPCI: number, lat: number, lon: number }[] } } = {};

      testresultData.forEach(data => {
        const pci = data[`${topKey}_PCI`];
        const rsrp = data[`${topKey}_RSRP`];
        const servingPCI = data.Serving

        if (pci !== undefined && rsrp !== undefined && pci !== 999 && pci !== null && rsrp !== 999 && rsrp !== null) {
          if (interferenceData[pci]) {
            interferenceData[pci].totalRSRP += rsrp;
            interferenceData[pci].count++;
            interferenceData[pci].dataPoints.push({ servingPCI, lat: data.lat, lon: data.lon });
          } else {
            interferenceData[pci] = { totalRSRP: rsrp, count: 1, dataPoints: [{ servingPCI: data.Serving, lat: data.lat, lon: data.lon }] };
          }
        }
      });

      interferenceTopGroups[`Interference_${topKey}_Line`] = Object.keys(interferenceData).map((key) => {
        const PCI = parseInt(key);
        const PSS = generatePSS(PCI);
        return {
          PCI,
          avgRSRP: interferenceData[parseInt(key)].totalRSRP / interferenceData[parseInt(key)].count,
          count: interferenceData[parseInt(key)].count,
          PSS,
          dataPoints: interferenceData[PCI].dataPoints,
        };
      })
    })
  }

  // interference data filter

  const selectedServingPCI = writable<number | null>(null);
  let sharedFilteredGroups: {[key: string]: GroupData[]} = {};

  let originalInterferenceTopGroups: {
    [key: string]: GroupData[];
  } = JSON.parse(JSON.stringify(interferenceTopGroups));

  // group data filter and sort
  function filterAndSortByServingPCI(selectedPCI: number) {
    selectedServingPCI.set(selectedPCI)
    interferenceTopGroups = JSON.parse(JSON.stringify(originalInterferenceTopGroups));

    // const selectedPSS = generatePSS(selectedPCI);
    Object.keys(interferenceTopGroups).forEach(key => {
      let groupList:GroupData[] = interferenceTopGroups[key];

      // Filter
      groupList = groupList.map(group => {
        const filteredServingPCI = group.dataPoints.filter(dataPoint => dataPoint.servingPCI === selectedPCI);
        return {
          ...group,
          ServingPCI: filteredServingPCI,
          count: filteredServingPCI.length
        };
      }).filter(group => group.ServingPCI.length > 0);


      // Sort
      groupList.sort((a, b) => b.PCI - a.PCI);
      interferenceTopGroups[key] = groupList;
      
      sharedFilteredGroups = {...interferenceTopGroups}
    });
  }

  let linesByPCI: Map<number, L.Curve[]> = new Map();

  function getColor(pss: number): string {
    if (pss === 0) return 'red';
    if (pss === 1) return 'green';
    return 'blue'
  }
  // draw curved line
  function drawcurvedLines(lat1: number, lon1: number, lat2: number, lon2: number, pss: number, pci:number, opacity: number) {
    const midLat = (lat1 + lat2) / 2;
    const midLon = (lon1 + lon2) / 2;

    const controlLat = midLat + (lat2 - lat1) / 4;
    const controlLon = midLon;
    
    const line = L.curve(
      [
        'M', [lat1, lon1],
        'C', [controlLat, controlLon],
            [controlLat, controlLon],
            [lat2, lon2]
      ],
      { color: getColor(pss), weight: 1, opacity: opacity, fill: false}
    ).addTo(map!);
    if (linesByPCI.has(pci)) {
      linesByPCI.get(pci)!.push(line);
    } else {
      linesByPCI.set(pci, [line]);
    }
    return line;
  }

  // delete curved line
  function removeLines(pci: number) {
    if (linesByPCI.has(pci)) {
      const lines = linesByPCI.get(pci)!;
      lines.forEach(line => line.remove());
      linesByPCI.delete(pci);
    }
  }

  let lineVisiblityByPCI: Map<number, boolean> = new Map();

  function toggleLines(selectedPCI: number) {
    const isLineVisible = lineVisiblityByPCI.get(selectedPCI) || false;
    if (isLineVisible) {
      removeLines(selectedPCI);
    } else {
      drawCuveLinesServing(selectedPCI);
    }
    lineVisiblityByPCI.set(selectedPCI, !isLineVisible)
  }

  // draw curved line for serving
  function drawCuveLinesServing(selectedPCI: number) {
  // filter data by selected pci
    const filteredServingLineGoup = servingLineGroup.filter(group => group.PCI === selectedPCI)
    for (const btsData of selected_btsManagerData) {
      for (const servingGroup of filteredServingLineGoup) {
        if (btsData.pci === servingGroup.PCI) {
          for (let i = 0; i < servingGroup.lat.length; i++) {
            const servingLat = servingGroup.lat[i];
            const servingLon = servingGroup.lon[i];
            drawcurvedLines(btsData.lat, btsData.lon, servingLat, servingLon, servingGroup.PSS, servingGroup.PCI, 0.5)
          }
        }
      }
    }
  }

  // iNTERFERENCE LINE
  let linesByTopKeyAndPCI: Map<string, Map<number, L.Curve[]>> = new Map();

  function drawInterferenceLines(topKey: string, selectedPCI: number) {
    selectedServingPCI.subscribe(($selectedServingPCI) => {
      if ($selectedServingPCI === null) return;

      const servingPCI = $selectedServingPCI;
      // const filteredInterferenceGroup = interferenceTopGroups[topKey].filter(group => group.PCI === selectedPCI);
      const filteredInterferenceGroup = sharedFilteredGroups[topKey]
        .filter(group => group.PCI === selectedPCI)
        .map(group => ({
          ...group,
          dataPoints: group.dataPoints.filter(dataPoint => dataPoint.servingPCI === servingPCI)
        }));
  
      for (const btsData of selected_btsManagerData) {
        for (const interferendeGroup of filteredInterferenceGroup) {
          if (btsData.pci === interferendeGroup.PCI) {
            for (const dataPoint of interferendeGroup.dataPoints) {
              const lat = dataPoint.lat;
              const lon = dataPoint.lon;
              const line = drawcurvedLines(btsData.lat, btsData.lon, lat, lon, interferendeGroup.PSS, interferendeGroup.PCI, 0.1)
  
              if (!linesByTopKeyAndPCI.has(topKey)) {
                linesByTopKeyAndPCI.set(topKey, new Map());
              }
  
              if (linesByTopKeyAndPCI.get(topKey)!.has(selectedPCI)) {
                linesByTopKeyAndPCI.get(topKey)!.get(selectedPCI)!.push(line);
              } else {
                linesByTopKeyAndPCI.get(topKey)!.set(selectedPCI, [line]);
              }
            }
          }
        }
      }
    })();
  }

  function removeInterferenceLines(topKey: string, selectedPCI: number) {
    const topKeyMap = linesByTopKeyAndPCI.get(topKey);
    if (topKeyMap && topKeyMap.has(selectedPCI)) {
      const lines = topKeyMap.get(selectedPCI)!;
      lines.forEach(line => line.remove());
      topKeyMap.delete(selectedPCI)
    }
  }

  function toggleInterferenceLines(topKey: string, selectedPCI: number) {
    const topKeyMap = linesByTopKeyAndPCI.get(topKey);
    if (topKeyMap && topKeyMap.has(selectedPCI)) {
      removeInterferenceLines(topKey, selectedPCI);
    } else {
      drawInterferenceLines(topKey, selectedPCI)
    }
  }

  function opentestresultCreateModal() {
    const inputElement = document.getElementById('mapSearchSiteid') as HTMLInputElement;
    if (inputElement) {
      siteId = inputElement.value;
      testresultCreateModal = true
    }
  }
 
</script>

<div class="testresultdrawer">
  <Drawer
    class="top-[83px] left-[275px] w-96 h-[calc(100vh-95px)] rounded-lg bg-slate-400/10" 
    divClass="overflow-y-auto z-50 p-4 bg-white dark:bg-gray-800/30"
    bgColor="bg-gray-200"
    bgOpacity="bg-opacity-10"
    backdrop={false}
    activateClickOutside={false}
    width="w-96" 
    placement="left" 
    transitionType="fly" 
    transitionParams={transitionParamsRight} 
    bind:hidden={testresultDrawer}
    id="testresult-drawer">

    <div class="flex items-center mt-10">
      <h5 id="drawer-label" class="inline-flex items-center mb-4 text-sm font-semibold text-slate-900">
        <Icon icon="clarity:data-cluster-line" class="text-2xl me-2"/>OPT Test result information
      </h5>
      <CloseButton on:click={() => (testresultDrawer = true)} class="mb-4 dark:text-white" />
    </div>

    <!-- Test result rendering -->
    {#if testResults.length > 0}
    <Table shadow={true} hoverable={true} color="custom" customeColor={'bg-gray-700'} class="w-full">
      <TableHead>
        <TableHeadCell class="py-2 text-xs text-slate-300 bg-slate-800/70">Cycle</TableHeadCell>
        <TableHeadCell class="py-2 text-xs text-slate-300 bg-slate-800/70">Update date</TableHeadCell>
        <TableHeadCell class="py-2 text-xs text-slate-300 bg-slate-800/70">SHOW RESULT</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each testResults as testresult (testresult.id)}
        <TableBodyRow color="custom" class="dark:bg-gray-700/30 border-b border-gray-500/50">
          <TableBodyCell class="py-2 text-xs">{testresult.cycle}</TableBodyCell>
          <TableBodyCell class="py-2 text-xs">{formatDate(testresult.create_at)}</TableBodyCell>
          <TableBodyCell class="py-2 text-xs">
            <Button size="xs" color="yellow" class="py-0.5 px-2 text-xs text-slate-900"
              on:click={() => displayTestResults()}>Show Result</Button>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>

    <hr class="my-4 border-1 border-slate-500">
    {:else}
    <div class="flex flex-col items-center gap-3">
      <h1 class="text-xs text-rose-600 font-bold mb-1">
        {testResults.length > 0 ? testResults[0].sitebasicinfo : 'No test result found in the server'}
         OPT Test result
      </h1>
      <Button color="red" on:click={opentestresultCreateModal}>
        Add Test Result
      </Button>
    </div>
    {/if}
    {#if servingLineGroup.length > 0}
    <div class="flex flex-col">
      <h1 class="text-xs text-slate-900 font-bold mb-3">Test Result Detail</h1>

      <Accordion multiple
        activeClass="text-xs dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800"
        inactiveClass="text-xs dark:text-slate-700 hover:dark:text-slate-200 hover:bg-gray-100 hover:dark:bg-gray-800"
        >
        <AccordionItem paddingFlush="py-2" paddingDefault="p-2">
          <span slot="header">Serving</span>
            <div class="grid grid-cols-5 items-center gap-2">
              {#each servingLineGroup as item (item.PCI)}
              <div class="flex items-center gap-1">
                <input class="rounded-sm w-3 h-3" type="checkbox" 
                  checked={lineVisiblityByPCI.get(item.PCI)} 
                  on:change={() => toggleLines(item.PCI)} />
                <button
                  class="text-xs font-bold py-0.5 px-1 rounded-md border-[1px]
                  {item.PSS === 0 ? 'border-red-600 text-red-600 focus:bg-red-600 focus:text-red-50' : 
                   item.PSS === 1 ? 'border-green-600 text-green-600 focus:bg-green-600 focus:text-green-50' : 
                  'border-blue-600 text-blue-600 focus:bg-blue-600 focus:text-blue-50'}" 
                  on:click={() => filterAndSortByServingPCI(item.PCI)}>
                  {item.ServingPCI}
                </button>
              </div>
              <Tooltip color="yellow">
                Count: {item.count} <br>
                avgRSRP: {item.avgRSRP.toFixed(1)}
              </Tooltip>
              {/each}
            </div>
        </AccordionItem>
        {#each Object.keys(interferenceTopGroups) as key}
        <AccordionItem paddingFlush="py-2" paddingDefault="p-2">
          <span slot="header">{key}</span>
          <div class="grid grid-cols-5 items-center gap-2">
            {#each interferenceTopGroups[key] as item (item.PCI)}
              <h1 
                class="text-xs font-bold py-0.5 px-1 rounded-md border-[1px] flex items-center gap-1
                { item.PSS === 0 ? 'border-red-600 text-red-600' : 
                  item.PSS === 1 ? 'border-green-600 text-green-600' : 
                  'border-blue-600 text-blue-600'}" >
                  <input class="rounded-sm w-3 h-3" type="checkbox" 
                  checked={lineVisiblityByPCI.get(item.PCI)} 
                  on:change={() => toggleInterferenceLines(key, item.PCI )} />
                {item.PCI}
              </h1>
              <Tooltip color="yellow">
                Count: {item.count} <br>
                avgRSRP: {item.avgRSRP.toFixed(1)}
              </Tooltip>
            {/each}
          </div>
        </AccordionItem>
        {/each}
      </Accordion>

    </div>
    {/if}
  
  </Drawer>
</div>

<TestresultUploadModal bind:testresultCreateModal = {testresultCreateModal} {siteId} />

<style>
  .testresultdrawer {
    position: absolute;
    /* top: 90.8px;
    left: 20px; */
    z-index: 700;
  }
</style>