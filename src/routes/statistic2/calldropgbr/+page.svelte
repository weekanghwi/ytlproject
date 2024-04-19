<script lang="ts">
  import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
	import { onMount } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast'

  import OverallCallDropCount from './chart/OverallCallDropCount.svelte';
  import Overallvolteestablinitsucc from './chart/Overallvolteestablinitsucc.svelte';
  import OverallCallDropTrend from './chart/OverallCallDropTrend.svelte';
  import OverallCallDropbyBand from './chart/OverallCallDropbyBand.svelte';
  import OverallCallDropCluster from './chart/OverallCallDropCluster.svelte';
  import OverallCallDropSite from './chart/OverallCallDropSite.svelte';
  import OverallCallDropCell from './chart/OverallCallDropCell.svelte';
  import RegionalContents from './regionalcontents/RegionalContents.svelte';

  export let data;

  let OverallData: any = null;

  onMount(async () => {
    try {
      OverallData = data.CallDropGBRStatisticData.CallDropGBR;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching chart data!';
      toast.error(errorMessage);
    }
  });

  let RegionTabs = ['Central', 'Northern', 'Southern', 'Eastern', 'Sabah', 'Sarawak'];
  let selectedRegiontab: string = RegionTabs[0];
  function RegionselectTab(tab: string) {
    selectedRegiontab = tab;
  }

  const calldropNominateKeyMap: { [key: string]: string} = {
    'sumvolteestablnitsuccnbr_byband': 'eRAB Success',
    'sumvolteestabaddsuccnbr_byband': 'eRAB Add Success',
    'sumvolteerablncominghosuccnbr_byband': 'HO In Success',
    // 'sumvolteerablncominghosuccnbr_byband': 'S1 Handover Success'
  };
  const calldropNominateDescription: { [key: string]: string} = {
    'eRAB Success': 'The cumulated number of successes for E-RAB setup during origination call.',
    'eRAB Add Success': 'The cumulated number of ERAB additional setup success count.',
    'HO In Success': 'The cumulated number when handover from the target eNB is completed normally.'
  }
  const calldropNominateKey = Object.keys(calldropNominateKeyMap);
  let SelectedcalldropNominateChartKey = calldropNominateKey[0];
  let showDropdownCallDropNominate = false;

  function getSelectedNominateData(data: any, key: string): any {
    if (!data || !key || !data[key]) return null;
    return data[key].by_band;
  }
  $: selectedNominateData = getSelectedNominateData(OverallData, SelectedcalldropNominateChartKey)

  function getSelectedNominateOverallData(data: any, key: string): any {
    if (!data || !key || !data[key]) return null;
    const overallKey = key.replace(/_byband$/, '')
    if (!overallKey) return null;
    return data[key].overall[overallKey];
  }
  $: SelectedNominateOverallData = getSelectedNominateOverallData(OverallData, SelectedcalldropNominateChartKey)

</script>

