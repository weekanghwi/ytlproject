<script lang="ts">
  import { Modal, TabItem, Tabs} from "flowbite-svelte";
  import Icon from '@iconify/svelte';
  import toast, { Toaster } from 'svelte-french-toast';
	import { onMount } from "svelte";

  import SiteCount from "./ClusterModalChart/SiteCount.svelte";
  import CellCount from "./ClusterModalChart/CellCount.svelte";
  import ActiveUser from "./ClusterModalChart/ActiveUser.svelte";
  import ActiveUserSum from "./ClusterModalChart/ActiveUserSum.svelte";
  import ActiveUserMaxavg from "./ClusterModalChart/ActiveUserMaxavg.svelte";
  import ActiveUserMaxsum from "./ClusterModalChart/ActiveUserMaxsum.svelte";
  import PrbAvgDl from "./ClusterModalChart/PRBAvgDL.svelte";
  import PrbMaxDl from "./ClusterModalChart/PRBMaxDL.svelte";
  import PrbAvgUl from "./ClusterModalChart/PRBAvgUL.svelte";
  import PrbMaxUl from "./ClusterModalChart/PRBMaxUL.svelte";

  export let ClusterInfoModal = false;
  export let band: string = '';
  export let region: string = '';
  export let cluster: string = ''
  export let field: string = '';

  let ClusterStatisticData: any = '';
  let activeTab = 0;
  const tabs = [
    { id: 'tab1', title: 'SITE&CELL COUNT' },
    { id: 'tab2', title: 'ACTIVE USER' },
    { id: 'tab3', title: 'PRB UTILIZATION' },
  ];

  const fieldColumns: any = {
    'cell_availability': ['cellunavailabletimedown', 'cellunavailabletimelock', 'cellavail_pmperiodtime'],
    'attach_setup_success_rate': ['connestabsucc', 'connestabatt', 's1connestabsucc', 's1connestabatt', 'establnitsuccnbr', 'establnitattnbr'],
    'rrc_setup_success_rate': ['connestabsucc', 'connestabatt'],
    'erab_setup_success_rate_ngbr': ['establnitsuccnbr_qci59', 'estabaddsuccnbr_qci59', 'establnitattnbr_qci59', 'estabaddattnbr_qci59'],
    'volte_setup_success_rate_gbr': ['establnitsuccnbr_qci1', 'estabaddsuccnbr_qci1', 'establnitattnbr_qci1', 'estabaddattnbr_qci1'],
    'call_drop_rate_erab_ngbr': ['calldropqci_eccbdspauditrlcmaccallrelease_qci59', 'calldropqci_eccbrcvresetrequestfromecmb_qci59', 'calldropqci_eccbrcvcellreleaseindfromecmb_qci59', 'calldropqci_eccbradiolinkfailure_qci59', 'calldropqci_eccbdspauditmaccallrelease_qci59', 'calldropqci_eccbarqmaxretransmission_qci59', 'calldropqci_eccbdspauditrlccallrelease_qci59', 'calldropqci_eccbtmoutrrcconnectionreconfig_qci59', 'calldropqci_eccbtmoutrrcconnectionrestablish_qci59', 'calldropqci_eccbsisctpoutofsevice_qci59', 'establnitsuccnbr_qci59', 'estabaddsuccnbr_qci59', 'interx2insucc_qci59', 'inters1insucc_qci59'],
    'volte_call_drop_rate_erab_gbr': ['sumvoltecalldropqci', 'sumvolteestablnitsuccnbr', 'sumvolteestabaddsuccnbr', 'sumvolteerablncominghosuccnbr'],
    'hosr_intra_frequency': ['intrafreqoutsucc', 'intrafreqoutatt'],
    'hosr_inter_frequency': ['interfreqmeasgapoutsucc', 'interfreqnomeasgapoutsucc', 'interfreqmeasgapoutatt', 'interfreqnomeasgapoutatt'],
    'x2_handover_out_success_rate': ['interx2outsucc', 'interx2outatt'],
    'x2_handover_in_success_rate': ['interx2insucc', 'interx2inatt'],
    's1_handover_out_success_rate': ['inters1outsucc', 'inters1outatt'],
    's1_handover_in_success_rate': ['inters1insucc', 'inters1inatt']
  }
  $: dynamicsFields = fieldColumns[field] || [];

  function getBandString(band: string): string {
    switch (band) {
      case '2.3G':
        return '2.3GHz';
      case '2.6G':
        return '2.6GHz';
      case '800M':
        return '800M';
      default:
        return '';
    }
  }
  $: bandString = getBandString(band)

  async function fetchClusterinfo() {
    const FailClusterAPIpoint = 'http://10.24.8.120:8000/api/filteredcluster/';
    const queryParams = new URLSearchParams({ region, cluster });

    try {
      const response = await fetch(`${FailClusterAPIpoint}?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        ClusterStatisticData = data;
      } else {
        toast.error('Network response was not ok.');
      }
    } catch (error) {
      toast.error('Fail to fetch API data !!!');
    }
  }

  onMount(() => {
    fetchClusterinfo();
  });

  $: band, region, cluster, fetchClusterinfo();

  function handleTabClick(tabIndex: number) {
    activeTab = tabIndex;
    fetchClusterinfo();
  }
  
</script>

<Modal backdropClass="bg-gray-900 bg-opacity-80" bind:open={ClusterInfoModal} 
  class="z-50 {field === 'call_drop_rate_erab_ngbr' ? 'w-[550px]' : 'w-[500px]'}">
  <div class="flex flex-col mb-4">

    <!-- MODAL TITLE -->
    <div class="flex items-center gap-2 mb-4">
      <Icon icon="mage:message-information" class="text-5xl text-green-500" />
      <div class="flex flex-col">
        <h1 class="text-sm text-white">Cluster Weekly Statistic</h1>
        <p class="text-xs text-slate-400 flex gap-2 items-center">
          <span class="text-xs text-emerald-400">{field}</span>cluster statistic information
        </p>
      </div>
    </div>

    <!-- CLUSTER NAME, BAND, STATISTIC VALUE-->
    <div class="flex flex-col gap-2 mb-6">
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <h1 class="text-xl text-white font-bold">{cluster}</h1>
          <h1 class="text-xs px-2 py-1 rounded-sm
          {band === '2.3G' ? 'bg-sky-800 text-white' : band === '2.6G' ? 'bg-sky-600 text-white' : 'bg-sky-400 text-black'}">
            {bandString}
          </h1>
        </div>
      </div>
      
      <div class="flex items-center justify-between rounded-md">
        <!-- dynamic value related field -->
        <div class="flex items-center">
          <h1 class="text-5xl text-white font-bold">
            {#if ClusterStatisticData && ClusterStatisticData.sitecount_all > 0}
              {#if field === 'cell_availability'}
                {(1 - (((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.cellunavailabletimedown - 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.cellunavailabletimelock) / 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.cellavail_pmperiodtime) * 100)).toFixed(2)}%
              {:else if field === 'attach_setup_success_rate'}
                {(((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.connestabsucc / 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.connestabatt) * 
                (ClusterStatisticData?.lawdataSumInfo?.[bandString]?.s1connestabsucc / 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.s1connestabatt) * 
                (ClusterStatisticData?.lawdataSumInfo?.[bandString]?.establnitsuccnbr / 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.establnitattnbr)) * 100).toFixed(2)}%
              {:else if field === 'rrc_setup_success_rate'}
                {((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.connestabsucc / 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.connestabatt) * 100).toFixed(2)}%
              {:else if field === 'erab_setup_success_rate_ngbr'}
                {(((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.establnitsuccnbr_qci59 + 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.estabaddsuccnbr_qci59) /
                (ClusterStatisticData?.lawdataSumInfo?.[bandString]?.establnitattnbr_qci59 +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.estabaddattnbr_qci59)) * 100).toFixed(2)}%
              {:else if field === 'volte_setup_success_rate_gbr'}
                {((((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.establnitsuccnbr_qci1) +
                (ClusterStatisticData?.lawdataSumInfo?.[bandString]?.estabaddsuccnbr_qci1)) / 
                ((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.establnitattnbr_qci1) + 
                (ClusterStatisticData?.lawdataSumInfo?.[bandString]?.estabaddattnbr_qci1))) * 100).toFixed(2)}%
              {:else if field === 'call_drop_rate_erab_ngbr'}
                {(((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.calldropqci_eccbdspauditrlcmaccallrelease_qci59 + 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.calldropqci_eccbrcvresetrequestfromecmb_qci59 + 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.calldropqci_eccbrcvcellreleaseindfromecmb_qci59 +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.calldropqci_eccbradiolinkfailure_qci59 +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.calldropqci_eccbdspauditmaccallrelease_qci59 +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.calldropqci_eccbarqmaxretransmission_qci59 +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.calldropqci_eccbdspauditrlccallrelease_qci59 +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.calldropqci_eccbtmoutrrcconnectionreconfig_qci59 +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.calldropqci_eccbtmoutrrcconnectionrestablish_qci59 +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.calldropqci_eccbsisctpoutofsevice_qci59) / 
                (ClusterStatisticData?.lawdataSumInfo?.[bandString]?.establnitsuccnbr_qci59 + 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.estabaddsuccnbr_qci59 +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.interx2insucc_qci59 +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.inters1insucc_qci59)) * 100).toFixed(2)}%
              {:else if field === 'volte_call_drop_rate_erab_gbr'}
                {((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.sumvoltecalldropqci / 
                (ClusterStatisticData?.lawdataSumInfo?.[bandString]?.sumvolteestablnitsuccnbr + 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.sumvolteestabaddsuccnbr +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.sumvolteerablncominghosuccnbr
                )) * 100).toFixed(2)}%
              {:else if field === 'hosr_intra_frequency'}
                {(ClusterStatisticData?.lawdataSumInfo?.[bandString]?.intrafreqoutsucc / 
                (ClusterStatisticData?.lawdataSumInfo?.[bandString]?.intrafreqoutatt) * 100).toFixed(2)}%
              {:else if field === 'hosr_inter_frequency'}
                {(((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.interfreqmeasgapoutsucc + 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.interfreqnomeasgapoutsucc) / 
                (ClusterStatisticData?.lawdataSumInfo?.[bandString]?.interfreqmeasgapoutatt +
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.interfreqnomeasgapoutatt)) * 100).toFixed(2)}%
              {:else if field === 'x2_handover_out_success_rate'}
                {((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.interx2outsucc / 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.interx2outatt) * 100).toFixed(2)}%
              {:else if field === 'x2_handover_in_success_rate'}
                {((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.interx2insucc / 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.interx2inatt) * 100).toFixed(2)}%
              {:else if field === 's1_handover_out_success_rate'}
                {((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.inters1outsucc / 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.inters1outatt) * 100).toFixed(2)}%
              {:else if field === 's1_handover_in_success_rate'}
                {((ClusterStatisticData?.lawdataSumInfo?.[bandString]?.inters1insucc / 
                ClusterStatisticData?.lawdataSumInfo?.[bandString]?.inters1inatt) * 100).toFixed(2)}%
              {/if}
            {:else}
            No Data
            {/if}
          </h1>
        </div>

        <div class="flex flex-col gap-[1px]">
          {#if ClusterStatisticData}
            {#if dynamicsFields.length}
              {#each dynamicsFields as column}
              <div class="text-xs text-slate-500 grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)] w-full">
                <h1 class="flex items-center justify-start pe-4">{column}:</h1>
                <h1 class="text-white flex items-center justify-end">{(ClusterStatisticData?.lawdataSumInfo?.[bandString]?.[column]).toLocaleString()}</h1>
              </div>
              {/each}
            {/if}
          {/if}
        </div>
      </div>
    </div>

    <!-- SITE&CELL / ACTIVE / PRB INFORMATION -->
    <div>
      <div class="flex items-center bg-slate-700 gap-[1px] mb-6 -mx-6">
        {#each tabs as tab, index}
          <button class="text-xs px-2 py-1 rounded-sm active:bg-fuchsia-500 active:text-black w-full 
            {index === activeTab ? 'bg-fuchsia-500 text-black' : 'hover:bg-fuchsia-500 hover:text-black'}"
            on:click={() => handleTabClick(index)}>
            {tab.title}
          </button>
        {/each}
      </div>

      <!-- TITLE -->
      {#each tabs as tab, index}
        {#if index === activeTab}
        <!-- SITE AND CELL COUNT CONTENT -->
          {#if tab.id === 'tab1'}
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="relative flex items-center">
                  <SiteCount {ClusterStatisticData} />
                  <div class="absolute top-[30%] left-[23%] flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">Site Count</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {ClusterStatisticData.sitecount_all}
                    </h1>
                  </div>
                </div>
                <div class="relative items-center">
                  <CellCount {ClusterStatisticData} />
                  <div class="absolute top-[30%] left-[25%] flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">Cell Count</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {ClusterStatisticData.cellcount_all}
                    </h1>
                  </div>
                </div>
              </div>

              {#if ClusterStatisticData}
              <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-2">
                {#each ClusterStatisticData.sitecount_byband.band as bandName, index (bandName)}
                  <div class="flex items-center gap-1 pe-4 {bandString === bandName ? 'text-white' : 'text-slate-500'}">
                    <div class="h-3 w-3 rounded-sm" class:bg-sky-800={bandName === '2.3GHz'} class:bg-sky-600={bandName === '2.6GHz'} class:bg-sky-400={bandName === '800M'}></div>
                    <h1 class="text-xs">{bandName}</h1>
                  </div>
                  <div class="flex items-center justify-end pe-2">
                    <h1 class="text-xs text-slate-500">{ClusterStatisticData.sitecount_byband.count[index]}</h1>
                  </div>
                  <div class="flex items-center justify-end pe-2">
                    <h1 class="text-xs text-slate-500">{ClusterStatisticData.cellcount_byband.count[index]}</h1>
                  </div>
                {/each}
              </div>
              {/if}
            </div>
            
            <div class="flex flex-col mt-4">
              <h1 class="text-xs text-slate-500">
                this cluster aqupying 10% of total central sites
              </h1>
            </div>

          <!-- ACTIVE USER SECTION -->
          {:else if tab.id === 'tab2'}
            <div class="flex items-center justify-center gap-4">
              <div class="relative items-center">
                <ActiveUser {ClusterStatisticData} />
                <div class="absolute top-[30%] left-[20%] flex flex-col items-center justify-center">
                  <h1 class="text-xs text-slate-500">Avg Act user</h1>
                  <h1 class="text-2xl text-white font-bold">
                    {(ClusterStatisticData.activeuserInfo.avg_connectno[0]).toFixed(1)}
                  </h1>
                </div>
              </div>
              <div class="relative items-center">
                <ActiveUserSum {ClusterStatisticData} />
                <div class="absolute top-[30%] left-[15%] flex flex-col items-center justify-center">
                  <h1 class="text-xs text-slate-500">Sum Act user</h1>
                  <h1 class="text-2xl text-white font-bold">
                    {(ClusterStatisticData.activeuserInfo.sum_connectno[0]).toFixed(0)}
                  </h1>
                </div>
              </div>
              <div class="relative items-center">
                <ActiveUserMaxavg {ClusterStatisticData} />
                <div class="absolute top-[30%] left-[15%] flex flex-col items-center justify-center">
                  <h1 class="text-xs text-slate-500">Max user avg</h1>
                  <h1 class="text-2xl text-white font-bold">
                    {(ClusterStatisticData.activeuserInfo.avg_connectmax[0]).toFixed(0)}
                  </h1>
                </div>
              </div>
              
              <div class="relative items-center">
                <ActiveUserMaxsum {ClusterStatisticData} />
                <div class="absolute top-[30%] left-[13%] flex flex-col items-center justify-center">
                  <h1 class="text-xs text-slate-500">Max user sum</h1>
                  <h1 class="text-2xl text-white font-bold">
                    {(ClusterStatisticData.activeuserInfo.sum_connectmax[0]).toFixed(0)}
                  </h1>
                </div>
              </div>
            </div>

          <!-- PRB UTILIZATION SECTION-->
          {:else if tab.id === 'tab3'}
            <div class="flex flex-col items-center justify-center gap-4">
              <div class="flex items-center justify-center gap-4">
                <div class="relative items-center">
                  <PrbAvgDl {ClusterStatisticData} />
                  <div class="absolute top-[30%] left-[20%] flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">PRB avg DL</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {(ClusterStatisticData.prbutilizationInfo.avg_prbdl[0]).toFixed(1)}%
                    </h1>
                  </div>
                </div>
                <div class="relative items-center">
                  <PrbMaxDl {ClusterStatisticData} />
                  <div class="absolute top-[30%] left-[20%] flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">PRB max DL</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {(ClusterStatisticData.prbutilizationInfo.max_prbdl[0]).toFixed(1)}%
                    </h1>
                  </div>
                </div>
                <div class="relative items-center">
                  <PrbAvgUl {ClusterStatisticData} />
                  <div class="absolute top-[30%] left-[20%] flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">PRB avg UL</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {(ClusterStatisticData.prbutilizationInfo.avg_prbul[0]).toFixed(1)}%
                    </h1>
                  </div>
                </div>
                <div class="relative items-center">
                  <PrbMaxUl {ClusterStatisticData} />
                  <div class="absolute top-[30%] left-[20%] flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">PRB max UL</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {(ClusterStatisticData.prbutilizationInfo.max_prbul[0]).toFixed(1)}%
                    </h1>
                  </div>
                </div>

              </div>
            </div>
            
          {:else}
            <!-- 기본 컨텐츠 렌더링 -->
          {/if}
        {/if}
      {/each}
    </div>


  </div>
</Modal>

<Toaster />