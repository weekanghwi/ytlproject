<script lang="ts">
  import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast'

  import OverallattachCount from './chart/OverallattachCount.svelte';
  import OverallattachType from './chart/OverallattachType.svelte';
  import OverallattachTrend from './chart/OverallattachTrend.svelte';
  import OverallattachTrendbyband from './chart/OverallattachTrendbyband.svelte';
  import OverallattachFailCluster from './chart/OverallattachFailCluster.svelte';
  import OverallattachFailSite from './chart/OverallattachFailSite.svelte';
  import OverallattachFailCell from './chart/OverallattachFailCell.svelte';
  import RegionalContents from './regionalcontents/RegionalContents.svelte';

  export let data;

  let OverallData: any = null;

  onMount(async () => {
    try {
      OverallData = data.AttachStatisticData.Attach;
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

  const AttachNominateKeyMap: { [key: string]: string} = {
    'attachnominatebyband': 'Attach All',
    'connestabbyband': 'ConnEstab',
    's1connestabbyband': 'S1ConnEstab',
    'establnitbyband': 'EstabInit',
  };
  const AttachNominateDescription: { [key: string]: string} = {
    'Attach All': 'All of Attach Type',
    'ConnEstab': 'When the eNB received the RRCConnectionRequest from the UE',
    'S1ConnEstab': 'Message is received from the MME following an Initial UE message transmission',
    'EstabInit': 'Success/Failure of E-RAB after receiving InitialContextSetupRequest'
  }
  const AttachNominateKey = Object.keys(AttachNominateKeyMap);
  let SelectedAttachNominateChartKey = AttachNominateKey[0];
  let showDropdownAttachNominate = false;

  function getSelectedNominateData(data: any, key: string): any {
    if (!data || !key || !data[key]) return null;
    return data[key].by_band;
  }
  $: selectedNominateData = getSelectedNominateData(OverallData, SelectedAttachNominateChartKey)

  function getSelectedNominateOverallData(data: any, key: string): any {
    if (!data || !key || !data[key]) return null;
    const overallKey = 'NominateTotal'
    if (!overallKey) return null;
    return data[key].overall[overallKey];
  }
  $: SelectedNominateOverallData = getSelectedNominateOverallData(OverallData, SelectedAttachNominateChartKey)
</script>

<div class="flex flex-col ps-4 pt-3 w-full">

  <!-- TITLE -->
  <div class="flex flex-col gap-2 mb-4">
    <div class="flex items-center gap-2">
      <p class="text-xs text-slate-400 ms-1">
        {data.AttachStatisticData.Attach.attach_trend_all.weeknums[9]} ATTACH SUCCESS
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
        <h1 class="text-xs text-slate-500">ATTACH ATTEMPT</h1>
      </div>
      <div class="flex items-center justify-around">
        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallattachCount {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center">
            <h1 class="text-xs text-slate-300">ATTACH Attempt</h1>
            <h1 class="text-XS text-white font-bold">
              {(data.AttachStatisticData.Attach.attachnominatebyband.overall.NominateTotal).toLocaleString()}
            </h1>
          </div>
        </div>
        
        <div class="flex flex-col justify-center gap-2">
          <div class="flex flex-col gap-1">
            {#each Object.keys(data.AttachStatisticData.Attach.attachnominatebyband.by_band.band) as index}
            <div class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-sm 
              {data.AttachStatisticData.Attach.attachnominatebyband.by_band.band[index] === '800M' ? 'bg-sky-400' : 
              data.AttachStatisticData.Attach.attachnominatebyband.by_band.band[index] === '2.6GHz' ? 'bg-sky-600' : 'bg-sky-800'}"></div>
              <h1 class="text-xs text-white">{data.AttachStatisticData.Attach.attachnominatebyband.by_band.band[index]}</h1>
            </div>
            <h1 class="text-xs text-slate-500 ps-4">
              {(data.AttachStatisticData.Attach.attachnominatebyband.by_band.ratio[index]).toFixed(2)}%
            </h1>
            {/each}
          </div>
        </div>

      </div>
    </div>

    <!-- OVERALL ATTACH NOMINATE ITEM -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-1">
          <Icon icon="f7:number-square" class="text-lg text-slate-500" />
          <h1 class="text-xs text-slate-500">TYPE OF ATTACH RATIO & COUNT</h1>
        </div>
        <button class="ms-auto flex items-center gap-2 text-gray-800 rounded-md"
        on:click={() => (showDropdownAttachNominate = !showDropdownAttachNominate)}>
          <Icon icon="bi:three-dots" class="text-lg text-white" />
        </button>
        {#if showDropdownAttachNominate}
        <div class="relative flex items-center" style="z-index: 1000;">
          <div class="absolute flex flex-col -top-5 right-5 bg-slate-700/90 shadow-md rounded-md">
            {#each AttachNominateKey as key}
            <button class="text-xs text-left text-slate-100 py-1 px-2 hover:bg-rose-400/50 whitespace-nowrap"
            on:click={() => {SelectedAttachNominateChartKey = key; showDropdownAttachNominate = false}}>
              {AttachNominateKeyMap[key]}
            </button>
            {/each}
        </div>
        </div>
        {/if}
      </div>

      <div class="flex items-center justify-center gap-8">
        <div class="flex flex-col justify-center w-2/5">
          <h1 class="text-3xl text-white font-bold">
            {#if selectedNominateData}
            {(((SelectedNominateOverallData)/(data.AttachStatisticData.Attach.attachnominatebyband.overall.NominateTotal)) * 100).toFixed(2)}%
            {/if}
          </h1>
          <h1 class="text-XS text-white font-bold">
            {#if SelectedNominateOverallData}
              {SelectedNominateOverallData.toLocaleString()}
            {/if}
          </h1>
          <h1 class="text-xs text-slate-400 font-bold mb-1">{AttachNominateKeyMap[SelectedAttachNominateChartKey]}</h1>
          <h1 class="text-xs text-slate-500">
            {AttachNominateDescription[AttachNominateKeyMap[SelectedAttachNominateChartKey]] || ''}
          </h1>
        </div>
        <div class="flex items-center justify-center gap-4">
          <div class="relative flex items-center justify-center">
            <div class="z-50">
              <OverallattachType {OverallData} chartKey={SelectedAttachNominateChartKey} />
            </div>
            <div class="absolute flex flex-col items-center justify-center">
              <h1 class="text-xs text-slate-300">
                {AttachNominateKeyMap[SelectedAttachNominateChartKey]}
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
              <!-- <h1 class="text-xs text-slate-500 ps-4">{(selectedNominateData.counts[index]).toLocaleString()}</h1> -->
              <h1 class="text-xs text-slate-500 ps-4">
                {Math.abs(selectedNominateData.counts[index]) >= 1.0e9
                  ? (selectedNominateData.counts[index] / 1.0e9).toFixed(2) + " B"
                  : Math.abs(selectedNominateData.counts[index]) >= 1.0e6
                  ? (selectedNominateData.counts[index] / 1.0e6).toFixed(2) + " M"
                  : Math.abs(selectedNominateData.counts[index]) >= 1.0e3
                  ? (selectedNominateData.counts[index] / 1.0e3).toFixed(2) + " K"
                  : selectedNominateData.counts[index]}
              </h1>
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

    <!-- ATTACH TREND -->
    <div class="flex flex-col col-span-2 rounded-md bg-slate-900/40">
      <div class="relative flex items-center gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">ATTACH WEEKLY TREND</h1>
        <div class="absolute top-10 left-5 flex items-center">
          <h1 class="text-2xl text-white font-bold">
            {(data.AttachStatisticData.Attach.attach_trend_all.values[9]).toFixed(2)}%
          </h1>
          <p class="{`text-xs ps-2 ${(data.AttachStatisticData.Attach.attach_trend_all.values[9] - data.AttachStatisticData.Attach.attach_trend_all.values[8]) < 0 ? 'text-rose-400' : 'text-green-400' }`}">
            {(data.AttachStatisticData.Attach.attach_trend_all.values[9] - data.AttachStatisticData.Attach.attach_trend_all.values[8]).toFixed(2)}
          </p>
          {#if (data.AttachStatisticData.Attach.attach_trend_all.values[9] - data.AttachStatisticData.Attach.attach_trend_all.values[8]) > 0}
          <Icon icon="iconamoon:trend-up-light" class="text-lg text-green-400 ms-1"/>
          {:else}
          <Icon icon="iconamoon:trend-down-light" class="text-lg text-rose-400 ms-1"/>
          {/if}
        </div>
      </div>
      <OverallattachTrend {OverallData} />
    </div>

    <!-- ATTACH TREND BY BAND -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40">
      <div class="flex items-center mb-4 gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">WEEKLY TREND EACH BANDS</h1>
      </div>
      <OverallattachTrendbyband {OverallData} />
    </div>

    <!-- ATTACH CLUSTER, SITE AND CELL COUNT -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4">
      <div class="flex items-center gap-1 mb-4">
        <Icon icon="icon-park-outline:folder-failed"  class="text-lg text-rose-500" />
        <h1 class="text-xs text-slate-500">WEEKLY FAIL CLUSTER & SITE</h1>
      </div>
      <div class="flex items-center justify-around gap-3">
        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallattachFailCluster {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail cluster</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.AttachStatisticData.Attach.fail_cluster_count_all).toLocaleString()}
            </h1>
          </div>
        </div>

        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallattachFailSite {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail cluster</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.AttachStatisticData.Attach.fail_site_count_all).toLocaleString()}
            </h1>
          </div>
        </div>

        <div class="relative flex items-center justify-center">
          <div class="z-50">
            <OverallattachFailCell {OverallData} />
          </div>
          <div class="absolute flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail cluster</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.AttachStatisticData.Attach.fail_cell_count_all).toLocaleString()}
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