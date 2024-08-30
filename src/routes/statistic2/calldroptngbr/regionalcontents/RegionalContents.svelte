<script lang="ts">
  import { onMount } from "svelte";
  import Icon from '@iconify/svelte';
  import { trendDataStore, fetchTrendData } from "./FetchCallDropData";
	import { Tooltip } from "flowbite-svelte";

  import RegionalCallDropRatio from "../chart/RegionalCallDropRatio.svelte";
  import RegionalTrendbyBand from "../chart/RegionalTrendbyBand.svelte";
  import RegionalCallDropFailCluster from "../chart/RegionalCallDropFailCluster.svelte";
  import RegionalCallDropFailSiteCell from "../chart/RegionalCallDropFailSiteCell.svelte";
  import RegionalClusterTable from "../../components/RegionalClusterTable.svelte";
  import RegionalCellTable from "../../components/RegionalCellTable.svelte";
  import FailClusterInfoModal from "../../components/FailClusterInfoModal.svelte";

  export let region: string;
  export let data: any;

  let field: string = 'call_drop_rate_erab_ngbr';
  let CallDropnGBRData: any = null;
  let band: string;

  $: CallDropnGBRData = $trendDataStore
  $: $trendDataStore, CallDropnGBRData = $trendDataStore
  $: if (region) {
    (region);
  }

  onMount(async () => {
    if (!region) {
      region = 'Central';
    }
    fetchTrendData(region);
  })

  const calldropCountChartKeyMap: { [key: string]: string} = {
    'calldropcoutbyband': 'Total',
    'eccbdspauditrlcmaccallrelease_byband': 'Mismatch UE Info',
    'eccbrcvresetrequestfromecmb_byband': 'ECMB Reset',
    'eccbrcvcellreleaseindfromecmb_byband': 'ECMB State Change',
    'eccbradiolinkfailure_byband': 'Radio Link Failure',
    'eccbdspauditmaccallrelease_byband': 'Mismatch Info MAC and ECCB',
    'eccbarqmaxretransmission_byband': 'Max ReTrensmission',
    'eccbdspauditrlccallrelease_byband': 'Mismatch Info RLC and ECCB',
    'eccbtmoutrrcconnectionreconfig_byband': 'Time Out RRC Reconfig',
    'eccbtmoutrrcconnectionrestablish_byband': 'Time Out RRC Reeasta',
    'eccbsisctpoutofsevice_byband': 'Out Of Service'
  };

  const chartKeys = Object.keys(calldropCountChartKeyMap);
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
  $: selectedData = getSelectedData(CallDropnGBRData, selectedChartKey)
  $: FailClusterCount = 'fail_cluster_count_byband';
</script>

