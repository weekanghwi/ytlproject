<script lang="ts">
  import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast'

  import OverallcellavailCount from './chart/OverallcellavailCount.svelte';
  // // import OverallInterFreqHoAttempt from './chart/OverallInterFreqHOAttempt.svelte';
  import OverallcellavailTrend from './chart/OverallcellavailTrend.svelte';
  import OverallcellavailTrendbyband from './chart/OverallcellavailTrendbyband.svelte';
  import OverallcellavailFailCluster from './chart/OverallcellavailFailCluster.svelte';
  import OverallcellavailFailSite from './chart/OverallcellavailFailSite.svelte';
  import OverallcellavailFailCell from './chart/OverallcellavailFailCell.svelte';
  import RegionalContents from './regionalcontents/RegionalContents.svelte';

  export let data;

  let OverallData: any = null;

  onMount(async () => {
    try {
      OverallData = data.CellAvailStatisticData.CellAvail;
    } catch (error) {
      const errorMessage = error.message || 'An error occurred while fetching chart data!';
      toast.error(errorMessage);
    }
  });

  let RegionTabs = ['Central', 'Northern', 'Southern', 'Eastern', 'Sabah', 'Sarawak'];
  let selectedRegiontab: string = RegionTabs[0];
  function RegionselectTab(tab: string) {
    selectedRegiontab = tab;
  }

  const interFreqHONominateKeyMap: { [key: string]: string} = {
    'interfreqmeasgapoutatt_byband': 'Measure Gap',
    'interfreqnomeasgapoutatt_byband': 'No Measure Gap'
  };
  const interFreqHONominateDescription: { [key: string]: string} = {
    'Measure Gap': 'Measurement gap is used when peform Inter frequency handover.',
    'No Measure Gap': 'Measurement gap is not used when peform Inter frequency handover.'
  }
  const interFreqHONominateKey = Object.keys(interFreqHONominateKeyMap);
  let SelectedinterFreqHONominateChartKey = interFreqHONominateKey[0];
  let showDropdowninterFreqHONominate = false;

  function getSelectedNominateData(data: any, key: string): any {
    if (!data || !key || !data[key]) return null;
    return data[key].by_band;
  }
  $: selectedNominateData = getSelectedNominateData(OverallData, SelectedinterFreqHONominateChartKey)

  function getSelectedNominateOverallData(data: any, key: string): any {
    if (!data || !key || !data[key]) return null;
    const overallKey = key.replace(/_byband$/, '')
    if (!overallKey) return null;
    return data[key].overall[overallKey];
  }
  $: SelectedNominateOverallData = getSelectedNominateOverallData(OverallData, SelectedinterFreqHONominateChartKey)
</script>

