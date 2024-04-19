<script lang="ts">
  import { onMount } from "svelte";
  import Icon from '@iconify/svelte';
  import { trendDataStore, fetchTrendData } from "./Fetchs1OutHOData";
	import { Tooltip } from "flowbite-svelte";


  import Regionals1outHoAttempt from "../chart/Regionals1outHOAttempt.svelte";
  import Regionals1outTrendbyBand from "../chart/Regionals1outTrendbyBand.svelte";
  import Regionals1outFailCluster from "../chart/Regionals1outFailCluster.svelte";
  import Regionals1outFailSiteCell from "../chart/Regionals1outFailSiteCell.svelte";
  import RegionalClusterTable from "../../components/RegionalClusterTable.svelte";
  import RegionalCellTable from "../../components/RegionalCellTable.svelte";
  import FailClusterInfoModal from "../../components/FailClusterInfoModal.svelte";

  export let region: string;
  export let data: any;

  let field: string = 's1_handover_out_success_rate';
  let s1OutHORegionalData: any = null;
  let band: string;

  $: s1OutHORegionalData = $trendDataStore
  $: $trendDataStore, s1OutHORegionalData = $trendDataStore
  $: if (region) {
    (region);
  }

  onMount(async () => {
    if (!region) {
      region = 'Central';
    }
    fetchTrendData(region);
  })

  const s1OutHOAttemptCountChartKeyMap: { [key: string]: string} = {
    'Totals1OutHONominate_byband': 'Total Attempt',
  };
  const chartKeys = Object.keys(s1OutHOAttemptCountChartKeyMap);
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
  $: selectedNominateData = getSelectedData(s1OutHORegionalData, selectedChartKey)

  function getSelectedNominateOverallData(data: any, key: string): any {
    if (!data || !key || !data[key]) return null;
    const overallKey = key.replace(/_byband$/, '')
    if (!overallKey) return null;
    return data[key].overall[overallKey];
  }
  $: SelectedNominateOverallData = getSelectedNominateOverallData(s1OutHORegionalData, selectedChartKey)

  $: FailClusterCount = 'fail_cluster_count_byband';
</script>

