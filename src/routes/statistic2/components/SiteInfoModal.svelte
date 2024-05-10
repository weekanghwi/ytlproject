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

  export let SiteInfoModal = false;
  export let band: string = '';
  export let field: string = '';
  export let siteid: string = ''

  let SiteStatisticData: any = '';
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

  async function fetchSiteinfo() {
    const FailClusterAPIpoint = 'http://10.24.8.120:8000/api/filteredcluster/';
    const queryParams = new URLSearchParams({ siteid });

    try {
      const response = await fetch(`${FailClusterAPIpoint}?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        SiteStatisticData = data;
        ClusterStatisticData = data;
      } else {
        toast.error('Network response was not ok.');
      }
    } catch (error) {
      toast.error('Fail to fetch API data !!!');
    }
  }

  onMount(() => {
    fetchSiteinfo();
  });

  $: siteid, fetchSiteinfo();

  function handleTabClick(tabIndex: number) {
    activeTab = tabIndex;
    fetchSiteinfo();
  }
</script>

<Modal backdropClass="bg-gray-900 bg-opacity-80" size="sm" bind:open={SiteInfoModal}>
  <div class="flex flex-col mb-4">

    <!-- MODAL TITLE -->
    <div class="flex items-center gap-2 mb-4">
      <Icon icon="mage:message-information" class="text-5xl text-green-500" />
      <div class="flex flex-col">
        <h1 class="text-sm text-white">Cell Weekly Statistic</h1>
        <p class="text-xs text-slate-400 flex gap-2 items-center">
          <span class="text-xs text-emerald-400">{field}</span>cell statistic information
        </p>
      </div>
    </div>

    <!-- SITE ID & BAND -->
    <div class="flex items-center gap-2 mb-4">
      <h1 class="text-white font-bold">{siteid}</h1>
      <h1 class="text-xs px-2 py-[1px] rounded-sm {band === '2.3GHz' ? 'bg-sky-800 text-white' : band === '2.6GHz' ? 'bg-sky-600 text-white' : 'bg-sky-400 text-black'}">{band}</h1>
    </div>

    <!-- STATISTIC VALUE & ITEMS -->
    <div class="flex items-center justify-between border-y border-slate-700/50 py-4">
      <!-- CALCULATED VALUE -->
      <h1 class="text-5xl text-white font-bold">
        {#if SiteStatisticData && SiteStatisticData.lawdataSumInfo[band]}
          {#if field === 'cell_availability'}
            {((1 - ((SiteStatisticData?.lawdataSumInfo?.[band]?.cellunavailabletimedown - 
            SiteStatisticData?.lawdataSumInfo?.[band]?.cellunavailabletimelock) / 
            SiteStatisticData?.lawdataSumInfo?.[band]?.cellavail_pmperiodtime)) * 100).toFixed(2)}%
          {:else if field === 'attach_setup_success_rate'}
            {(((SiteStatisticData?.lawdataSumInfo?.[band]?.connestabsucc / 
            SiteStatisticData?.lawdataSumInfo?.[band]?.connestabatt) * 
            (SiteStatisticData?.lawdataSumInfo?.[band]?.s1connestabsucc / 
            SiteStatisticData?.lawdataSumInfo?.[band]?.s1connestabatt) * 
            (SiteStatisticData?.lawdataSumInfo?.[band]?.establnitsuccnbr / 
            SiteStatisticData?.lawdataSumInfo?.[band]?.establnitattnbr)) * 100).toFixed(2)}%
          {:else if field === 'rrc_setup_success_rate'}
            {((SiteStatisticData?.lawdataSumInfo?.[band]?.connestabsucc /
            SiteStatisticData?.lawdataSumInfo?.[band]?.connestabatt) * 100).toFixed(2)}%
          {:else if field === 'erab_setup_success_rate_ngbr'}
            {(((SiteStatisticData?.lawdataSumInfo?.[band]?.establnitsuccnbr_qci59 + 
              SiteStatisticData?.lawdataSumInfo?.[band]?.estabaddsuccnbr_qci59) / 
              (SiteStatisticData?.lawdataSumInfo?.[band]?.establnitattnbr_qci59 + 
              SiteStatisticData?.lawdataSumInfo?.[band]?.estabaddattnbr_qci59)) * 100).toFixed(2)}%
          {:else if field === 'volte_setup_success_rate_gbr'}
            {(((SiteStatisticData?.lawdataSumInfo?.[band]?.establnitsuccnbr_qci1 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.estabaddsuccnbr_qci1) / 
            (SiteStatisticData?.lawdataSumInfo?.[band]?.establnitattnbr_qci1 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.estabaddattnbr_qci1)) * 100).toFixed(2)}%

          {:else if field === 'call_drop_rate_erab_ngbr'}
            {(((SiteStatisticData?.lawdataSumInfo?.[band]?.calldropqci_eccbdspauditrlcmaccallrelease_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.calldropqci_eccbrcvresetrequestfromecmb_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.calldropqci_eccbrcvcellreleaseindfromecmb_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.calldropqci_eccbradiolinkfailure_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.calldropqci_eccbdspauditmaccallrelease_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.calldropqci_eccbarqmaxretransmission_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.calldropqci_eccbdspauditrlccallrelease_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.calldropqci_eccbtmoutrrcconnectionreconfig_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.calldropqci_eccbtmoutrrcconnectionrestablish_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.calldropqci_eccbsisctpoutofsevice_qci59) / 
            (SiteStatisticData?.lawdataSumInfo?.[band]?.establnitsuccnbr_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.estabaddsuccnbr_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.interx2insucc_qci59 + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.inters1insucc_qci59)) * 100).toFixed(2)}%
          {:else if field === 'volte_call_drop_rate_erab_gbr'}
            {(((SiteStatisticData?.lawdataSumInfo?.[band]?.sumvoltecalldropqci + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.sumvolteestablnitsuccnbr) / 
            (SiteStatisticData?.lawdataSumInfo?.[band]?.sumvolteestabaddsuccnbr + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.sumvolteerablncominghosuccnbr)) * 100).toFixed(2)}%
          {:else if field === 'hosr_intra_frequency'}
            {(((SiteStatisticData?.lawdataSumInfo?.[band]?.intrafreqoutsucc / 
            SiteStatisticData?.lawdataSumInfo?.[band]?.intrafreqoutatt)) * 100).toFixed(2)}%
          {:else if field === 'hosr_inter_frequency'}
            {(((SiteStatisticData?.lawdataSumInfo?.[band]?.interfreqmeasgapoutsucc + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.interfreqnomeasgapoutsucc) / 
            (SiteStatisticData?.lawdataSumInfo?.[band]?.interfreqmeasgapoutatt + 
            SiteStatisticData?.lawdataSumInfo?.[band]?.interfreqnomeasgapoutatt)) * 100).toFixed(2)}%
          {:else if field === 'x2_handover_out_success_rate'}
            {((SiteStatisticData?.lawdataSumInfo?.[band]?.interx2outsucc / 
            SiteStatisticData?.lawdataSumInfo?.[band]?.interx2outatt) * 100).toFixed(2)}%)
          {:else if field === 'x2_handover_in_success_rate'}
            {((SiteStatisticData?.lawdataSumInfo?.[band]?.interx2insucc / 
              SiteStatisticData?.lawdataSumInfo?.[band]?.interx2inatt) * 100).toFixed(2)}%
          {:else if field === 's1_handover_out_success_rate'}
            {((SiteStatisticData?.lawdataSumInfo?.[band]?.inters1outsucc / 
            SiteStatisticData?.lawdataSumInfo?.[band]?.inters1outatt) * 100).toFixed(2)}%
          {:else if field === 's1_handover_in_success_rate'}
            {((SiteStatisticData?.lawdataSumInfo?.[band]?.inters1insucc / 
            SiteStatisticData?.lawdataSumInfo?.[band]?.inters1inatt) * 100).toFixed(2)}%
          {/if}
        {:else}
        no data
        {/if}
      </h1>

      <!-- STATISTIC CALCULATE ITEM -->
      <div class="flex flex-col gap-[1px]">
        {#if SiteStatisticData}
          {#if dynamicsFields.length}
            {#each dynamicsFields as column}
            <div class="text-xs text-slate-500 grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)] w-full">
              <h1 class="flex items-center justify-start pe-4">{column}:</h1>
              <h1 class="text-white flex items-center justify-end">
                {#if (SiteStatisticData?.lawdataSumInfo?.[band]?.[column] || SiteStatisticData?.lawdataSumInfo?.[band]?.[column] === 0)}
                  {SiteStatisticData?.lawdataSumInfo?.[band]?.[column].toLocaleString()}
                {:else}
                  -
                {/if}
              </h1>
            </div>
            {/each}
          {/if}
        {/if}
      </div>
    </div>

    <!-- -->
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
                <div class="relative flex items-center justify-center">
                  <div class="z-50">
                    <SiteCount {ClusterStatisticData} />
                  </div>
                  <div class="absolute flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">Site Count</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {SiteStatisticData.sitecount_all}
                    </h1>
                  </div>
                </div>
                <div class="relative flex items-center justify-center">
                  <div class="z-50">
                    <CellCount {ClusterStatisticData} />
                  </div>
                  <div class="absolute flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">Cell Count</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {SiteStatisticData.cellcount_all}
                    </h1>
                  </div>
                </div>
              </div>

              {#if SiteStatisticData}
              <div class="grid grid-cols-[minmax(min-content,1fr)_minmax(0,auto)_minmax(0,auto)] gap-2">
                {#each SiteStatisticData.sitecount_byband.band as bandName, index (bandName)}
                  <div class="flex items-center gap-1 pe-4 {bandString === bandName ? 'text-white' : 'text-slate-500'}">
                    <div class="h-3 w-3 rounded-sm" class:bg-sky-800={bandName === '2.3GHz'} class:bg-sky-600={bandName === '2.6GHz'} class:bg-sky-400={bandName === '800M'}></div>
                    <h1 class="text-xs">{bandName}</h1>
                  </div>
                  <div class="flex items-center justify-end pe-2">
                    <h1 class="text-xs text-slate-500">{SiteStatisticData.sitecount_byband.count[index]}</h1>
                  </div>
                  <div class="flex items-center justify-end pe-2">
                    <h1 class="text-xs text-slate-500">{SiteStatisticData.cellcount_byband.count[index]}</h1>
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
              <div class="relative flex items-center justify-center">
                <div class="z-50">
                  <ActiveUser {ClusterStatisticData} />
                </div>
                <div class="absolute flex flex-col items-center justify-center">
                  <h1 class="text-xs text-slate-500">Avg Act user</h1>
                  <h1 class="text-2xl text-white font-bold">
                    {(SiteStatisticData.activeuserInfo.avg_connectno[0]).toFixed(1)}
                  </h1>
                </div>
              </div>
              <div class="relative flex items-center justify-center">
                <div class="z-50">
                  <ActiveUserSum {ClusterStatisticData} />
                </div>
                <div class="absolute flex flex-col items-center justify-center">
                  <h1 class="text-xs text-slate-500">Sum Act user</h1>
                  <h1 class="text-2xl text-white font-bold">
                    {(SiteStatisticData.activeuserInfo.sum_connectno[0]).toFixed(0)}
                  </h1>
                </div>
              </div>
              <div class="relative flex items-center justify-center">
                <div class="z-50">
                  <ActiveUserMaxavg {ClusterStatisticData} />
                </div>
                <div class="absolute flex flex-col items-center justify-center">
                  <h1 class="text-xs text-slate-500">Max user avg</h1>
                  <h1 class="text-2xl text-white font-bold">
                    {(SiteStatisticData.activeuserInfo.avg_connectmax[0]).toFixed(0)}
                  </h1>
                </div>
              </div>
              
              <div class="relative flex items-center justify-center">
                <div class="z-50">
                  <ActiveUserMaxsum {ClusterStatisticData} />
                </div>
                <div class="absolute flex flex-col items-center justify-center">
                  <h1 class="text-xs text-slate-500">Max user sum</h1>
                  <h1 class="text-2xl text-white font-bold">
                    {(SiteStatisticData.activeuserInfo.sum_connectmax[0]).toFixed(0)}
                  </h1>
                </div>
              </div>
            </div>

          <!-- PRB UTILIZATION SECTION-->
          {:else if tab.id === 'tab3'}
            <div class="flex flex-col items-center justify-center gap-4">
              <div class="flex items-center justify-center gap-4">
                <div class="relative flex items-center justify-center">
                  <div class="z-50">
                    <PrbAvgDl {ClusterStatisticData} />
                  </div>
                  <div class="absolute flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">PRB avg DL</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {(SiteStatisticData.prbutilizationInfo.avg_prbdl[0]).toFixed(1)}%
                    </h1>
                  </div>
                </div>
                <div class="relative flex items-center justify-center">
                  <div class="z-50">
                    <PrbMaxDl {ClusterStatisticData} />
                  </div>
                  <div class="absolute flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">PRB max DL</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {(SiteStatisticData.prbutilizationInfo.max_prbdl[0]).toFixed(1)}%
                    </h1>
                  </div>
                </div>
                <div class="relative flex items-center justify-center">
                  <div class="z-50">
                    <PrbAvgUl {ClusterStatisticData} />
                  </div>
                  <div class="absolute flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">PRB avg UL</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {(SiteStatisticData.prbutilizationInfo.avg_prbul[0]).toFixed(1)}%
                    </h1>
                  </div>
                </div>
                <div class="relative flex items-center justify-center">
                  <div class="z-50">
                    <PrbMaxUl {ClusterStatisticData} />
                  </div>
                  <div class="absolute flex flex-col items-center justify-center">
                    <h1 class="text-xs text-slate-500">PRB max UL</h1>
                    <h1 class="text-2xl text-white font-bold">
                      {(SiteStatisticData.prbutilizationInfo.max_prbul[0]).toFixed(1)}%
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