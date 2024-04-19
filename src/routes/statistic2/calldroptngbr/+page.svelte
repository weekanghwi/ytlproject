<script lang="ts">
  import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
	import { onMount } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast'

  import OverallCalldropCount from './chart/OverallCalldropCount.svelte';
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
      OverallData = data.CallDropnGBRStatisticData.CallDropnGBR;
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
        {data.CallDropnGBRStatisticData.CallDropnGBR.calldrop_trend_all.weeknums[9]} CALL DROP(nGBR) STATISTIC
      </p>
    </div>
    <h1 class="text-lg text-slate-200 font-semibold ms-1">OVERVIEW</h1>
  </div>

  <!-- OVERALL CONTENTS -->
  <!-- CALL DROP COUNT AND DISCRIPTION -->
  <div class="flex flex-col rounded-md bg-slate-900/40 p-4 mb-4 gap-4">
    <h1 class="text-xs text-slate-500">CALL DROP CALCULATION ITEMS AND DESCRIPTION</h1>
    <div class="flex gap-10">
      <!-- CALL DROP ITEMS -->
      <div class="flex flex-col rounded-md border border-slate-700 p-4">
        <div class="flex items-center mb-4 gap-2 ps-2">
          <h1 class="text-xs text-white font-bold">TYPE OF CALL DROP</h1>
          <h1 class="text-xs text-black rounded-sm bg-slate-500 px-2 py-[1px]">
            {(data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount).toLocaleString()}
          </h1>
        </div>
        <div class="flex gap-4">
          <div class="flex flex-col gap-1">
            <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-1">
              <h1 class="text-xs text-slate-400 hover:bg-rose-300 hover:text-black px-2">
                eccbdspauditrlcmaccallrelease
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(data.CallDropnGBRStatisticData.CallDropnGBR.eccbdspauditrlcmaccallrelease_byband.overall.eccbdspauditrlcmaccallrelease).toLocaleString()}
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(((data.CallDropnGBRStatisticData.CallDropnGBR.eccbdspauditrlcmaccallrelease_byband.overall.eccbdspauditrlcmaccallrelease) / (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(2)}%
              </h1>
            </div>
            <Tooltip placement="right" type="custom" class="text-xs font-normal text-black bg-rose-300 w-64">
              When a call is released since a mismatch occurs between the ECCB and MAC/RLC while performing an audit of the UE information after an INITIAL CONTEXT SETUP RESPONSE message about the UE which is transmitted to MME.
            </Tooltip>

            <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-1">
              <h1 class="text-xs text-slate-400 hover:bg-rose-300 hover:text-black px-2">
                eccbrcvresetrequestfromecmb
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(data.CallDropnGBRStatisticData.CallDropnGBR.eccbrcvresetrequestfromecmb_byband.overall.eccbrcvresetrequestfromecmb).toLocaleString()}
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(((data.CallDropnGBRStatisticData.CallDropnGBR.eccbrcvresetrequestfromecmb_byband.overall.eccbrcvresetrequestfromecmb) / (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(2)}%
              </h1>
            </div>
            <Tooltip placement="right" type="custom" class="text-xs font-normal text-black bg-rose-300 w-64">
              When a call is released due to ECMB reset after an INITIAL CONTEXT SETUP RESPONSE message about the UE which is transmitted to MME.
            </Tooltip>
            
            <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-1">
              <h1 class="text-xs text-slate-400 hover:bg-rose-300 hover:text-black px-2">
                eccbrcvcellreleaseindfromecmb
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(data.CallDropnGBRStatisticData.CallDropnGBR.eccbrcvcellreleaseindfromecmb_byband.overall.eccbrcvcellreleaseindfromecmb).toLocaleString()}
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(((data.CallDropnGBRStatisticData.CallDropnGBR.eccbrcvcellreleaseindfromecmb_byband.overall.eccbrcvcellreleaseindfromecmb) / (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(2)}%
              </h1>
            </div>
            <Tooltip placement="right" type="custom" class="text-xs font-normal text-black bg-rose-300 w-64">
              When a call is released as a result of being notified by the ECMB that the operational state of the cell (operationalState of RTRV-CELL-STS) is changed to disabled after an INITIAL CONTEXT SETUP RESPONSE message about the UE which is transmitted to MME.
            </Tooltip>

            <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-1">
              <h1 class="text-xs text-slate-400 hover:bg-rose-300 hover:text-black px-2">
                eccbradiolinkfailure
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(data.CallDropnGBRStatisticData.CallDropnGBR.eccbradiolinkfailure_byband.overall.eccbradiolinkfailure).toLocaleString()}
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(((data.CallDropnGBRStatisticData.CallDropnGBR.eccbradiolinkfailure_byband.overall.eccbradiolinkfailure) / (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(1)}%
              </h1>
            </div>
            <Tooltip placement="right" type="custom" class="text-xs font-normal text-black bg-rose-300 w-64">
              When a call is released as a result of not receiving HARQ ACK notification from the UE although the MAC transmitted messages to the UE equal to max retransmission after an INITIAL CONTEXT SETUP RESPONSE message about the UE which is transmitted to MME.
            </Tooltip>

            <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-1">
              <h1 class="text-xs text-slate-400 hover:bg-rose-300 hover:text-black px-2">
                eccbdspauditmaccallrelease
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(data.CallDropnGBRStatisticData.CallDropnGBR.eccbdspauditmaccallrelease_byband.overall.eccbdspauditmaccallrelease).toLocaleString()}
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(((data.CallDropnGBRStatisticData.CallDropnGBR.eccbdspauditmaccallrelease_byband.overall.eccbdspauditmaccallrelease) / (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(2)}%
              </h1>
            </div>
            <Tooltip placement="right" type="custom" class="text-xs font-normal text-black bg-rose-300 w-64">
              When a call is released since a mismatch occurs between the ECCB and MAC while performing an audit of the UE information after an INITIAL CONTEXT SETUP RESPONSE message about the UE which is transmitted to MME.
            </Tooltip>
          </div>

          <div class="flex flex-col gap-1">
            <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-1">
              <h1 class="text-xs text-slate-400 hover:bg-rose-300 hover:text-black px-2">
                eccbarqmaxretransmission
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(data.CallDropnGBRStatisticData.CallDropnGBR.eccbarqmaxretransmission_byband.overall.eccbarqmaxretransmission).toLocaleString()}
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(((data.CallDropnGBRStatisticData.CallDropnGBR.eccbarqmaxretransmission_byband.overall.eccbarqmaxretransmission) / (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(1)}%
              </h1>
            </div>
            <Tooltip placement="left" type="custom" class="text-xs font-normal text-black bg-rose-300 w-64">
              When a call is released as a result of not receiving ARQ ACK notification from the UE although the RLC transmitted messages to the UE equal to max retransmission after an INITIAL CONTEXT SETUP RESPONSE message about the UE which is transmitted to MME.
            </Tooltip>

            <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-1">
              <h1 class="text-xs text-slate-400 hover:bg-rose-300 hover:text-black px-2">
                eccbdspauditrlccallrelease
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(data.CallDropnGBRStatisticData.CallDropnGBR.eccbdspauditrlccallrelease_byband.overall.eccbdspauditrlccallrelease).toLocaleString()}
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(((data.CallDropnGBRStatisticData.CallDropnGBR.eccbdspauditrlccallrelease_byband.overall.eccbdspauditrlccallrelease) / (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(2)}%
              </h1>
            </div>
            <Tooltip placement="left" type="custom" class="text-xs font-normal text-black bg-rose-300 w-64">
              when a call is released since a mismatch occurs between the ECCB and RLC while performing an audit of the UE information after an INITIAL CONTEXT SETUP RESPONSE message about the UE which is transmitted to MME.
            </Tooltip>

            <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-1">
              <h1 class="text-xs text-slate-400 hover:bg-rose-300 hover:text-black px-2">
                eccbtmoutrrcconnectionreconfig
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(data.CallDropnGBRStatisticData.CallDropnGBR.eccbtmoutrrcconnectionreconfig_byband.overall.eccbtmoutrrcconnectionreconfig).toLocaleString()}
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(((data.CallDropnGBRStatisticData.CallDropnGBR.eccbtmoutrrcconnectionreconfig_byband.overall.eccbtmoutrrcconnectionreconfig) / (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(1)}%
              </h1>
            </div>
            <Tooltip placement="left" type="custom" class="text-xs font-normal text-black bg-rose-300 w-64">
              When a call is released due to a timeout that has occurred since RRCConnectionReconfigurationComplete is not received from the UE after an INITIAL CONTEXT SETUP RESPONSE message about the UE which is transmitted to MME.
            </Tooltip>

            <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-1">
              <h1 class="text-xs text-slate-400 hover:bg-rose-300 hover:text-black px-2">
                eccbtmoutrrcconnectionrestablish
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(data.CallDropnGBRStatisticData.CallDropnGBR.eccbtmoutrrcconnectionrestablish_byband.overall.eccbtmoutrrcconnectionrestablish).toLocaleString()}
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(((data.CallDropnGBRStatisticData.CallDropnGBR.eccbtmoutrrcconnectionrestablish_byband.overall.eccbtmoutrrcconnectionrestablish) / (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(2)}%
              </h1>
            </div>
            <Tooltip placement="left" type="custom" class="text-xs font-normal text-black bg-rose-300 w-64">
              When a call is released due to a timeout that has occurred since RRCConnectionRe-establishmentComplete is not received from the UE after an INITIAL CONTEXT SETUP RESPONSE message about the UE which is transmitted to MME.
            </Tooltip>

            <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-1">
              <h1 class="text-xs text-slate-400 hover:bg-rose-300 hover:text-black px-2">
                eccbsisctpoutofsevice
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(data.CallDropnGBRStatisticData.CallDropnGBR.eccbsisctpoutofsevice_byband.overall.eccbsisctpoutofsevice).toLocaleString()}
              </h1>
              <h1 class="text-xs text-black rounded-sm bg-slate-500 hover:bg-rose-300 px-2 py-[1px]">
                {(((data.CallDropnGBRStatisticData.CallDropnGBR.eccbsisctpoutofsevice_byband.overall.eccbsisctpoutofsevice) / (data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.overall.CallDropCount)) * 100).toFixed(2)}%
              </h1>
            </div>
            <Tooltip placement="left" type="custom" class="text-xs font-normal text-black bg-rose-300 w-64">
              The cumulated number of failures to perform the RRC connection reestablishment procedure due to a change of S1AP link status to 'Out of Service' after an INITIAL CONTEXT SETUP RESPONSE message about the UE which is transmitted to MME.
            </Tooltip>
          </div>
        </div>
      </div>

      <!-- CALL DROP COUNT BY BAND CHART -->
      <div class="flex items-center gap-4">
        <div class="relative flex">
          <OverallCalldropCount {OverallData} />
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
                  {(data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.by_band.ratio[0]).toFixed(2)}%
                </h1>
              </div>
            </div>
            <h1 class="text-xs text-slate-500 ps-4">
              {(data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.by_band.counts[0]).toLocaleString()}
            </h1>
          </div>
  
          <div class="flex flex-col">
            <div class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-sm bg-sky-600"></div>
              <div class="flex items-center gap-2">
                <h1 class="text-xs text-white">2.6GHz</h1>
                <h1 class="text-xs text-slate-500">
                  {(data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.by_band.ratio[1]).toFixed(2)}%
                </h1>
              </div>
            </div>
            <h1 class="text-xs text-slate-500 ps-4">
              {(data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.by_band.counts[1]).toLocaleString()}
            </h1>
          </div>
  
          <div class="flex flex-col">
            <div class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-sm bg-sky-400"></div>
              <div class="flex items-center gap-2">
                <h1 class="text-xs text-white">800MHz</h1>
                <h1 class="text-xs text-slate-500">
                  {(data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.by_band.ratio[2]).toFixed(2)}%
                </h1>
              </div>
            </div>
            <h1 class="text-xs text-slate-500 ps-4">
              {(data.CallDropnGBRStatisticData.CallDropnGBR.calldropcoutbyband.by_band.counts[2]).toLocaleString()}
            </h1>
          </div>
  
        </div>
      </div>
    </div>
  </div>

  <!-- OVRRALL TREND -->
  <div class="grid grid-cols-8 gap-4 mb-4">
    <!-- CALL DROP OVERLL TREND -->
    <div class="flex flex-col col-span-2 rounded-md bg-slate-900/40">
      <div class="relative flex items-center gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">CALL DROP WEEKLY TREND</h1>
        <div class="absolute top-10 left-5 flex items-center">
          <h1 class="text-2xl text-white font-bold">
            {(data.CallDropnGBRStatisticData.CallDropnGBR.calldrop_trend_all.values[9]).toFixed(2)}%
          </h1>
          <p class="{`text-xs ps-2 ${(data.CallDropnGBRStatisticData.CallDropnGBR.calldrop_trend_all.values[9] - data.CallDropnGBRStatisticData.CallDropnGBR.calldrop_trend_all.values[8]) < 0 ? 'text-rose-400' : 'text-green-400' }`}">
            {(data.CallDropnGBRStatisticData.CallDropnGBR.calldrop_trend_all.values[9] - data.CallDropnGBRStatisticData.CallDropnGBR.calldrop_trend_all.values[8]).toFixed(2)}
          </p>
          {#if (data.CallDropnGBRStatisticData.CallDropnGBR.calldrop_trend_all.values[9] - data.CallDropnGBRStatisticData.CallDropnGBR.calldrop_trend_all.values[8]) > 0}
          <Icon icon="iconamoon:trend-up-light" class="text-lg text-green-400 ms-1"/>
          {:else}
          <Icon icon="iconamoon:trend-down-light" class="text-lg text-rose-400 ms-1"/>
          {/if}
        </div>
      </div>
      <OverallCallDropTrend {OverallData} />
    </div>

    <!-- CALL DROP TREND BY BAND -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40">
      <div class="flex items-center mb-4 gap-1 p-4">
        <Icon icon="fluent:data-trending-16-filled" class="text-xl text-slate-400"/>
        <h1 class="text-xs text-slate-500">WEEKLY TREND EACH BANDS</h1>
      </div>
      <OverallCallDropbyBand {OverallData} />
    </div>

    <!-- CALL DROP OVERALL FAIL COUNT -->
    <div class="flex flex-col col-span-3 rounded-md bg-slate-900/40 p-4 gap-4">
      <div class="flex items-center gap-1">
        <Icon icon="icon-park-outline:folder-failed"  class="text-lg text-rose-500" />
        <h1 class="text-xs text-slate-500">WEEKLY FAIL CLUSTER & SITE</h1>
      </div>
      <div class="flex items-center justify-around gap-3">
        <div class="relative">
          <OverallCallDropCluster {OverallData} />
          <div class="absolute top-[35%] left-[25%] flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Fail cluster</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.CallDropnGBRStatisticData.CallDropnGBR.fail_cluster_count_all).toLocaleString()}
            </h1>
          </div>
        </div>
        <div class="relative">
          <OverallCallDropSite {OverallData} />
          <div class="absolute top-[35%] left-[12%] flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Call Drop Fail site</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.CallDropnGBRStatisticData.CallDropnGBR.fail_site_count_all).toLocaleString()}
            </h1>
          </div>
        </div>
        <div class="relative">
          <OverallCallDropCell {OverallData} />
          <div class="absolute top-[35%] left-[12%] flex flex-col items-center justify-center">
            <h1 class="text-xs text-slate-400">Call Drop Fail cell</h1>
            <h1 class="text-2xl text-white font-bold">
              {(data.CallDropnGBRStatisticData.CallDropnGBR.fail_cell_count_all).toLocaleString()}
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