<div class="grid grid-cols-8 gap-4 w-full mb-4">
  <!-- REGIONAL CALL DROP COUNT -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4">
    <div class="flex items-center gap-1">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()} CALL DROP COUNT</h1>
    </div>

    {#if CallDropnGBRData}
    <div class="flex flex-col items-center justify-center h-full">
      <div class="flex flex-col">
        <h1 class="text-2xl text-white font-bold">
          {(CallDropnGBRData.calldropcoutbyband.overall.CallDropCount).toLocaleString()}
        </h1>
        <h1 class="text-xs text-slate-500">
          {((CallDropnGBRData.calldropcoutbyband.overall.CallDropCount) / 7).toLocaleString()} (Per Day)
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-1">
      <div class="rounded-sm px-1 py-[1px] bg-green-500 text-xs">
        {(((CallDropnGBRData.calldropcoutbyband.overall.CallDropCount) / 
        (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(2)}%
      </div>
      <h1 class="text-xs text-slate-500">Share of the national Call Drop count</h1>
    </div>
    {/if}

  </div>

  <!-- REGIONAL CALL DROP COUNT BY BAND -->
  <div class="flex flex-col col-span-2 bg-slate-900/40 rounded-md p-4 gap-4">
    <div class="flex items-start gap-1">
      <Icon icon="fluent:calendar-week-numbers-24-regular" class="text-lg text-slate-500" />
      <div class="flex flex-col">
        <h1 class="text-xs text-slate-500">CALL DROP COUNT BY BAND</h1>
        <h1 class="text-[10px] text-rose-400">{calldropCountChartKeyMap[selectedChartKey]}</h1>
      </div>
      <button class="ms-auto flex items-center gap-2 text-gray-800 rounded-md"
        on:click={() => (showDropdown = !showDropdown)}>
        <!-- {calldropCountChartKeyMap[selectedChartKey]} -->
        <Icon icon="tabler:dots-vertical" class="text-lg text-white" />
      </button>
      {#if showDropdown}
        <div class="absolute flex flex-col z-10 bg-slate-700/90 shadow-md rounded-md mt-2">
          {#each chartKeys as key}
          <button class="text-xs text-left text-slate-100 py-1 px-2 hover:bg-rose-400/50"
          on:click={() => {selectedChartKey = key; showDropdown = false}}>
            {calldropCountChartKeyMap[key]}
          </button>
          {/each}
        </div>
      {/if}
    </div>
    <div class="flex items-center gap-4">
      <div class="relative flex items-center justify-center">
        <RegionalCallDropRatio {CallDropnGBRData} chartKey={selectedChartKey} />
        <div class="absolute top-[30%] left-[22%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">{region.toLocaleUpperCase()}</h1>
          <h1 class="text-sm text-white font-bold">Call Drop</h1>
          <h1 class="text-xs text-slate-500">Ratio by band</h1>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-800"></div>
            <h1 class="text-xs text-white">2.3GHz</h1>
            <h1 class="text-xs text-slate-500">
              {#if selectedData  && selectedData.ratio && selectedData.ratio[0] !== undefined}
                {(selectedData.ratio[0]).toFixed(2)}%
              {/if}
            </h1>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">
            {#if selectedData  && selectedData.ratio && selectedData.ratio[0] !== undefined}
              {(selectedData.counts[0]).toLocaleString()}
            {/if}
          </h1>
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-600"></div>
            <h1 class="text-xs text-white">2.6GHz</h1>
            <h1 class="text-xs text-slate-500">
              {#if selectedData && selectedData.ratio && selectedData.ratio[1] !== undefined}
                {(selectedData.ratio[1]).toFixed(2)}%
              {/if}
            </h1>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">
            {#if selectedData  && selectedData.ratio && selectedData.ratio[1] !== undefined}
              {(selectedData.counts[1]).toLocaleString()}
            {/if}
          </h1>
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <div class="h-3 w-3 rounded-sm bg-sky-400"></div>
            <h1 class="text-xs text-white">800MHz</h1>
            <h1 class="text-xs text-slate-500">
              {#if selectedData  && selectedData.ratio && selectedData.ratio[2] !== undefined}
                {(selectedData.ratio[2]).toFixed(2)}%
              {/if}
            </h1>
          </div>
          <h1 class="text-xs text-slate-500 ps-4">
            {#if selectedData  && selectedData.ratio && selectedData.ratio[2] !== undefined}
              {(selectedData.counts[2]).toLocaleString()}
            {/if}
          </h1>
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
      <RegionalTrendbyBand {CallDropnGBRData} />
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
        <RegionalCallDropFailCluster {CallDropnGBRData} />
        <div class="absolute top-[35%] left-[28%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">Fail Cluster</h1>
          <h1 class="text-2xl text-white font-bold">
            {#if CallDropnGBRData}{CallDropnGBRData.fail_cluster_count_all}{/if}
          </h1>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <div class="flex flex-col gap-4">
            {#if CallDropnGBRData && CallDropnGBRData[FailClusterCount]}
              {#each CallDropnGBRData[FailClusterCount].band as bands, index}
                <div class="flex items-center">
                  <button class="flex items-center justify-between p-2 gap-2 text-xs text-white w-full rounded-md 
                    {bands === '2.3G' ? 'bg-sky-800' : 
                    bands === '2.6G' ? 'bg-sky-600' : 'bg-sky-400'}"
                    on:click={() => {band = bands; field = field; region=region; FailClusterModal = true}}>
                    {bands}
                    <h1 class="text-xs text-black w-4 h-4 rounded-full bg-rose-300">
                      {CallDropnGBRData[FailClusterCount].count[index]}
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
        <RegionalCallDropFailSiteCell {CallDropnGBRData} />
        <div class="absolute top-[35%] left-[25%] flex flex-col items-center justify-center">
          <h1 class="text-xs text-slate-500">Site / Cell Fail</h1>
          <h1 class="text-lg text-white font-bold">
            {#if CallDropnGBRData}
              {CallDropnGBRData.fail_site_count_all}/{CallDropnGBRData.fail_cell_count_all}
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
            {#if CallDropnGBRData}
              {#if CallDropnGBRData.fail_site_count_byband.band.includes('2.3GHz')}
                {CallDropnGBRData.fail_site_count_byband.count[CallDropnGBRData.fail_site_count_byband.band.indexOf('2.3GHz')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if CallDropnGBRData}
              {#if CallDropnGBRData.fail_cell_count_byband.band.includes('2.3GHz')}
                {CallDropnGBRData.fail_cell_count_byband.count[CallDropnGBRData.fail_site_count_byband.band.indexOf('2.3GHz')]}
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
            {#if CallDropnGBRData}
              {#if CallDropnGBRData.fail_site_count_byband.band.includes('2.6GHz')}
                {CallDropnGBRData.fail_site_count_byband.count[CallDropnGBRData.fail_site_count_byband.band.indexOf('2.6GHz')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if CallDropnGBRData}
              {#if CallDropnGBRData.fail_cell_count_byband.band.includes('2.6GHz')}
                {CallDropnGBRData.fail_cell_count_byband.count[CallDropnGBRData.fail_site_count_byband.band.indexOf('2.6GHz')]}
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
            {#if CallDropnGBRData}
              {#if CallDropnGBRData.fail_site_count_byband.band.includes('800M')}
                {CallDropnGBRData.fail_site_count_byband.count[CallDropnGBRData.fail_site_count_byband.band.indexOf('800M')]}
              {:else}
              -
              {/if}
            {/if}
          </h1>
        </div>
        <div class="flex items-center justify-center w-full px-1 py-[1px] rounded-sm bg-rose-400">
          <h1 class="text-xs text-white">
            {#if CallDropnGBRData}
              {#if CallDropnGBRData.fail_cell_count_byband.band.includes('800M')}
                {CallDropnGBRData.fail_cell_count_byband.count[CallDropnGBRData.fail_site_count_byband.band.indexOf('800M')]}
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
          {#if CallDropnGBRData && CallDropnGBRData[topImpactClusterListKey]}
            {#each Object.entries(CallDropnGBRData[topImpactClusterListKey]) as [band, data]}
              {#each data.cluster as cluster, index}
                <tr class="text-xs text-slate-300 py-2">
                  <td class="py-1 px-4">{cluster}</td>
                  <td class="py-1 px-4">{(data.calldroptotal[index]).toLocaleString()}</td>
                  <td class="py-1 px-4">{((((data.calldroptotal[index]) / CallDropnGBRData.calldropbybandall.by_band.failcount[2])) * 100).toFixed(2)}%</td>
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
      <h1 class="text-xs text-slate-500">CALL DROP RATE CLUSTER</h1>
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