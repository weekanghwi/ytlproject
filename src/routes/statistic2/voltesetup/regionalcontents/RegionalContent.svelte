<script lang="ts">
  import { onMount } from "svelte";
  import Icon from '@iconify/svelte';
  import { trendDataStore, fetchTrendData } from "./FetchVoLTEData";

  import RegionalClusterTable from "../../components/RegionalClusterTable.svelte";
  import RegionalCellTable from "../../components/RegionalCellTable.svelte";
  import RegionalAttemptRatio from "../chart/RegionalAttemptRatio.svelte";
  import RegionalAttemptFailCount23 from "../chart/RegionalAttemptFailCount23.svelte";
  import RegionalAttemptFailCount26 from "../chart/RegionalAttemptFailCount26.svelte";
  import RegionalAttemptFailCount800 from "../chart/RegionalAttemptFailCount800.svelte";
  import RegionalTrendbyBand from "../chart/RegionalTrendbyBand.svelte";
  import RegionalAttemptFailCluster from "../chart/RegionalAttemptFailCluster.svelte";
  import RegionalAttemptFailSiteCell from "../chart/RegionalAttemptFailSiteCell.svelte";
  import FailClusterInfoModal from "../../components/FailClusterInfoModal.svelte";

  export let region: string;
  export let data: any;

  let field: string = 'volte_setup_success_rate_gbr';
  let VoLTESetupData: any = null;
  let band: string;

  $: VoLTESetupData = $trendDataStore

  $: $trendDataStore, VoLTESetupData = $trendDataStore

  $: if (region) {
    (region);
  }

  onMount(async () => {
    if (!region) {
      region = 'Central';
    }
    fetchTrendData(region);
  })

  // MODAL VARIABLE
  let FailClusterModal = false
</script>