<div class="grid grid-cols-8 gap-4 w-full mb-4">
  <!-- REGIONAL TRA HO FAIL & ATTEMPT COUNT -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} S1 OUT HO ATTEMPT COUNT</h1>
    </div>

    {#if s1OutHORegionalData}
      <div class="flex flex-col items-center justify-center h-full">
        <div class="flex flex-col">
          <h1 class="text-2xl text-white font-bold">
            {((s1OutHORegionalData.Totals1OutHONominate_byband.overall.Totals1OutHONominate) - 
            (s1OutHORegionalData.Totals1OutHONominate_byband.overall.Totals1OutHOdeNominate)).toLocaleString()}
          </h1>
          <h1 class="text-xs text-slate-500">
            {(((s1OutHORegionalData.Totals1OutHONominate_byband.overall.Totals1OutHONominate) - 
              (s1OutHORegionalData.Totals1OutHONominate_byband.overall.Totals1OutHOdeNominate)) / 7).toLocaleString()} (Per Day)
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <div class="rounded-sm px-1 py-[1px] bg-green-500 text-xs">
          {
            ((((s1OutHORegionalData.Totals1OutHONominate_byband.overall.Totals1OutHONominate) - 
              (s1OutHORegionalData.Totals1OutHONominate_byband.overall.Totals1OutHOdeNominate)) / 
              ((data.s1OutHOStatisticData.s1OutHO.Totals1OutHONominate_byband.overall.Totals1OutHONominate) - 
              (data.s1OutHOStatisticData.s1OutHO.Totals1OutHONominate_byband.overall.Totals1OutHOdeNominate))) * 
              100).toFixed(1)
          }%
        </div>
        <h1 class="text-xs text-slate-500">Share of the national s1 out ho fail count</h1>
      </div>
    {/if}
  </div>

  <!-- REGIONAL S1 OUT HO COUNT BY BAND -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4 gap-4">
    <div class="relative flex items-start gap-1">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <div class="flex flex-col">
        <h1 class="text-xs text-slate-500">S1 OUT HO ATTEMPT BY BAND</h1>
      </div>
      <button class="ms-auto flex items-center gap-2 text-gray-800 rounded-md"
        on:click={() => (showDropdown = !showDropdown)}>
        <Icon icon="tabler:dots-vertical" class="text-lg text-white" />
      </button>
      {#if showDropdown}
        <div class="z-50 absolute -top-5 right-5 flex flex-col bg-slate-700/90 shadow-md rounded-md mt-2">
          {#each chartKeys as key}
          <button class="text-xs text-left text-slate-100 py-1 px-2 hover:bg-rose-400/50"
          on:click={() => {selectedChartKey = key; showDropdown = false}}>
            {s1OutHOAttemptCountChartKeyMap[key]}
          </button>
          {/each}
        </div>
      {/if}
    </div>
    <div class="flex items-center gap-4">
      <div class="relative flex items-center justify-center">
        <div class="">
          <Regionals1outHoAttempt {s1OutHORegionalData} chartKey={selectedChartKey} />
        </div>
        <div class="absolute flex flex-col items-center justify-center gap-1">
          <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()}</h1>
          <h1 class="text-md text-slate-500 font-bold">
            {#if SelectedNominateOverallData}{SelectedNominateOverallData.toLocaleString()}{/if}
          </h1>
          <h1 class="text-xs text-white">{s1OutHOAttemptCountChartKeyMap[selectedChartKey]}</h1>
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

  <!-- REGIONAL S1 OUT HO TREND BY BAND -->
  <div class="flex flex-col col-span-4 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} S1 OUT HO TREND BY BAND</h1>
    </div>
    <div class="">
      <Regionals1outTrendbyBand {s1OutHORegionalData} />
    </div>
  </div>

  <!-- REGIONAL S1 OUT HO FAIL CLUSTER -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} S1 OUT HO FAIL CLUSTER</h1>
    </div>
    <div class="flex items-center justify-around">
      <div class="relative flex">
        <Regionals1outFailCluster {s1OutHORegionalData} />
        <div class="absolute top-[35%] left-[28%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">Fail Cluster</h1>
          <h1 class="text-2xl text-white font-bold">
            {#if s1OutHORegionalData}{s1OutHORegionalData.fail_cluster_count_all}{/if}
          </h1>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <div class="flex flex-col gap-4">
            {#if s1OutHORegionalData && s1OutHORegionalData[FailClusterCount]}
              {#each s1OutHORegionalData[FailClusterCount].band as bands, index}
                <div class="flex items-center">
                  <button class="flex items-center justify-between p-2 gap-2 text-xs text-white w-full rounded-md 
                    {bands === '2.3G' ? 'bg-sky-800' : 
                    bands === '2.6G' ? 'bg-sky-600' : 'bg-sky-400'}"
                    on:click={() => {band = bands; field = field; region=region; FailClusterModal = true}}>
                    {bands}
                    <h1 class="text-xs text-black w-4 h-4 rounded-full bg-rose-300">
                      {s1OutHORegionalData[FailClusterCount].count[index]}
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

  <!-- REGIONAL S1 OUT HO FAIL SITE & CELL -->
  <div class="flex flex-col col-span-3 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} S1 OUT HO FAIL SITE & CELL</h1>
    </div>
    <div class="flex items-center justify-around">
      <div class="relative flex">
        <Regionals1outFailSiteCell {s1OutHORegionalData} />
        <div class="absolute top-[35%] left-[25%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">Site / Cell Fail</h1>
          <h1 class="text-lg text-white font-bold">
            {#if s1OutHORegionalData}
              {s1OutHORegionalData.fail_site_count_all}/{s1OutHORegionalData.fail_cell_count_all}
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
            {#if s1OutHORegionalData}
              {#if s1OutHORegionalData.fail_site_count_byband.band.includes('2.3GHz')}
                {s1OutHORegionalData.fail_site_count_byband.count[s1OutHORegionalData.fail_site_count_byband.band.indexOf('2.3GHz')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if s1OutHORegionalData}
              {#if s1OutHORegionalData.fail_cell_count_byband.band.includes('2.3GHz')}
                {s1OutHORegionalData.fail_cell_count_byband.count[s1OutHORegionalData.fail_site_count_byband.band.indexOf('2.3GHz')]}
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
            {#if s1OutHORegionalData}
              {#if s1OutHORegionalData.fail_site_count_byband.band.includes('2.6GHz')}
                {s1OutHORegionalData.fail_site_count_byband.count[s1OutHORegionalData.fail_site_count_byband.band.indexOf('2.6GHz')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if s1OutHORegionalData}
              {#if s1OutHORegionalData.fail_cell_count_byband.band.includes('2.6GHz')}
                {s1OutHORegionalData.fail_cell_count_byband.count[s1OutHORegionalData.fail_site_count_byband.band.indexOf('2.6GHz')]}
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
            {#if s1OutHORegionalData}
              {#if s1OutHORegionalData.fail_site_count_byband.band.includes('800M')}
                {s1OutHORegionalData.fail_site_count_byband.count[s1OutHORegionalData.fail_site_count_byband.band.indexOf('800M')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if s1OutHORegionalData}
              {#if s1OutHORegionalData.fail_cell_count_byband.band.includes('800M')}
                {s1OutHORegionalData.fail_cell_count_byband.count[s1OutHORegionalData.fail_site_count_byband.band.indexOf('800M')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
      </div>
    </div>
  </div>

  <!-- REGIONAL S1 OUT HO MOST FAIL CLUSTER AND CELL LIST -->
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
          {#if s1OutHORegionalData && s1OutHORegionalData[topImpactClusterListKey]}
            {#each Object.entries(s1OutHORegionalData[topImpactClusterListKey]) as [band, data]}
              {#each data.cluster as cluster, index}
                <tr class="text-xs text-slate-300 py-2">
                  <td class="py-1 px-4">{cluster}</td>
                  <td class="py-1 px-4">{(data.s1outhofailtotal[index]).toLocaleString()}</td>
                  <td class="py-1 px-4">{((data.s1outhofailtotal[index] / s1OutHORegionalData.s1outhofallbybandall.by_band.failcount[2]) * 100).toFixed(2)}%</td>
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
      <h1 class="text-xs text-slate-500">s1 OUT HO CLUSTER</h1>
    </div>
    <RegionalClusterTable {region} {field} />
  </div>

  <!-- REGIONAL CELL TABLE -->
  <div class="flex flex-col col-span-5 bg-slate-900/40 rounded-md">
    <div class="flex items-center p-4 gap-1">
      <Icon icon="ic:baseline-cell-tower" class="text-slate-500"/>
      <h1 class="text-xs text-slate-500">s1 OUT HO CELL</h1>
    </div>
    <RegionalCellTable {region} {field} />
  </div>

</div>

<FailClusterInfoModal {band} {field} {region} bind:FailClusterModal={FailClusterModal} />