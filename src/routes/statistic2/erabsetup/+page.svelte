<script lang="ts">
  import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast'

  import OverallAttemptRatio from './chart/OverallAttemptRatio.svelte';
  import OveralleRABTrend from './chart/OveralleRABTrend.svelte';
  import OveralleRABTrendbyBand from './chart/OveralleRABTrendbyBand.svelte';
  import OverallFailCluster from './chart/OverallFailCluster.svelte';
  import OverallFailSite from './chart/OverallFailSite.svelte';
  import OverallFailCell from './chart/OverallFailCell.svelte';
  import RegionalContent from './regionalcontents/RegionalContent.svelte'

  export let data;

  let OverallData: any = null;

  onMount(async () => {
    try {
      OverallData = data.eRABStatisticData.eRABsetup;
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
        {data.eRABStatisticData.eRABsetup.erabsetup_trend_all.weeknums[9]} eRAB SETUP STATISTIC
      </p>
    </div>
    <h1 class="text-lg text-slate-200 font-semibold ms-1">OVERVIEW</h1>
  </div>

  <!-- OVERALL CONTENTS -->
  <!-- eRAB CONNECTION COUNT AND SUCCESS OVERALL -->
  <div class="flex items-center justify-around rounded-md bg-slate-900/40 p-4 mb-4">

    <!-- OVERALL eRAB ATTEMPT COUNT BY ATTEMPT CATEGORY-->
    <div class="flex flex-col">
      <h1 class="text-xs text-slate-500 mb-4">eRAB Attempt Count</h1>
      <h1 class="text-2xl text-white font-bold">
        {(data.eRABStatisticData.eRABsetup.erabattemptcoutbyband.overall.eRABAttempt).toLocaleString()}
      </h1>
      <h1 class="text-xs text-slate-500 mb-3">
        {((data.eRABStatisticData.eRABsetup.erabattemptcoutbyband.overall.eRABAttempt) / 7).toLocaleString()} (Per Day)
      </h1>
    </div>

    <!-- EXPLAN ATTEMPT CATEGORY -->
    <div class="flex flex-col w-[30%] gap-3">
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h1 class="text-md text-white font-bold">EstablnitAttNbr</h1>
          <h1 class="text-xs text-slate-500">
            {(data.eRABStatisticData.eRABsetup.EstablnitAttNbr_byband.overall.EstablnitAttNbrAttempt).toLocaleString()}
          </h1>
          <h1 class="text-xs text-white px-2 py-[1px] rounded-sm bg-green-400">
            {(((data.eRABStatisticData.eRABsetup.EstablnitAttNbr_byband.overall.EstablnitAttNbrAttempt) / 
            (data.eRABStatisticData.eRABsetup.erabattemptcoutbyband.overall.eRABAttempt)) * 100).toFixed(2)}%
          </h1>
        </div>
        <h1 class="text-xs text-slate-500">
          When the eNB Received InitialContextSetupRequest (QCI5~9) message from the UE during E-RAB setup prossing. 
        </h1>
      </div>

      <hr class="border-1 border-slate-700">

      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h1 class="text-md text-white font-bold">EstabAddAttNbr</h1>
          <h1 class="text-xs text-slate-500">
            {(data.eRABStatisticData.eRABsetup.EstabAddAttNbr_byband.overall.EstabAddAttNbrAttempt).toLocaleString()}
          </h1>
          <h1 class="text-xs text-white px-2 py-[1px] rounded-sm bg-rose-400">
            {(((data.eRABStatisticData.eRABsetup.EstabAddAttNbr_byband.overall.EstabAddAttNbrAttempt) / 
            (data.eRABStatisticData.eRABsetup.erabattemptcoutbyband.overall.eRABAttempt)) * 100).toFixed(2)}%
          </h1>
        </div>
        <h1 class="text-xs text-slate-500">
          When the eNB Received ErabSetupRequest (QCI5~9) message from the UE during E-RAB setup prossing. 
        </h1>
      </div>
    </div>

    <!-- OVERAL eRAB ATTEMPT RATIO BY BAND -->
    <div class="flex items-center gap-4">
      <div class="relative flex">
        <OverallAttemptRatio {OverallData} />
        <div class="absolute top-[38%] left-[18%] flex flex-col items-center">
          <h1 class="text-sm text-white">eRAB Attempt</h1>
          <h1 class="text-xs text-slate-500">Ratio by band</h1>
        </div>
      </div>
      <div class="flex flex-col justify-center gap-2">
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-800"></div>
            <div class="flex items-center gap-2">
              <h1 class="text-xs text-white">2.3GHz</h1>
              <h1 class="text-xs text-slate-500">
                {(data.eRABStatisticData.eRABsetup.erabattemptcoutbyband.by_band.ratio[0]).toFixed(2)}%
              </h1>
            </div>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">
            {(data.eRABStatisticData.eRABsetup.erabattemptcoutbyband.by_band.counts[0]).toLocaleString()}
          </h1>
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-600"></div>
            <div class="flex items-center gap-2">
              <h1 class="text-xs text-white">2.6GHz</h1>
              <h1 class="text-xs text-slate-500">
                {(data.eRABStatisticData.eRABsetup.erabattemptcoutbyband.by_band.ratio[1]).toFixed(2)}%
              </h1>
            </div>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">
            {(data.eRABStatisticData.eRABsetup.erabattemptcoutbyband.by_band.counts[1]).toLocaleString()}
          </h1>
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-400"></div>
            <div class="flex items-center gap-2">
              <h1 class="text-xs text-white">800MHz</h1>
              <h1 class="text-xs text-slate-500">
                {(data.eRABStatisticData.eRABsetup.erabattemptcoutbyband.by_band.ratio[2]).toFixed(2)}%
              </h1>
            </div>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">
            {(data.eRABStatisticData.eRABsetup.erabattemptcoutbyband.by_band.counts[2]).toLocaleString()}
          </h1>
        </div>

      </div>
    </div>
  </div>

  <!-- OVRRALL TREND -->
  <div class="grid grid-cols-8 gap-4 mb-4">
    <!-- eRAB SETUP OVERLL TREND -->
    <div class="flex flex-col col-span-2 rounded-md bg-slate-900/40">
      <div class="relative flex items-center gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">eRAB SETUP WEEKLY TREND</h1>
        <div class="absolute top-10 left-5 flex items-center">
          <h1 class="text-2xl text-white font-bold">
            {(data.eRABStatisticData.eRABsetup.erabsetup_trend_all.values[9]).toFixed(2)}%
          </h1>
          <p class="{`text-xs ps-2 ${(data.eRABStatisticData.eRABsetup.erabsetup_trend_all.values[9] - data.eRABStatisticData.eRABsetup.erabsetup_trend_all.values[8]) < 0 ? 'text-rose-400' : 'text-green-400' }`}">
            {(data.eRABStatisticData.eRABsetup.erabsetup_trend_all.values[9] - data.eRABStatisticData.eRABsetup.erabsetup_trend_all.values[8]).toFixed(2)}
          </p>
          {#if (data.eRABStatisticData.eRABsetup.erabsetup_trend_all.values[9] - data.eRABStatisticData.eRABsetup.erabsetup_trend_all.values[8]) > 0}
          <Icon icon="iconamoon:trend-up-light" class="text-lg text-green-400 ms-1"/>
          {:else}
          <Icon icon="iconamoon:trend-down-light" class="text-lg text-rose-400 ms-1"/>
          {/if}
        </div>
      </div>
      <OveralleRABTrend {OverallData} />
    </div>

    <!-- eRAB SETUP OVER TREND BY BAND -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40">
      <div class="flex items-center mb-4 gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">WEEKLY TREND EACH BANDS</h1>
      </div>
      <OveralleRABTrendbyBand {OverallData} />
    </div>

    <!-- eRAB OVERALL FAIL COUNT -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4 gap-4">
      <div class="flex items-center gap-1">
        <Icon icon="icon-park-outline:folder-failed"  class="text-lg text-rose-500" />
        <h1 class="text-xs text-slate-500">WEEKLY FAIL CLUSTER & SITE</h1>
      </div>
      <div class="flex items-center justify-around gap-3">
        <div class="relative">
          <OverallFailCluster {OverallData} />
          <div class="absolute top-[35%] left-[27%] flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail cluster</h1>
            <h1 class="text-2xl text-white font-bold">
              {data.eRABStatisticData.eRABsetup.fail_cluster_count_all}
            </h1>
          </div>
        </div>
        <div class="relative">
          <OverallFailSite {OverallData} />
          <div class="absolute top-[35%] left-[35%] flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail site</h1>
            <h1 class="text-2xl text-white font-bold">
              {data.eRABStatisticData.eRABsetup.fail_site_count_all}
            </h1>
          </div>
        </div>
        <div class="relative">
          <OverallFailCell {OverallData} />
          <div class="absolute top-[35%] left-[35%] flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail cell</h1>
            <h1 class="text-2xl text-white font-bold">
              {data.eRABStatisticData.eRABsetup.fail_cell_count_all}
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