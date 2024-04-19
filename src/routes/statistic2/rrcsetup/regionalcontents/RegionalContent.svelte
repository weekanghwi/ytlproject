<script lang="ts">
	import { onMount } from "svelte";
  import Icon from '@iconify/svelte';
  import { trendDataStore, fetchTrendData } from "./FetchRRCData";

  import RegionalClusterTable from "../../components/RegionalClusterTable.svelte";
  import RegionalCellTable from "../../components/RegionalCellTable.svelte";
  import RegionalRrcAttemptbyBand from "../chart/RegionalRRCAttemptbyBand.svelte";
  import RegionalRrcAttemptFail23 from "../chart/RegionalRRCAttemptFail23.svelte";
  import RegionalRrcAttemptFail26 from "../chart/RegionalRRCAttemptFail26.svelte";
  import RegionalRrcAttemptFail800 from "../chart/RegionalRRCAttemptFail800.svelte";
  import RegionalRrcTrendbyBand from "../chart/RegionalRRCTrendbyBand.svelte";
  import RegionalFailCluster from "../chart/RegionalFailCluster.svelte";
  import RegionalFailSite from "../chart/RegionalFailSite.svelte";
  import RegionalFailCell from "../chart/RegionalFailCell.svelte";

  import FailClusterInfoModal from "../modal/FailClusterInfoModal.svelte";


  export let region: string;
  export let data: any;

  let field: string = 'rrc_setup_success_rate';
  let RRCSetupData: any = null;
  let band: string;

  $: RRCSetupData = $trendDataStore

  $: $trendDataStore, RRCSetupData = $trendDataStore

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