<div class="grid grid-cols-8 gap-4 w-full mb-4">
  <!-- REGIONAL VoLTE ATTACH COUNT -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} VoLTE ATTACH COUNT</h1>
    </div>

    {#if VoLTESetupData}
    <div class="flex flex-col items-center justify-center h-full">
      <div class="flex flex-col">
        <h1 class="text-2xl text-white font-bold">
          {(VoLTESetupData.volteattemptcoutbyband.overall.VoLTEAttempt).toLocaleString()}
        </h1>
        <h1 class="text-xs text-slate-500">
          {((VoLTESetupData.volteattemptcoutbyband.overall.VoLTEAttempt) / 7).toLocaleString()} (Per Day)
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-1">
      <div class="rounded-sm px-1 py-[1px] bg-green-500 text-xs">
        {(((VoLTESetupData.volteattemptcoutbyband.overall.VoLTEAttempt) / 
        (data.VoLTEStatisticData.VoLTEsetup.volteattemptcoutbyband.overall.VoLTEAttempt)) * 100).toFixed(2)}%
      </div>
      <h1 class="text-xs text-slate-500">Share of the national eRAB count</h1>
    </div>
    {/if}

  </div>

  <!-- REGIONAL VoLTE ATTACH COUNT BY BAND -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4 gap-4">
    <div class="flex items-center gap-1">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} VoLTE ATTEMPT COUNT BY BAND</h1>
    </div>
    <div class="flex items-center gap-4">
      <div class="relative flex items-center justify-center">
        <RegionalAttemptRatio {VoLTESetupData} />
        <div class="absolute top-[30%] left-[15%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()}</h1>
          <h1 class="text-sm text-white font-bold">eRAB Attempt</h1>
          <h1 class="text-xs text-slate-500">Ratio by band</h1>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-800"></div>
            <h1 class="text-xs text-white">2.3GHz</h1>
            <h1 class="text-xs text-slate-500">
              {#if VoLTESetupData}
                {(VoLTESetupData.volteattemptcoutbyband.by_band.ratio[2]).toFixed(2)}%
              {/if}
            </h1>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">
            {#if VoLTESetupData}
                {(VoLTESetupData.volteattemptcoutbyband.by_band.counts[2]).toLocaleString()}
              {/if}
          </h1>
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-600"></div>
            <h1 class="text-xs text-white">2.6GHz</h1>
            <h1 class="text-xs text-slate-500">
              {#if VoLTESetupData}
                {(VoLTESetupData.volteattemptcoutbyband.by_band.ratio[1]).toFixed(2)}%
              {/if}
            </h1>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">
            {#if VoLTESetupData}
                {(VoLTESetupData.volteattemptcoutbyband.by_band.counts[1]).toLocaleString()}
              {/if}
          </h1>
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-400"></div>
            <h1 class="text-xs text-white">800MHz</h1>
            <h1 class="text-xs text-slate-500">
              {#if VoLTESetupData}
                {(VoLTESetupData.volteattemptcoutbyband.by_band.ratio[0]).toFixed(2)}%
              {/if}
            </h1>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">
            {#if VoLTESetupData}
                {(VoLTESetupData.volteattemptcoutbyband.by_band.counts[0]).toLocaleString()}
              {/if}
          </h1>
        </div>
      </div>
    </div>
  </div>

  <!-- REGIONAL VoLTE ATTACH FAIL BY BAND -->
  <div class="flex flex-col col-span-4 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} VoLTE ATTACH FAIL COUNT BY BAND</h1>
    </div>
    <div class="flex items-center justify-around">
      <div class="relative flex">
        <RegionalAttemptFailCount23 {VoLTESetupData} />
        <div class="absolute top-[25%] left-[20%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">2.3GHz</h1>
          <h1 class="text-2xl text-white font-bold">
            {#if VoLTESetupData}
              {(VoLTESetupData.voltefailandsuccessbybandall.by_band.failratebyband[0]).toFixed(2)}%
            {/if}
          </h1>
          <h1 class="text-xs text-slate-500">
            {#if VoLTESetupData}
              {(VoLTESetupData.voltefailandsuccessbybandall.by_band.failcount[0]).toLocaleString()}
            {/if}
          </h1>
        </div>
      </div>
      <div class="relative flex text-sky-600">
        <RegionalAttemptFailCount26 {VoLTESetupData} />
        <div class="absolute top-[25%] left-[20%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">2.6GHz</h1>
          <h1 class="text-2xl text-white font-bold">
            {#if VoLTESetupData}
              {(VoLTESetupData.voltefailandsuccessbybandall.by_band.failratebyband[1]).toFixed(2)}%
            {/if}
          </h1>
          <h1 class="text-xs text-slate-500">
            {#if VoLTESetupData}
              {(VoLTESetupData.voltefailandsuccessbybandall.by_band.failcount[1]).toLocaleString()}
            {/if}
          </h1>
        </div>
      </div>
      <div class="relative flex">
        <RegionalAttemptFailCount800 {VoLTESetupData} />
        <div class="absolute top-[25%] left-[20%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">800M</h1>
          <h1 class="text-2xl text-white font-bold">
            {#if VoLTESetupData}
              {(VoLTESetupData.voltefailandsuccessbybandall.by_band.failratebyband[2]).toFixed(2)}%
            {/if}
          </h1>
          <h1 class="text-xs text-slate-500">
            {#if VoLTESetupData}
              {(VoLTESetupData.voltefailandsuccessbybandall.by_band.failcount[2]).toLocaleString()}
            {/if}
          </h1>
        </div>
      </div>
    </div>

  </div>

  <!-- REGIONAL VoLTE TREND BY BAND -->
  <div class="flex flex-col col-span-3 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} VoLTE SETUP SUCCESS TREND BY BAND</h1>
    </div>
    <RegionalTrendbyBand {VoLTESetupData} />
  </div>

  <!-- REGIONAL VoLTE FAIL CLUSTER -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} VoLTE SETUP FAIL CLUSTER</h1>
    </div>
    <div class="flex items-center justify-around">
      <div class="relative flex">
        <RegionalAttemptFailCluster {VoLTESetupData} />
        <div class="absolute top-[35%] left-[28%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">Fail Cluster</h1>
          <h1 class="text-2xl text-white font-bold">
            {#if VoLTESetupData}{VoLTESetupData.fail_cluster_count_all}{/if}
          </h1>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex">
          <button class="flex items-center justify-between rounded-md bg-sky-800 px-2 py-2 gap-4 w-full"
            on:click={() => {band = '2.3G'; field = field; region=region; FailClusterModal = true}}>
            <h1 class="text-xs text-white">2.3G</h1>
            <div class="h-4 w-4 rounded-full bg-rose-400 text-xs flex items-center justify-center">
              {#if VoLTESetupData}
                {#if VoLTESetupData.fail_cluster_count_byband.band.includes('2.3G')}
                  {VoLTESetupData.fail_cluster_count_byband.count[VoLTESetupData.fail_cluster_count_byband.band.indexOf('2.3G')]}
                {:else}
                -
                {/if}
              {/if}
            </div>
          </button>
        </div>
        <div class="flex">
          <button class="flex items-center justify-between rounded-md bg-sky-600 px-2 py-2 gap-4 w-full"
            on:click={() => {band = '2.6G'; field = field; region=region; FailClusterModal = true}}>
            <h1 class="text-xs text-white">2.6G</h1>
            <div class="h-4 w-4 rounded-full bg-rose-400 text-xs flex items-center justify-center">
              {#if VoLTESetupData}
                {#if VoLTESetupData.fail_cluster_count_byband.band.includes('2.6G')}
                  {VoLTESetupData.fail_cluster_count_byband.count[VoLTESetupData.fail_cluster_count_byband.band.indexOf('2.6G')]}
                {:else}
                -
                {/if}
              {/if}
            </div>
          </button>
        </div>
        <div class="flex">
          <button class="flex items-center justify-between rounded-md bg-sky-400 px-2 py-2 gap-4 w-full"
            on:click={() => {band = '800M'; field = field; region=region; FailClusterModal = true}}>
            <h1 class="text-xs text-black">800M</h1>
            <div class="h-4 w-4 rounded-full bg-rose-400 text-xs flex items-center justify-center">
              {#if VoLTESetupData}
                {#if VoLTESetupData.fail_cluster_count_byband.band.includes('800M')}
                  {VoLTESetupData.fail_cluster_count_byband.count[VoLTESetupData.fail_cluster_count_byband.band.indexOf('800M')]}
                {:else}
                -
                {/if}
              {/if}
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- REGIONAL VoLTE FAIL SITE & CELL -->
  <div class="flex flex-col col-span-3 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} VoLTE SETUP FAIL SITE & CELL</h1>
    </div>
    <div class="flex items-center justify-around">
      <div class="relative flex">
        <RegionalAttemptFailSiteCell {VoLTESetupData} />
        <div class="absolute top-[35%] left-[25%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">Site / Cell Fail</h1>
          <h1 class="text-lg text-white font-bold">
            {#if VoLTESetupData}
              {VoLTESetupData.fail_site_count_all}/{VoLTESetupData.fail_cell_count_all}
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
            {#if VoLTESetupData}
              {#if VoLTESetupData.fail_site_count_byband.band.includes('2.3GHz')}
                {VoLTESetupData.fail_site_count_byband.count[VoLTESetupData.fail_site_count_byband.band.indexOf('2.3GHz')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if VoLTESetupData}
              {#if VoLTESetupData.fail_cell_count_byband.band.includes('2.3GHz')}
                {VoLTESetupData.fail_cell_count_byband.count[VoLTESetupData.fail_site_count_byband.band.indexOf('2.3GHz')]}
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
            {#if VoLTESetupData}
              {#if VoLTESetupData.fail_site_count_byband.band.includes('2.6GHz')}
                {VoLTESetupData.fail_site_count_byband.count[VoLTESetupData.fail_site_count_byband.band.indexOf('2.6GHz')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if VoLTESetupData}
              {#if VoLTESetupData.fail_cell_count_byband.band.includes('2.6GHz')}
                {VoLTESetupData.fail_cell_count_byband.count[VoLTESetupData.fail_site_count_byband.band.indexOf('2.6GHz')]}
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
            {#if VoLTESetupData}
              {#if VoLTESetupData.fail_site_count_byband.band.includes('800M')}
                {VoLTESetupData.fail_site_count_byband.count[VoLTESetupData.fail_site_count_byband.band.indexOf('800M')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if VoLTESetupData}
              {#if VoLTESetupData.fail_cell_count_byband.band.includes('800M')}
                {VoLTESetupData.fail_cell_count_byband.count[VoLTESetupData.fail_site_count_byband.band.indexOf('800M')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
      </div>
    </div>
  </div>

  <!-- REGIONAL CLUSTER TABLE -->
  <div class="flex flex-col col-span-3 bg-slate-900/40 rounded-md">
    <div class="flex items-center p-4 gap-1">
      <Icon icon="carbon:assembly-cluster" class="text-slate-500"/>
      <h1 class="text-xs text-slate-500">VoLTE SETUP SUCCESS RATE CLUSTER</h1>
    </div>
    <RegionalClusterTable {region} {field} />
  </div>

  <!-- REGIONAL CELL TABLE -->
  <div class="flex flex-col col-span-5 bg-slate-900/40 rounded-md">
    <div class="flex items-center p-4 gap-1">
      <Icon icon="ic:baseline-cell-tower" class="text-slate-500"/>
      <h1 class="text-xs text-slate-500">VoLTE SETUP SUCCESS RATE CELL</h1>
    </div>
    <RegionalCellTable {region} {field} />
  </div>

</div>
<FailClusterInfoModal {band} {field} {region} bind:FailClusterModal={FailClusterModal} />