<div class="flex flex-col ps-4 pt-3 w-full">

  <!-- TITLE -->
  <div class="flex flex-col gap-2 mb-4">
    <div class="flex items-center gap-2">
      <p class="text-xs text-slate-400 ms-1">
        {data.CellAvailStatisticData.CellAvail.cellavail_trend_all.weeknums[9]} CELL AVAILABILITY
      </p>
    </div>
    <h1 class="text-lg text-slate-200 font-semibold ms-1">OVERVIEW</h1>
  </div>

  <!-- OVERALL CONTENTS -->
  <div class="grid grid-cols-8 gap-4 mb-4">
    <!-- OVERALL INTER FREQ HO COUNT CHART -->
    <div class="flex flex-col col-span-2 rounded-md bg-slate-900/40 p-4">
      <div class="flex items-center gap-1 mb-4">
        <Icon icon="f7:number-square" class="text-lg text-slate-500" />
        <h1 class="text-xs text-slate-500">SITE DOWN TIME</h1>
      </div>
      <div class="flex items-center justify-around">
        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallcellavailCount {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center">
            <h1 class="text-xs text-slate-300">SITE DOWN TIME</h1>
            <h1 class="text-XS text-white font-bold">
              {(data.CellAvailStatisticData.CellAvail.cellavaildownbyband.overall.DownTime).toLocaleString()}
            </h1>
          </div>
        </div>
        
        <div class="flex flex-col justify-center gap-2">
          <div class="flex flex-col gap-1">
            {#each Object.keys(data.CellAvailStatisticData.CellAvail.cellavaildownbyband.by_band.band) as index}
            <div class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-sm 
              {data.CellAvailStatisticData.CellAvail.cellavaildownbyband.by_band.band[index] === '800M' ? 'bg-sky-400' : 
              data.CellAvailStatisticData.CellAvail.cellavaildownbyband.by_band.band[index] === '2.6GHz' ? 'bg-sky-600' : 'bg-sky-800'}"></div>
              <h1 class="text-xs text-white">{data.CellAvailStatisticData.CellAvail.cellavaildownbyband.by_band.band[index]}</h1>
            </div>
            <h1 class="text-xs text-slate-500 ps-4">
              {(data.CellAvailStatisticData.CellAvail.cellavaildownbyband.by_band.ratio[index]).toFixed(2)}%
            </h1>
            {/each}
          </div>
        </div>

      </div>
    </div>

    <!-- OVERALL CELL AVAIL NOMINATE ITEM -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-1">
          <Icon icon="f7:number-square" class="text-lg text-slate-500" />
          <h1 class="text-xs text-slate-500">CELL AVAIL Nominate Items Count & Ratio</h1>
        </div>
        <button class="ms-auto flex items-center gap-2 text-gray-800 rounded-md"
        on:click={() => (showDropdowninterFreqHONominate = !showDropdowninterFreqHONominate)}>
          <Icon icon="bi:three-dots" class="text-lg text-white" />
        </button>
        {#if showDropdowninterFreqHONominate}
        <div class="relative flex items-center" style="z-index: 1000;">
          <div class="absolute flex flex-col -top-5 right-5 bg-slate-700/90 shadow-md rounded-md">
            {#each interFreqHONominateKey as key}
            <button class="text-xs text-left text-slate-100 py-1 px-2 hover:bg-rose-400/50 whitespace-nowrap"
            on:click={() => {SelectedinterFreqHONominateChartKey = key; showDropdowninterFreqHONominate = false}}>
              {interFreqHONominateKeyMap[key]}
            </button>
            {/each}
        </div>
        </div>
        {/if}
      </div>
    </div>

    <!-- OVERALL -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4">
    </div>

    <!-- CELL AVAIL TREND -->
    <div class="flex flex-col col-span-2 rounded-md bg-slate-900/40">
      <div class="relative flex items-center gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">CELL AVAIL WEEKLY TREND</h1>
        <div class="absolute top-10 left-5 flex items-center">
          <h1 class="text-2xl text-white font-bold">
            {(data.CellAvailStatisticData.CellAvail.cellavail_trend_all.values[9]).toFixed(2)}%
          </h1>
          <p class="{`text-xs ps-2 ${(data.CellAvailStatisticData.CellAvail.cellavail_trend_all.values[9] - data.CellAvailStatisticData.CellAvail.cellavail_trend_all.values[8]) < 0 ? 'text-rose-400' : 'text-green-400' }`}">
            {(data.CellAvailStatisticData.CellAvail.cellavail_trend_all.values[9] - data.CellAvailStatisticData.CellAvail.cellavail_trend_all.values[8]).toFixed(2)}
          </p>
          {#if (data.CellAvailStatisticData.CellAvail.cellavail_trend_all.values[9] - data.CellAvailStatisticData.CellAvail.cellavail_trend_all.values[8]) > 0}
          <Icon icon="iconamoon:trend-up-light" class="text-lg text-green-400 ms-1"/>
          {:else}
          <Icon icon="iconamoon:trend-down-light" class="text-lg text-rose-400 ms-1"/>
          {/if}
        </div>
      </div>
      <OverallcellavailTrend {OverallData} />
    </div>

    <!-- CELL AVAIL TREND BY BAND -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40">
      <div class="flex items-center mb-4 gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">WEEKLY TREND EACH BANDS</h1>
      </div>
      <OverallcellavailTrendbyband {OverallData} />
    </div>

    <!-- CELL AVAIL CLUSTER, SITE AND CELL COUNT -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4">
      <div class="flex items-center gap-1 mb-4">
        <Icon icon="icon-park-outline:folder-failed"  class="text-lg text-rose-500" />
        <h1 class="text-xs text-slate-500">WEEKLY FAIL CLUSTER & SITE</h1>
      </div>
      <div class="flex items-center justify-around gap-3">
        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallcellavailFailCluster {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail cluster</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.CellAvailStatisticData.CellAvail.fail_cluster_count_all).toLocaleString()}
            </h1>
          </div>
        </div>

        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallcellavailFailSite {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail Sites</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.CellAvailStatisticData.CellAvail.fail_site_count_all).toLocaleString()}
            </h1>
          </div>
        </div>

        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallcellavailFailCell {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail Cells</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.CellAvailStatisticData.CellAvail.fail_cell_count_all).toLocaleString()}
            </h1>
          </div>
        </div>

      </div>
    </div>

  </div>

  <!-- REGIONAL VIEW -->
  <div class="flex flex-col gap-2 mb-4">
    <h1 class="text-lg text-slate-200 font-semibold ms-1">REGIONAL VIEW</h1>
  </div>

  <!-- REGIONAL SELECTION-->
  <div class="flex items-center justify-center gap-[1px] mb-4">
    {#each RegionTabs as tab}
    <button on:click={() => RegionselectTab(tab)}
      class="w-full text-xs text-white rounded-sm p-2 hover:bg-sky-800 active:bg-sky-800 {selectedRegiontab === tab ? 'bg-sky-800' : 'bg-slate-900/40'}">
      {tab}
    </button>
    {/each}
  </div>

  <!-- REGIONAL CONTENTS -->
  <div class="flex items-center justify-center">
    {#if selectedRegiontab === 'Central'}
    <RegionalContents region={selectedRegiontab} {data}/>
    {:else if selectedRegiontab === 'Northern'}
    <RegionalContents region={selectedRegiontab} {data}/>
    {:else if selectedRegiontab === 'Southern'}
    <RegionalContents region={selectedRegiontab} {data}/>
    {:else if selectedRegiontab === 'Eastern'}
    <RegionalContents region={selectedRegiontab} {data}/>
    {:else if selectedRegiontab === 'Sabah'}
    <RegionalContents region={selectedRegiontab} {data}/>
    {:else if selectedRegiontab === 'Sarawak'}
    <RegionalContents region={selectedRegiontab} {data}/>
    {/if}
  </div>

  

</div>

<div class="toaster">
  <Toaster />
</div>
<style>
  .toaster {
    z-index: 1000;
  }
</style>