<!-- {#if $trendDataStore} -->
<div class="grid grid-cols-8 gap-4 w-full mb-4">
 
  <!-- REGIONAL RRC SETUP COUNT -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} RRC ATTACH COUNT</h1>
    </div>

    {#if RRCSetupData}
    <div class="flex flex-col items-center justify-center h-full">
      <div class="flex flex-col">
        <h1 class="text-2xl text-white font-bold">
          {(RRCSetupData.rrcattemptcoutbyband.overall.RRCAttempt).toLocaleString()}
        </h1>
        <h1 class="text-xs text-slate-500">
          {((RRCSetupData.rrcattemptcoutbyband.overall.RRCAttempt) / 7).toLocaleString()} (Per Day)
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-1">
      <div class="rounded-sm px-1 py-[1px] bg-green-500 text-xs">
        {(((RRCSetupData.rrcattemptcoutbyband.overall.RRCAttempt) / 
        (data.RRCStatisticData.RRCsetup.rrcattemptcoutbyband.overall.RRCAttempt)) * 100).toFixed(2)}%
      </div>
      <h1 class="text-xs text-slate-500">Share of the national RRC count</h1>
    </div>
    {/if}
  </div>

  <!-- REGIONAL RRC SETUP COUNT BY BAND CHART -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="iconamoon:category-light" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} RRC ATTACH BY BAND</h1>
    </div>
    <div class="flex items-center justify-center gap-4">
      <div class="relative flex">
        <RegionalRrcAttemptbyBand {RRCSetupData} />
        <div class="absolute flex flex-col items-center top-[40%] left-[22%]">
          <h1 class="text-xs text-white font-bold">RRC Attempt</h1>
          <h1 class="text-xs text-slate-500">Ratio by Band</h1>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        {#if RRCSetupData}
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-800"></div>
            <h1 class="text-xs text-white">2.3GHz</h1>
            <h1 class="text-xs text-slate-500 ms-auto">{($trendDataStore.rrcattemptcoutbyband.by_band.values[2]).toFixed(2)}%</h1>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">{($trendDataStore.rrcattemptcoutbyband.by_band.counts[2]).toLocaleString()}</h1>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-600"></div>
            <h1 class="text-xs text-white">2.6GHz</h1>
            <h1 class="text-xs text-slate-500 ms-auto">{($trendDataStore.rrcattemptcoutbyband.by_band.values[1]).toFixed(2)}%</h1>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">{($trendDataStore.rrcattemptcoutbyband.by_band.counts[1]).toLocaleString()}</h1>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-400"></div>
            <h1 class="text-xs text-white">800MHz</h1>
            <h1 class="text-xs text-slate-500 ms-auto">{($trendDataStore.rrcattemptcoutbyband.by_band.values[0]).toFixed(2)}%</h1>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">{($trendDataStore.rrcattemptcoutbyband.by_band.counts[0]).toLocaleString()}</h1>
        </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- REGIONAL RRC ATTEMPT FAIL BY BAND CHART -->
  <div class="flex flex-col col-span-4 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="material-symbols:sms-failed-outline-rounded" class="text-slate-500 text-lg "/>
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} RRC ATTEMPT FAIL COUNT BY BAND</h1>
    </div>
    <div class="flex items-center justify-center gap-8">
      <div class="relative flex">
        <RegionalRrcAttemptFail23 {RRCSetupData} />
        <div class="absolute top-[28%] left-[28%] flex flex-col items-center">
          <h1 class="text-xs text-white">2.3GHz</h1>
          {#if RRCSetupData}
          <h1 class="text-lg text-white font-bold">{($trendDataStore.rrcconnectionsuccessrate.by_band.failratio[0]).toFixed(2)}%</h1>
          <h1 class="text-xs text-slate-500">{($trendDataStore.rrcconnectionsuccessrate.by_band.failcount[0]).toLocaleString()}</h1>
          {/if}
        </div>
      </div>
      <div class="relative flex">
        <RegionalRrcAttemptFail26 {RRCSetupData} />
        <div class="absolute top-[28%] left-[28%] flex flex-col items-center">
          <h1 class="text-xs text-white">2.6GHz</h1>
          {#if RRCSetupData}
          <h1 class="text-lg text-white font-bold">{($trendDataStore.rrcconnectionsuccessrate.by_band.failratio[1]).toFixed(2)}%</h1>
          <h1 class="text-xs text-slate-500">{($trendDataStore.rrcconnectionsuccessrate.by_band.failcount[1]).toLocaleString()}</h1>
          {/if}
        </div>
      </div>
      <div class="relative flex">
        <RegionalRrcAttemptFail800 {RRCSetupData} />
        <div class="absolute top-[28%] left-[28%] flex flex-col items-center">
          <h1 class="text-xs text-white">800MHz</h1>
          {#if RRCSetupData}
          <h1 class="text-lg text-white font-bold">{($trendDataStore.rrcconnectionsuccessrate.by_band.failratio[2]).toFixed(2)}%</h1>
          <h1 class="text-xs text-slate-500">{($trendDataStore.rrcconnectionsuccessrate.by_band.failcount[2]).toLocaleString()}</h1>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- REGIONAL RRC SETUP SUCCESS TREND BY BAND -->
  <div class="flex flex-col col-span-3 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:data-trending-16-filled" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} TREND EACH BAND</h1>
    </div>
    <RegionalRrcTrendbyBand {RRCSetupData}/>
  </div>

  <!-- REGIONAL RRC SETUP FAIL CLUSTER COUNT -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1 mb-4">
      <Icon icon="fluent:data-trending-16-filled" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} FAIL CLUSTER COUNT</h1>
    </div>
    <div class="flex items-center justify-center gap-4">
      <div class="relative flex">
        <RegionalFailCluster {RRCSetupData} />
        <div class="absolute top-[33%] left-[31%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">Fail Total</h1>
          <h1 class="text-4xl text-white font-bold">
            {#if RRCSetupData}{RRCSetupData.fail_cluster_count_all}{/if}
          </h1>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        {#if RRCSetupData}
        <button class="flex items-center justify-between rounded-md bg-sky-800 p-2 w-full gap-4"
          on:click={() => {band = '2.3G'; field = field; region=region; FailClusterModal = true}}>
          <h1 class="text-xs text-white">2.3GHz</h1>
          <h1 class="w-5 h-5 rounded-full bg-rose-600 text-xs items-center justify-center flex">
              {#if RRCSetupData.fail_cluster_count_byband.band.includes('2.3G')}
                {RRCSetupData.fail_cluster_count_byband.count[RRCSetupData.fail_cluster_count_byband.band.indexOf('2.3G')]}
              {:else}
              -
              {/if}
          </h1>
        </button>
        {/if}
        <button class="flex items-center justify-between rounded-md bg-sky-600 p-2 w-full gap-4"
          on:click={() => {band = '2.6G'; field = field; region=region; FailClusterModal = true}}>
          <h1 class="text-xs text-white">2.6GHz</h1>
          <h1 class="w-5 h-5 rounded-full bg-rose-600 text-xs items-center justify-center flex">
            {#if RRCSetupData}
              {#if RRCSetupData.fail_cluster_count_byband.band.includes('2.6G')}
                {RRCSetupData.fail_cluster_count_byband.count[RRCSetupData.fail_cluster_count_byband.band.indexOf('2.6G')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </button>
        <button class="flex items-center justify-between rounded-md bg-sky-400 p-2 w-full gap-4"
          on:click={() => {band = '800M'; field = field; region=region; FailClusterModal = true}}>
          <h1 class="text-xs text-black">800MHz</h1>
          <h1 class="w-5 h-5 rounded-full bg-rose-600 text-xs text-black items-center justify-center flex">
            {#if RRCSetupData}
              {#if RRCSetupData.fail_cluster_count_byband.band.includes('800M')}
                {RRCSetupData.fail_cluster_count_byband.count[RRCSetupData.fail_cluster_count_byband.band.indexOf('800M')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </button>
      </div>
    </div>
  </div>

  <!-- REGIONAL RRC SETUP FAIL SITE & CELL COUNT -->
  <div class="flex flex-col col-span-3 bg-slate-900/40 rounded-md">
    <div class="flex items-center p-4 gap-1">
      <Icon icon="fluent:data-trending-16-filled" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} FAIL SITE & CELL COUNT</h1>
    </div>
    <div class="flex items-center justify-around px-4 mt-4">
      <div class="flex items-center gap-2">
        <div class="relative flex">
          <RegionalFailSite {RRCSetupData} />
          <div class="absolute top-[30%] left-[18%] flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-500">Fail Site Total</h1>
            <h1 class="text-2xl text-white font-bold">
              {#if RRCSetupData}{RRCSetupData.fail_site_count_all}{/if}
            </h1>
          </div>
        </div>
        <div class="relative flex">
          <RegionalFailCell {RRCSetupData} />
          <div class="absolute top-[30%] left-[18%] flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-500">Fail Cell Total</h1>
            <h1 class="text-2xl text-white font-bold">
              {#if RRCSetupData}{RRCSetupData.fail_cell_count_all}{/if}
            </h1>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-center gap-1">
          <div class="flex items-center justify-start gap-1 w-full">
            <div class="h-3 w-2 rounded-sm bg-sky-800"></div>
            <h1 class="text-xs text-white">2.3GHz</h1>
          </div>
          <div class="flex items-center justify-end w-full">
            <h1 class="text-xs text-black px-2 text-center rounded-sm bg-rose-200">
              {#if RRCSetupData}
                {#if RRCSetupData.fail_site_count_byband.band.includes('2.3GHz')}
                  {RRCSetupData.fail_site_count_byband.count[RRCSetupData.fail_site_count_byband.band.indexOf('2.3GHz')]}
                {:else}
                -
                {/if}
              {/if}
            </h1>
          </div>
          <div class="flex items-center justify-end w-full">
            <h1 class="text-xs text-black px-2 text-center rounded-sm bg-rose-200">
              {#if RRCSetupData}
                {#if RRCSetupData.fail_cell_count_byband.band.includes('2.3GHz')}
                  {RRCSetupData.fail_cell_count_byband.count[RRCSetupData.fail_cell_count_byband.band.indexOf('2.3GHz')]}
                {:else}
                -
                {/if}
              {/if}
            </h1>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2">
          <div class="flex items-center justify-start gap-1 w-full">
            <div class="h-3 w-2 rounded-sm bg-sky-600"></div>
            <h1 class="text-xs text-white">2.6GHz</h1>
          </div>
          <div class="flex items-center justify-end w-full">
            <h1 class="text-xs text-black px-2 text-center rounded-sm bg-rose-200">
              {#if RRCSetupData}
                {#if RRCSetupData.fail_site_count_byband.band.includes('2.6GHz')}
                  {RRCSetupData.fail_site_count_byband.count[RRCSetupData.fail_site_count_byband.band.indexOf('2.6GHz')]}
                {:else}
                -
                {/if}
              {/if}
            </h1>
          </div>
          <div class="flex items-center justify-end w-full">
            <h1 class="text-xs text-black px-2 text-center rounded-sm bg-rose-200">
              {#if RRCSetupData}
                {#if RRCSetupData.fail_cell_count_byband.band.includes('2.6GHz')}
                  {RRCSetupData.fail_cell_count_byband.count[RRCSetupData.fail_cell_count_byband.band.indexOf('2.6GHz')]}
                {:else}
                -
                {/if}
              {/if}
            </h1>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2">
          <div class="flex items-center justify-start gap-1 w-full">
            <div class="h-3 w-2 rounded-sm bg-sky-400"></div>
            <h1 class="text-xs text-white">800MHz</h1>
          </div>
          <div class="flex items-center justify-end w-full">
            <h1 class="text-xs text-black px-2 text-center rounded-sm bg-rose-200">
              {#if RRCSetupData}
                {#if RRCSetupData.fail_site_count_byband.band.includes('800M')}
                  {RRCSetupData.fail_site_count_byband.count[RRCSetupData.fail_site_count_byband.band.indexOf('800M')]}
                {:else}
                -
                {/if}
              {/if}
            </h1>
          </div>
          <div class="flex items-center justify-end w-full">
            <h1 class="text-xs text-black px-2 text-center rounded-sm bg-rose-200">
              {#if RRCSetupData}
                {#if RRCSetupData.fail_cell_count_byband.band.includes('800M')}
                  {RRCSetupData.fail_cell_count_byband.count[RRCSetupData.fail_cell_count_byband.band.indexOf('800M')]}
                {:else}
                -
                {/if}
              {/if}
            </h1>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- REGIONAL CLUSTER TABLE -->
  <div class="flex flex-col col-span-3 bg-slate-900/40 rounded-md">
    <div class="flex items-center p-4 gap-1">
      <Icon icon="carbon:assembly-cluster" class="text-slate-500"/>
      <h1 class="text-xs text-slate-500">RRC SETUP SUCCESS RATE CLUSTER</h1>
    </div>
    <RegionalClusterTable {region} {field} />
  </div>

  <!-- REGIONAL CELL TABLE -->
  <div class="flex flex-col col-span-5 bg-slate-900/40 rounded-md">
    <div class="flex items-center p-4 gap-1">
      <Icon icon="ic:baseline-cell-tower" class="text-slate-500"/>
      <h1 class="text-xs text-slate-500">RRC SETUP SUCCESS RATE CELL</h1>
    </div>
    <RegionalCellTable {region} {field} />
  </div>

</div>

<!-- CRUD Modal -->
<FailClusterInfoModal {band} {field} {region} bind:FailClusterModal={FailClusterModal} />