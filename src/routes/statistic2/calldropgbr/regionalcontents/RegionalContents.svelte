<script lang="ts">
  import { onMount } from "svelte";
  import Icon from '@iconify/svelte';
  import { trendDataStore, fetchTrendData } from "./FetchCallDropData";
	import { Tooltip } from "flowbite-svelte";

  import RegionalVoLteAttempt from "../chart/RegionalVoLTEAttempt.svelte";
  import RegionalTrendbyBand from "../chart/RegionalTrendbyBand.svelte";
  import RegionalCallDropFailCluster from "../chart/RegionalCallDropFailCluster.svelte";
  import RegionalCallDropFailSiteCell from "../chart/RegionalCallDropFailSiteCell.svelte";
  import RegionalClusterTable from "../../components/RegionalClusterTable.svelte";
  import RegionalCellTable from "../../components/RegionalCellTable.svelte";
  import FailClusterInfoModal from "../../components/FailClusterInfoModal.svelte";


  export let region: string;
  export let data: any;

  let field: string = 'volte_call_drop_rate_erab_gbr';
  let CallDropGBRData: any = null;
  let band: string;

  $: CallDropGBRData = $trendDataStore
  $: $trendDataStore, CallDropGBRData = $trendDataStore
  $: if (region) {
    (region);
  }

  onMount(async () => {
    if (!region) {
      region = 'Central';
    }
    fetchTrendData(region);
  })

  const calldropAttemptCountChartKeyMap: { [key: string]: string} = {
    'TotalVoLTECallDropNominate_byband': 'Total Attempt',
    'sumvolteestablnitsuccnbr_byband': 'eRAB Success',
    'sumvolteestabaddsuccnbr_byband': 'eRAB Add Success',
    'sumvolteerablncominghosuccnbr_byband': 'Handover In Success'
  };
  const chartKeys = Object.keys(calldropAttemptCountChartKeyMap);
  let selectedChartKey = chartKeys[0];
  let showDropdown = false;

  const TopFailClusterBandKeyMap: { [key: string]: string} ={
    '23': '2.3GHz',
    '26': '2.6GHz',
    '800': '800MHz'
  };
  const BandKeys = Object.keys(TopFailClusterBandKeyMap);
  let selectedBandKey = BandKeys[2];
  let showBandDropdown = false;
  $: topImpactClusterListKey = `top_impact_cluster_list_${selectedBandKey}`;
  

  // MODAL VARIABLE
  let FailClusterModal = false

  function getSelectedData(data: any, key: string): any {
    if (!data || !key || !data[key]) return null;
    return data[key].by_band;
  }
  $: selectedNominateData = getSelectedData(CallDropGBRData, selectedChartKey)

  function getSelectedNominateOverallData(data: any, key: string): any {
    if (!data || !key || !data[key]) return null;
    const overallKey = key.replace(/_byband$/, '')
    if (!overallKey) return null;
    return data[key].overall[overallKey];
  }
  $: SelectedNominateOverallData = getSelectedNominateOverallData(CallDropGBRData, selectedChartKey)

  $: FailClusterCount = 'fail_cluster_count_byband';
</script>