<div class="flex flex-col ps-4 pt-3 w-full">
  <!-- TITLE -->
  <div class="flex flex-col gap-2 mb-4">
    <div class="flex items-center gap-2">
      <p class="text-xs text-slate-400 ms-1">
        {data.CallDropGBRStatisticData.CallDropGBR.calldrop_trend_all.weeknums[9]} CALL DROP(GBR) STATISTIC
      </p>
    </div>
    <h1 class="text-lg text-slate-200 font-semibold ms-1">OVERVIEW</h1>
  </div>

  <!-- OVERALL CONTENTS -->
  <div class="grid grid-cols-8 gap-4 mb-4">

    <!-- OVERALL CALL DROP COUNT CHART -->
    <div class="flex flex-col col-span-2 rounded-md bg-slate-900/40 p-4">
      <div class="flex items-center gap-1 mb-4">
        <Icon icon="f7:number-square" class="text-lg text-slate-500" />
        <h1 class="text-xs text-slate-500">CALL DROP (GBR)</h1>
      </div>
      <div class="flex items-center justify-around">
        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallCallDropCount {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center">
            <h1 class="text-xs text-slate-300">Drop(GBR) Count</h1>
            <h1 class="text-XS text-white font-bold">
              {(data.CallDropGBRStatisticData.CallDropGBR.calldropcoutbyband.overall.CallDropCount).toLocaleString()}
            </h1>
          </div>
        </div>
        
        <div class="flex flex-col justify-center gap-2">
          <div class="flex flex-col gap-1">
            {#each Object.keys(data.CallDropGBRStatisticData.CallDropGBR.calldropcoutbyband.by_band.band) as index}
            <div class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-sm 
              {data.CallDropGBRStatisticData.CallDropGBR.calldropcoutbyband.by_band.band[index] === '800M' ? 'bg-sky-400' : 
              data.CallDropGBRStatisticData.CallDropGBR.calldropcoutbyband.by_band.band[index] === '2.6GHz' ? 'bg-sky-600' : 'bg-sky-800'}"></div>
              <h1 class="text-xs text-white">{data.CallDropGBRStatisticData.CallDropGBR.calldropcoutbyband.by_band.band[index]}</h1>
            </div>
            <h1 class="text-xs text-slate-500 ps-4">
              {(data.CallDropGBRStatisticData.CallDropGBR.calldropcoutbyband.by_band.ratio[index]).toFixed(2)}%
            </h1>
            {/each}
          </div>
        </div>

      </div>
    </div>

    <!-- OVERALL CALL DROP NOMINATE ITEM -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-1">
          <Icon icon="f7:number-square" class="text-lg text-slate-500" />
          <h1 class="text-xs text-slate-500">VoLTE Call Drop Nominate Items Count & Ratio</h1>
        </div>
        <button class="ms-auto flex items-center gap-2 text-gray-800 rounded-md"
        on:click={() => (showDropdownCallDropNominate = !showDropdownCallDropNominate)}>
          <Icon icon="bi:three-dots" class="text-lg text-white" />
        </button>
        {#if showDropdownCallDropNominate}
        <div class="relative flex items-center" style="z-index: 1000;">
          <div class="absolute flex flex-col -top-5 right-5 bg-slate-700/90 shadow-md rounded-md">
            {#each calldropNominateKey as key}
            <button class="text-xs text-left text-slate-100 py-1 px-2 hover:bg-rose-400/50 whitespace-nowrap"
            on:click={() => {SelectedcalldropNominateChartKey = key; showDropdownCallDropNominate = false}}>
              {calldropNominateKeyMap[key]}
            </button>
            {/each}
        </div>
        </div>
        {/if}
      </div>

      <div class="flex items-center justify-center gap-8">
        <div class="flex flex-col justify-center w-2/5">
          <h1 class="text-3xl text-white font-bold mb-2">
            {#if selectedNominateData}
            {(((SelectedNominateOverallData)/(data.CallDropGBRStatisticData.CallDropGBR.totalVoLTEcalldropNominate.Total)) * 100).toFixed(2)}%
            {/if}
          </h1>
          <h1 class="text-xs text-slate-400 font-bold mb-1">{calldropNominateKeyMap[SelectedcalldropNominateChartKey]}</h1>
          <h1 class="text-xs text-slate-500">
            {calldropNominateDescription[calldropNominateKeyMap[SelectedcalldropNominateChartKey]] || ''}
          </h1>
        </div>
        <div class="flex items-center justify-center gap-4">
          <div class="relative flex items-center justify-center">
            <div class="z-50">
              <Overallvolteestablinitsucc {OverallData} chartKey={SelectedcalldropNominateChartKey} />
            </div>
            <div class="absolute flex flex-col items-center justify-center">
              <h1 class="text-xs text-slate-300">
                {calldropNominateKeyMap[SelectedcalldropNominateChartKey]}
              </h1>
              <h1 class="text-XS text-white font-bold">
                {#if SelectedNominateOverallData}
                  {SelectedNominateOverallData.toLocaleString()}
                {/if}
              </h1>
            </div>
          </div>
  
          <div class="flex flex-col justify-center gap-2">
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
    
    <!-- OVERALL -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4">
    </div>

    <!-- OVERALL CALL DROP TREND -->
    <div class="flex flex-col col-span-2 rounded-md bg-slate-900/40">
      <div class="relative flex items-center gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">VoLTE CALL DROP WEEKLY TREND</h1>
        <div class="absolute top-10 left-5 flex items-center">
          <h1 class="text-2xl text-white font-bold">
            {(data.CallDropGBRStatisticData.CallDropGBR.calldrop_trend_all.values[9]).toFixed(2)}%
          </h1>
          <p class="{`text-xs ps-2 ${(data.CallDropGBRStatisticData.CallDropGBR.calldrop_trend_all.values[9] - data.CallDropGBRStatisticData.CallDropGBR.calldrop_trend_all.values[8]) < 0 ? 'text-rose-400' : 'text-green-400' }`}">
            {(data.CallDropGBRStatisticData.CallDropGBR.calldrop_trend_all.values[9] - data.CallDropGBRStatisticData.CallDropGBR.calldrop_trend_all.values[8]).toFixed(2)}
          </p>
          {#if (data.CallDropGBRStatisticData.CallDropGBR.calldrop_trend_all.values[9] - data.CallDropGBRStatisticData.CallDropGBR.calldrop_trend_all.values[8]) > 0}
          <Icon icon="iconamoon:trend-up-light" class="text-lg text-green-400 ms-1"/>
          {:else}
          <Icon icon="iconamoon:trend-down-light" class="text-lg text-rose-400 ms-1"/>
          {/if}
        </div>
      </div>
      <OverallCallDropTrend {OverallData} />
    </div>

    <!-- OVERALL CALL DROP TREND BY BAND -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40">
      <div class="flex items-center mb-4 gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">WEEKLY TREND EACH BANDS</h1>
      </div>
      <OverallCallDropbyBand {OverallData} />
    </div>

    <!-- OVERALL CALL DROP CLUSTER, SITE AND CELL COUNT -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4">
      <div class="flex items-center gap-1 mb-4">
        <Icon icon="icon-park-outline:folder-failed"  class="text-lg text-rose-500" />
        <h1 class="text-xs text-slate-500">WEEKLY FAIL CLUSTER & SITE</h1>
      </div>
      <div class="flex items-center justify-around gap-3">
        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallCallDropCluster {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail cluster</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.CallDropGBRStatisticData.CallDropGBR.fail_cluster_count_all).toLocaleString()}
            </h1>
          </div>
        </div>

        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallCallDropSite {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail cluster</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.CallDropGBRStatisticData.CallDropGBR.fail_site_count_all).toLocaleString()}
            </h1>
          </div>
        </div>

        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallCallDropCell {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail cluster</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.CallDropGBRStatisticData.CallDropGBR.fail_cell_count_all).toLocaleString()}
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

<Toaster />