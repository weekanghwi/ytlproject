<script lang="ts">
  import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast'

  import OverallRrcConnbyBand from './chart/OverallRRCConnbyBand.svelte';
  import OverallRrcConnTrend from './chart/OverallRRCConnTrend.svelte';
  import OverallRrcConnTrendbyBand from './chart/OverallRRCConnTrendbyBand.svelte';
  import RegionalContent from './regionalcontents/RegionalContent.svelte';

  export let data;

  let OverallData: any = null;

  onMount(async () => {
    try {
      OverallData = data.RRCStatisticData.RRCsetup;
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
</script>

<div class="flex flex-col ps-4 pt-3 w-full">

  <!-- TITLE -->
  <div class="flex flex-col gap-2 mb-4">
    <div class="flex items-center gap-2">
      <p class="text-xs text-slate-400 ms-1">
        {data.RRCStatisticData.RRCsetup.rrcsetup_trend_all.weeknums[9]} RRC SETUP STATISTIC
      </p>
    </div>
    <h1 class="text-lg text-slate-200 font-semibold ms-1">OVERVIEW</h1>
  </div>

  <!-- OVERALL CONTENTS -->
  <!-- RRC CONNECTION COUNT AND SUCCESS OVERALL -->
  <div class="flex justify-between rounded-md bg-slate-900/40 p-4 mb-4">
    <!-- RRC CONNECTION COUNT AND ITEMS EXPLAIN -->
    <div class="flex flex-col">
      <p class="text-xs text-slate-500">
        RRC Attempt count 
        <span class="text-rose-400">{data.RRCStatisticData.RRCsetup.rrcsetup_trend_all.weeknums[9]}</span>
      </p>
      <h1 class="text-2xl text-white font-bold">
        {(data.RRCStatisticData.RRCsetup.rrcattemptcoutbyband.overall.RRCAttempt).toLocaleString()}
      </h1>
      <h1 class="text-xs text-slate-500">{(data.RRCStatisticData.RRCsetup.rrcattemptcoutbyband.overall.RRCAttempt / 7).toLocaleString(undefined, {maximumFractionDigits: 0})} (Per Day)</h1>
      <p class="text-xs text-slate-500 mt-4">When the eNB received the RRCConnectionRequest or <br>RRCConnectionSetupComplete message from the UE </p>
    </div>

    <!-- RRC CONNECTION RATIO CHARTS BY BAND -->
    <div class="flex items-center justify-center gap-4">
      <div class="relative flex items-end w-full">
        <OverallRrcConnbyBand {OverallData} />
        <div class="flex flex-col items-center justify-center absolute top-[38%] left-[11%]">
          <p class="text-sm text-slate-500">RRC Connection</p>
          <p class="text-xs text-slate-500">Ratio by band</p>
        </div>
      </div>
      <div class="flex flex-col items-start justify-center gap-2">
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-800"></div>
            <p class="text-xs text-white">2.3GHz</p>
            <p class="text-xs text-white">{(data.RRCStatisticData.RRCsetup.rrcattemptcoutbyband.by_band.values[0]).toFixed(1)}%</p>
          </div>
          <p class="text-[11px] text-slate-500 ps-4">
            {(data.RRCStatisticData.RRCsetup.rrcattemptcoutbyband.by_band.counts[0]).toLocaleString()}
          </p>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-600"></div>
            <p class="text-xs text-white">2.6GHz</p>
            <p class="text-xs text-white">{(data.RRCStatisticData.RRCsetup.rrcattemptcoutbyband.by_band.values[1]).toFixed(1)}%</p>
            
          </div>
          <p class="text-[11px] text-slate-500 ps-4">
            {(data.RRCStatisticData.RRCsetup.rrcattemptcoutbyband.by_band.counts[1]).toLocaleString()}
          </p>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-400"></div>
            <p class="text-xs text-white">800MHz</p>
            <p class="text-xs text-white">{(data.RRCStatisticData.RRCsetup.rrcattemptcoutbyband.by_band.values[2]).toFixed(1)}%</p>
          </div>
          <p class="text-[11px] text-slate-500 ps-4">
            {(data.RRCStatisticData.RRCsetup.rrcattemptcoutbyband.by_band.counts[2]).toLocaleString()}
          </p>
        </div>
      </div>
    </div>

    <!-- RRC CONNECTION SETUP SUCCESS RATE BY BAND -->
    <div class="flex">
      <div class="grid grid-cols-4 space-x-4">
        <div class="col-span-4 flex items-center ps-4">
          <h1 class="text-xs text-slate-500">RRC Connection Success Ratio and Fail Count by Band</h1>
        </div>

        <div class="flex flex-col justify-center rounded-lg bg-green-700/50 p-4">
          <h1 class="text-xs text-slate-500 mb-auto">Overall</h1>
          <h1 class="text-2xl text-white font-bold">
            {(data.RRCStatisticData.RRCsetup.rrcconnectionsuccessrate.overall.ConnEstabAtt).toFixed(2)}%
          </h1>
          <h1 class="text-xs text-rose-400">
            {(data.RRCStatisticData.RRCsetup.rrcconnectionsuccessrate.by_band.failcount[0] + 
            data.RRCStatisticData.RRCsetup.rrcconnectionsuccessrate.by_band.failcount[1] +
            data.RRCStatisticData.RRCsetup.rrcconnectionsuccessrate.by_band.failcount[2]).toLocaleString()}
          </h1>
        </div>
        <div class="flex flex-col justify-center rounded-lg bg-slate-700/10 p-4">
          <h1 class="text-xs text-slate-500 mb-auto">2.3GHz</h1>
          <h1 class="text-2xl text-white font-bold">
            {(data.RRCStatisticData.RRCsetup.rrcconnectionsuccessrate.by_band.values[0]).toFixed(2)}%
          </h1>
          <h1 class="text-xs text-rose-400">
            {(data.RRCStatisticData.RRCsetup.rrcconnectionsuccessrate.by_band.failcount[0]).toLocaleString()}
          </h1>
        </div>
        <div class="flex flex-col justify-center rounded-lg bg-slate-700/10 p-4">
          <h1 class="text-xs text-slate-500 mb-auto">2.6GHz</h1>
          <h1 class="text-2xl text-white font-bold">
            {(data.RRCStatisticData.RRCsetup.rrcconnectionsuccessrate.by_band.values[1]).toFixed(2)}%
          </h1>
          <h1 class="text-xs text-rose-400">
            {(data.RRCStatisticData.RRCsetup.rrcconnectionsuccessrate.by_band.failcount[1]).toLocaleString()}
          </h1>
        </div>
        <div class="flex flex-col justify-center rounded-lg bg-slate-700/10 p-4">
          <h1 class="text-xs text-slate-500 mb-auto">800MHz</h1>
          <h1 class="text-2xl text-white font-bold">
            {(data.RRCStatisticData.RRCsetup.rrcconnectionsuccessrate.by_band.values[2]).toFixed(2)}%
          </h1>
          <h1 class="text-xs text-rose-400">
            {(data.RRCStatisticData.RRCsetup.rrcconnectionsuccessrate.by_band.failcount[2]).toLocaleString()}
          </h1>
        </div>
      </div>
    </div>
  </div>

  <!-- OVERALL TREND -->
  <div class="grid grid-cols-8 mb-4 gap-4">
    <!-- OVERALL RRC CONNECTION TREND -->
    <div class="flex flex-col col-span-2 rounded-md bg-slate-900/40">
      <div class="flex items-center gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">RRC SETUP WEEKLY TREND</h1>
      </div>
      <div class="flex">
        <OverallRrcConnTrend {OverallData}/>
      </div>
    </div>

    <!-- OVERALL RRC CONNECTION TREND BY BAND -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4">
      <div class="flex items-center mb-4 gap-1">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">WEEKLY TREND EACH BANDS</h1>
      </div>
      <OverallRrcConnTrendbyBand {OverallData}/>
    </div>

    <!-- OVERALL RRC CONNECTION TREND BY BAND -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4">
      <div class="flex items-center mb-4 gap-1">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">WEEKLY TREND EACH BANDS</h1>
      </div>
      <OverallRrcConnTrendbyBand {OverallData}/>
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
    <RegionalContent region={selectedRegiontab} {data}/>
    {:else if selectedRegiontab === 'Northern'}
    <RegionalContent region={selectedRegiontab} {data}/>
    {:else if selectedRegiontab === 'Southern'}
    <RegionalContent region={selectedRegiontab} {data}/>
    {:else if selectedRegiontab === 'Eastern'}
    <RegionalContent region={selectedRegiontab} {data}/>
    {:else if selectedRegiontab === 'Sabah'}
    <RegionalContent region={selectedRegiontab} {data}/>
    {:else if selectedRegiontab === 'Sarawak'}
    <RegionalContent region={selectedRegiontab} {data}/>
    {/if}
  </div>
</div>

<Toaster />