<div class="grid grid-cols-8 gap-4 w-full mb-4">
  <!-- REGIONAL CALL DROP COUNT -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} CALL DROP COUNT</h1>
    </div>

    {#if CallDropGBRData}
      <div class="flex flex-col items-center justify-center h-full">
        <div class="flex flex-col">
          <h1 class="text-2xl text-white font-bold">
            {(CallDropGBRData.calldropcoutbyband.overall.CallDropCount).toLocaleString()}
          </h1>
          <h1 class="text-xs text-slate-500">
            {((CallDropGBRData.calldropcoutbyband.overall.CallDropCount) / 7).toLocaleString()} (Per Day)
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <div class="rounded-sm px-1 py-[1px] bg-green-500 text-xs">
          {(((CallDropGBRData.calldropcoutbyband.overall.CallDropCount) / 
          (data.CallDropGBRStatisticData.CallDropGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(2)}%
        </div>
        <h1 class="text-xs text-slate-500">Share of the national Call Drop count</h1>
      </div>
    {/if}
  </div>

  <!-- REGIONAL CALL DROP COUNT BY BAND -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4 gap-4">
    <div class="relative flex items-start gap-1">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <div class="flex flex-col">
        <h1 class="text-xs text-slate-500">VoLTE ATTEMPT BY BAND</h1>
      </div>
      <button class="ms-auto flex items-center gap-2 text-gray-800 rounded-md"
        on:click={() => (showDropdown = !showDropdown)}>
        <!-- {calldropCountChartKeyMap[selectedChartKey]} -->
        <Icon icon="tabler:dots-vertical" class="text-lg text-white" />
      </button>
      {#if showDropdown}
        <div class="z-50 absolute -top-5 right-5 flex flex-col bg-slate-700/90 shadow-md rounded-md mt-2">
          {#each chartKeys as key}
          <button class="text-xs text-left text-slate-100 py-1 px-2 hover:bg-rose-400/50"
          on:click={() => {selectedChartKey = key; showDropdown = false}}>
            {calldropAttemptCountChartKeyMap[key]}
          </button>
          {/each}
        </div>
      {/if}
    </div>
    <div class="flex items-center gap-4">
      <div class="relative flex items-center justify-center">
        <div class="z-40">
          <RegionalVoLteAttempt {CallDropGBRData} chartKey={selectedChartKey} />
        </div>
        <div class="absolute flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()}</h1>
          <h1 class="text-lg text-slate-500 font-bold">
            {#if SelectedNominateOverallData}{SelectedNominateOverallData.toLocaleString()}{/if}
          </h1>
          <h1 class="text-[10px] text-white">{calldropAttemptCountChartKeyMap[selectedChartKey]}</h1>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <div class="flex flex-col gap-1">
            {#if selectedNominateData}
            {#each Object.keys(selectedNominateData.band) as index}
            <div class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-sm 
              {selectedNominateData.band[index] === '800M' ? 'bg-sky-400' : 
              selectedNominateData.band[index] === '2.6GHz' ? 'bg-sky-600' : 'bg-sky-800'}"></div>
              <h1 class="text-xs text-white">{selectedNominateData.band[index]}</h1>
            </div>
            <h1 class="text-xs text-slate-500 ps-4">{(selectedNominateData.counts[index]).toLocaleString()}</h1>
            {/each}
            {/if}
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- REGIONAL CALL DROP TREND BY BAND -->
  <div class="flex flex-col col-span-4 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} CALL DROP TREND BY BAND</h1>
    </div>
    <div class="">
      <RegionalTrendbyBand {CallDropGBRData} />
    </div>
  </div>

  <!-- REGIONAL CALL DROP FAIL CLUSTER -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} CALL DROP FAIL CLUSTER</h1>
    </div>
    <div class="flex items-center justify-around">
      <div class="relative flex">
        <RegionalCallDropFailCluster {CallDropGBRData} />
        <div class="absolute top-[35%] left-[28%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">Fail Cluster</h1>
          <h1 class="text-2xl text-white font-bold">
            {#if CallDropGBRData}{CallDropGBRData.fail_cluster_count_all}{/if}
          </h1>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <div class="flex flex-col gap-4">
            {#if CallDropGBRData && CallDropGBRData[FailClusterCount]}
              {#each CallDropGBRData[FailClusterCount].band as bands, index}
                <div class="flex items-center">
                  <button class="flex items-center justify-between p-2 gap-2 text-xs text-white w-full rounded-md 
                    {bands === '2.3G' ? 'bg-sky-800' : 
                    bands === '2.6G' ? 'bg-sky-600' : 'bg-sky-400'}"
                    on:click={() => {band = bands; field = field; region=region; FailClusterModal = true}}>
                    {bands}
                    <h1 class="text-xs text-black w-4 h-4 rounded-full bg-rose-300">
                      {CallDropGBRData[FailClusterCount].count[index]}
                    </h1>
                  </button>
                </div>
                
              {/each}
            {/if}
          </div>
        </div>
      </div>

      
    </div>
  </div>

  <!-- REGIONAL CALL DROP FAIL SITE & CELL -->
  <div class="flex flex-col col-span-3 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} CALL DROP FAIL SITE & CELL</h1>
    </div>
    <div class="flex items-center justify-around">
      <div class="relative flex">
        <RegionalCallDropFailSiteCell {CallDropGBRData} />
        <div class="absolute top-[35%] left-[25%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">Site / Cell Fail</h1>
          <h1 class="text-lg text-white font-bold">
            {#if CallDropGBRData}
              {CallDropGBRData.fail_site_count_all}/{CallDropGBRData.fail_cell_count_all}
            {/if}
          </h1>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <!-- 2.3 FAIL SITE AND CELL COUNT -->
        <div class="flex items-center justify-start gap-1">
        </div>
        <div class="flex items-center justify-center w-full">
          <Icon icon="ic:baseline-cell-tower" class="text-lg text-rose-400 font-bold" />
        </div>
        <div class="flex items-center justify-center w-full">
          <h1 class="text-xs text-white">
            <Icon icon="carbon:assembly-cluster" class="text-lg text-rose-400 font-bold" />
          </h1>
        </div>

        <!-- 2.3 FAIL SITE AND CELL COUNT -->
        <div class="flex items-center justify-start gap-1">
          <div class="h-3 w-3 rounded-sm bg-sky-800"></div>
          <h1 class="text-xs text-white">2.3G</h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if CallDropGBRData}
              {#if CallDropGBRData.fail_site_count_byband.band.includes('2.3GHz')}
                {CallDropGBRData.fail_site_count_byband.count[CallDropGBRData.fail_site_count_byband.band.indexOf('2.3GHz')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if CallDropGBRData}
              {#if CallDropGBRData.fail_cell_count_byband.band.includes('2.3GHz')}
                {CallDropGBRData.fail_cell_count_byband.count[CallDropGBRData.fail_site_count_byband.band.indexOf('2.3GHz')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>

        <!-- 2.6 FAIL SITE AND CELL COUNT -->
        <div class="flex items-center justify-start gap-1">
          <div class="h-3 w-3 rounded-sm bg-sky-600"></div>
          <h1 class="text-xs text-white">2.6G</h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if CallDropGBRData}
              {#if CallDropGBRData.fail_site_count_byband.band.includes('2.6GHz')}
                {CallDropGBRData.fail_site_count_byband.count[CallDropGBRData.fail_site_count_byband.band.indexOf('2.6GHz')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if CallDropGBRData}
              {#if CallDropGBRData.fail_cell_count_byband.band.includes('2.6GHz')}
                {CallDropGBRData.fail_cell_count_byband.count[CallDropGBRData.fail_site_count_byband.band.indexOf('2.6GHz')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>

        <!-- 800 FAIL SITE AND CELL COUNT -->
        <div class="flex items-center justify-start gap-1">
          <div class="h-3 w-3 rounded-sm bg-sky-400"></div>
          <h1 class="text-xs text-white">800M</h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if CallDropGBRData}
              {#if CallDropGBRData.fail_site_count_byband.band.includes('800M')}
                {CallDropGBRData.fail_site_count_byband.count[CallDropGBRData.fail_site_count_byband.band.indexOf('800M')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if CallDropGBRData}
              {#if CallDropGBRData.fail_cell_count_byband.band.includes('800M')}
                {CallDropGBRData.fail_cell_count_byband.count[CallDropGBRData.fail_site_count_byband.band.indexOf('800M')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
      </div>
    </div>
  </div>

  <!-- CALL DROP MOST FAIL CLUSTER AND CELL LIST -->
  <div class="flex flex-col col-span-3 bg-slate-900/40 rounded-md">
    <div class="flex justify-between p-4">
      <div class="flex items-center gap-1">
        <Icon icon="material-symbols-light:border-all-rounded" class="text-lg text-slate-500" />
        <h1 class="text-xs text-slate-500">MOST IMPACTED CELUTER</h1>
        <h1 class="text-xs px-2 py-[1px] rounded-sm ms-2
          {TopFailClusterBandKeyMap[selectedBandKey] === '800MHz' ? 'bg-sky-400 text-black' : TopFailClusterBandKeyMap[selectedBandKey] === '2.3GHz' ? 'bg-sky-800 text-white' : 'bg-sky-600 text-white'}">
          {TopFailClusterBandKeyMap[selectedBandKey]}
        </h1>
      </div>
      <div class="relative flex items-center gap-1 pe-2">
        <button class="flex items-center rounded-md"
          on:click={() => (showBandDropdown = !showBandDropdown)}>
          <Icon icon="tabler:dots-vertical" class="text-lg text-slate-500 hover:text-white" />
          <Tooltip>Select Band</Tooltip>
        </button>
        {#if showBandDropdown}
          <div class="absolute -top-3 right-7 flex flex-col z-10 bg-slate-700/90 shadow-md rounded-md mt-2">
            {#each BandKeys as key}
            <button class="text-xs text-left text-slate-100 py-1 px-2 hover:bg-rose-400/50"
            on:click={() => {selectedBandKey = key; showBandDropdown = false}}>
              {TopFailClusterBandKeyMap[key]}
            </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    <div class="flex items-center rounded-md pb-2">
      <table class="w-full">
        <thead class="bg-slate-900 ">
          <tr class="text-xs text-white text-left">
            <th class="px-4 py-1">CLUSTER</th>
            <th class="px-4 py-1">COUNT</th>
            <th class="px-4 py-1">PROPORTION</th>
            <th class="px-4 py-1">BAND</th>
          </tr>
        </thead>
        <tbody>
          {#if CallDropGBRData && CallDropGBRData[topImpactClusterListKey]}
            {#each Object.entries(CallDropGBRData[topImpactClusterListKey]) as [band, data]}
              {#each data.cluster as cluster, index}
                <tr class="text-xs text-slate-300 py-2">
                  <td class="py-1 px-4">{cluster}</td>
                  <td class="py-1 px-4">{(data.calldroptotal[index]).toLocaleString()}</td>
                  <td class="py-1 px-4">{((((data.calldroptotal[index]) / CallDropGBRData.calldropbybandall.by_band.failcount[2])) * 100).toFixed(2)}%</td>
                  <td class="py-1 px-4">{band}</td>
                </tr>
              {/each}
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>

  <!-- REGIONAL CLUSTER TABLE -->
  <div class="flex flex-col col-span-3 bg-slate-900/40 rounded-md">
    <div class="flex items-center p-4 gap-1">
      <Icon icon="carbon:assembly-cluster" class="text-slate-500"/>
      <h1 class="text-xs text-slate-500">VoLTE CALL DROP CLUSTER</h1>
    </div>
    <RegionalClusterTable {region} {field} />
  </div>

  <!-- REGIONAL CELL TABLE -->
  <div class="flex flex-col col-span-5 bg-slate-900/40 rounded-md">
    <div class="flex items-center p-4 gap-1">
      <Icon icon="ic:baseline-cell-tower" class="text-slate-500"/>
      <h1 class="text-xs text-slate-500">VoLTE CALL DROP CELL</h1>
    </div>
    <RegionalCellTable {region} {field} />
  </div>

</div>

<FailClusterInfoModal {band} {field} {region} bind:FailClusterModal={FailClusterModal} />