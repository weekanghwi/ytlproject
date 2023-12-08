<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import Availability from './chart/Availability.svelte'
  import Attachetupuccess from './chart/Attachetupuccess.svelte';
  import Rrcsetupsuccess from './chart/Rrcsetupsuccess.svelte';
  import Erabsetupsuccess from './chart/Erabsetupsuccess.svelte';
  import Calldropdata from './chart/Calldropdata.svelte';
  import Calldropvolte from './chart/Calldropvolte.svelte';
  import Hsorintra from './chart/Hsorintra.svelte';
  import Hsorinter from './chart/Hsorinter.svelte';
  import Hox2out from './chart/Hox2out.svelte';
  import Hox2in from './chart/Hox2in.svelte';
  import Blerdl from './chart/Blerdl.svelte';
  import Blerul from './chart/Blerul.svelte';
  import SiteCountareachart from './chart/SiteCountareachart.svelte';
  import { fetchStatisticChartData } from './chart/chartdata'
	import { Breadcrumb, BreadcrumbItem, Button, Dropdown, DropdownItem, Search, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Card, Label, Select, Progressbar } from 'flowbite-svelte';
  import PaginationComponent from '../../components/PaginationComponent.svelte';
	import { onMount } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast'

  export let data;

  let selectedBand = '800M';
  let chartdata:any = null;
  let SitecountChartData: any = null;

  const categoryAll = data.statisticData.statisticCalculated.results.find(item => item.band === 'All')
  const category800M = data.statisticData.statisticCalculated.results.find(item => item.band === '800M')
  const category23G = data.statisticData.statisticCalculated.results.find(item => item.band === '2.3G')
  const category26G = data.statisticData.statisticCalculated.results.find(item => item.band === '2.6G')


  //Dropdown 
  let selectedRegion = 'Central';
  let dropdownOpen = false;
  let regiondropdownOpen = false;
  function selecteRegionOption(regionoption: string) {
    selectedRegion = regionoption;
    region = regionoption;
  }
  const bands = ['800M', '2.3GHz', '2.6GHz']
  const regions = ['Central', 'Northern', 'Southern', 'Eastern', 'Sabah', 'Sarawak']

  onMount(async () => {
    try {
      chartdata = await fetchStatisticChartData();
      SitecountChartData = data.statisticData.statisticSummary
    } catch (error) {
      const errorMessage = error.message || 'An error occurred while fetching chart data!';
      toast.error(errorMessage);
    }
  });

  function selecteOption(bandoption: string) {
    selectedBand = bandoption;
    band = bandoption
  }

  // Pagination variables
  let paginationurl = 'statistic'
  let sitebasicinfo = '';
  let band = '';
  let region = '';
  let year = '';
  let weeknum = '';
  let cell_availability = '';
  let attach_setup_rate = '';
  let rrc_setup_rate = '';
  let erab_setup_rate_ngbr = '';
  let volte_setup_rate_gbr = '';
  let call_drop_rate_erab_ngbr = '';
  let volte_call_drop_rate_erab_gbr = '';
  let hosr_intra_frequency = '';
  let hosr_inter_frequency = '';
  let x2_handover_out_rate = '';
  let x2_handover_in_rate = '';
  let s1_handover_out_rate = '';
  let s1_handover_in_rate = '';
  let dl_bler = '';
  let ul_bler = '';

  let limit = Number($page.url.searchParams.get('limit')) || 5;
  $: totalPages = (Number(data?.statisticData?.totalPages) || 0);
  $: activePage = (Number($page.url.searchParams.get('offset')) || 0) / limit;

  // Search
  async function search() {
    let params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', '0');
    params.set('sitebasicinfo', sitebasicinfo);
    params.set('band', band);
    params.set('region', region);
    params.set('year', year);
    params.set('weeknum', weeknum);
    params.set('cell_availability', cell_availability);
    params.set('attach_setup_rate', attach_setup_rate);
    params.set('rrc_setup_rate', rrc_setup_rate);
    params.set('erab_setup_rate_ngbr', erab_setup_rate_ngbr);
    params.set('volte_setup_rate_gbr', volte_setup_rate_gbr);
    params.set('call_drop_rate_erab_ngbr', call_drop_rate_erab_ngbr);
    params.set('volte_call_drop_rate_erab_gbr', volte_call_drop_rate_erab_gbr);
    params.set('hosr_intra_frequency', hosr_intra_frequency);
    params.set('hosr_inter_frequency', hosr_inter_frequency);
    params.set('x2_handover_out_rate', x2_handover_out_rate);
    params.set('x2_handover_in_rate', x2_handover_in_rate);
    params.set('s1_handover_out_rate', s1_handover_out_rate);
    params.set('s1_handover_in_rate', s1_handover_in_rate);
    params.set('dl_bler', dl_bler);
    params.set('ul_bler', ul_bler);
    goto(`/${paginationurl}/?${params.toString()}`);
  }

  function resetFilters() {
    sitebasicinfo = '';
    band = '',
    region = '';
    year = '';
    weeknum = '';
    cell_availability = '';
    attach_setup_rate = '';
    rrc_setup_rate = '';
    erab_setup_rate_ngbr = '';
    volte_setup_rate_gbr = '';
    call_drop_rate_erab_ngbr = '';
    volte_call_drop_rate_erab_gbr = '';
    hosr_intra_frequency = '';
    hosr_inter_frequency = '';
    x2_handover_out_rate = '';
    x2_handover_in_rate = '';
    s1_handover_out_rate = '';
    s1_handover_in_rate = '';
    dl_bler = '';
    ul_bler = '';
    search();
  }

  function checkForEnter(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      search();
    }
  }

  import Circleprogress from '../../components/Circleprogress.svelte';
</script>


<div class="flex flex-col p-4">
    <!-- Breadcrumb -->
    <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem>Statistic</BreadcrumbItem>
    </Breadcrumb>
  
    <div class="sticky-header flex items-center gap-2 mb-4">
      <Icon icon="wpf:statistics" class="text-slate-400"/>
      <h1 class="font-bold text-slate-400 me-4">YTL LTE Network Staitstic {year} {weeknum}</h1>
      <Button color="purple" class="py-2 text-xs">Select Band: [{selectedBand}]</Button>
      <Dropdown bind:open={dropdownOpen} class="py-1 w-28 bg-purple-400/50 rounded-lg">
        {#each bands as band}
          <DropdownItem DropdownItem wnItem defaultClass="text-xs pl-4 m-0 hover:bg-purple-550" 
          on:click={() => {selecteOption(band); (dropdownOpen = false); search()}}>
            {band}
          </DropdownItem>
        {/each}
      </Dropdown>
      <Button color="blue" class="py-2 text-xs">Select Fail Region [{selectedRegion}]</Button>
      <Dropdown bind:open={regiondropdownOpen} class="py-1 w-28 bg-blue-400/50 rounded-lg">
        {#each regions as region}
          <DropdownItem DropdownItem wnItem defaultClass="text-xs pl-4 m-0 hover:bg-blue-550" 
            on:click={() => {selecteRegionOption(region); (regiondropdownOpen = false); search() }}>
            {region}
          </DropdownItem>
        {/each}
      </Dropdown>
    </div>
  
    <div class="grid grid-cols-5 gap-4 mb-2 h-[calc(100vh-230px)] overflow-y-auto p-2">
      <div class="flex flex-col border border-slate-700 rounded-lg col-span-2 gap-3 p-4">
        <div class="flex flex-col justify-start mb-6">
          <h1 class="text-sm font-bold text-slate-400">23 Week {data.statisticData.weekNum} Statistic Summary</h1>
          <p class="text-xs text-slate-500">{data.statisticData.startOfWeek?.toISOString().split('T')[0]} ~ {data.statisticData.endOfWeek?.toISOString().split('T')[0]}</p>
        </div>

        <div class="flex items-center justify-between gap-10">
          <div class="flex flex-col h-full w-2/4">
            <div class="flex items-center justify-between">
              <p class="text-slate-400">Total site count</p>
              <p class="text-slate-400">{data.statisticData.statisticSummary.total_statistic_site}</p>
            </div>
            <div class="flex items-center justify-between mb-3">
              <p class="text-slate-400 text-xs">Total cell count</p>
              <p class="text-slate-400 text-xs">{data.statisticData.statisticSummary.total_statistic_cell}</p>
            </div>
            <div class="flex items-center justify-center w-full">
              <SiteCountareachart {selectedBand} {SitecountChartData} />
            </div>
          </div>

          <div class="flex flex-col h-full w-2/4 gap-2">
            <div class="flex items-center justify-between mb-3">
              <p class="text-slate-400 text-sm">Total Active User</p>
              <p class="text-slate-50 font-bold">
                {
                  parseFloat((data.statisticData.statisticSummary.total_user.band["800M"].total_connect_count[1] / 7).toFixed(0)) + 
                  parseFloat((data.statisticData.statisticSummary.total_user.band["2.3GHz"].total_connect_count[1] / 7).toFixed(0)) +
                  parseFloat((data.statisticData.statisticSummary.total_user.band["2.6GHz"].total_connect_count[1] / 7).toFixed(0))
                }
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-xs text-slate-400">
                FDD 800M
              </p>
              <p class="text-xs text-slate-400">
                {parseFloat((data.statisticData.statisticSummary.total_user.band["800M"].total_connect_count[1] / 7).toFixed(0))}
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-xs text-slate-400">
                TDD 2.3Ghz
              </p>
              <p class="text-xs text-slate-400">
                {parseFloat((data.statisticData.statisticSummary.total_user.band["2.3GHz"].total_connect_count[1] / 7).toFixed(0))}
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-xs text-slate-400">
                TDD 2.6Ghz
              </p>
              <p class="text-xs text-slate-400">
                {parseFloat((data.statisticData.statisticSummary.total_user.band["2.6GHz"].total_connect_count[1] / 7).toFixed(0))}
              </p>
            </div>
          </div>
        </div>
        
      </div>
      
      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-sm font-bold">Cell Availability ({selectedBand})</h5>
        </div>
        <Availability {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4 mt-auto">
          <a href={`/statistic/map?fields=cell_availability&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>


      <Card size="lg" class="p-2 col-span-2">
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex flex-col">
            <h5 class="text-sm font-bold">Attach Setup Success Rate</h5>
            <h5 class="text-xs rounded-lg bg-lime-400 text-slate-900 py-0.5 px-2">KPI Threshold: Over 99%</h5>
          </div>
          
          <div class="flex items-center justify-end gap-4">
            <a href={`/statistic/map?fields=attach_setup_success_rate&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
              <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
                <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
              </button>
            </a>
          </div>
        </div>
          
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-col w-2/4 items-center justify-center gap-2">
            {#if categoryAll}
            <Circleprogress size={180} stroke={5} trackColor="#000000"
              progress={categoryAll.attach_setup_success_rate}
              centerTexts={[
                { text: "OverAll", size: "14px", lineHeight: 18 },
                { text: `${categoryAll.attach_setup_success_rate.toFixed(1)}%`, size: "30px", lineHeight: 12 },
              ]}
            />
            <div class="flex items-center justify-between gap-4">
              <Circleprogress size={55} stroke={2} trackColor="#000000"
                progress={category800M.attach_setup_success_rate}
                centerTexts={[
                  { text: "800M", size: "10px", lineHeight: 20 },
                  { text: category800M.attach_setup_success_rate.toFixed(1), size: "14px", lineHeight: 20 }
                ]}
              />
              <Circleprogress size={55} stroke={2} trackColor="#000000"
                progress={category23G.attach_setup_success_rate}
                centerTexts={[
                  { text: "2.3GHz", size: "10px", lineHeight: 20 },
                  { text: category23G.attach_setup_success_rate.toFixed(1), size: "14px", lineHeight: 20 }
                ]}
              />
              <Circleprogress size={55} stroke={2} trackColor="#000000" 
                progress={category26G.attach_setup_success_rate}
                centerTexts={[
                  { text: "2.6GHz", size: "10px", lineHeight: 20 },
                  { text: category26G.attach_setup_success_rate.toFixed(1), size: "14px", lineHeight: 20 }
                ]}
              />
            </div>
            {:else}
              <p class="text-sm text-rose-400">Pending update statistic</p>
            {/if}
          </div>
          <div class="flex flex-col w-2/4">
            <h1 class="text-sm text-slate-400 ps-4 mb-2">Selected Band: [{selectedBand}]</h1>
            <Attachetupuccess {selectedBand} {chartdata}/>
            
          </div>
        </div>
      </Card>

      <Card size="lg" class="p-2 col-span-2">
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex flex-col">
            <h5 class="text-sm font-bold">RRC Setup Success Rate</h5>
            <h5 class="text-xs rounded-lg bg-lime-400 text-slate-900 py-0.5 px-2">KPI Threshold: Over 99%</h5>
          </div>
          
          <div class="flex items-center justify-end gap-4">
            <a href={`/statistic/map?fields=rrc_setup_success_rate&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
              <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
                <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
              </button>
            </a>
          </div>
        </div>
          
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-col w-2/4 items-center justify-center gap-2">
            {#if categoryAll}
            <Circleprogress size={180} stroke={5} trackColor="#000000"
              progress={categoryAll.rrc_setup_success_rate}
              centerTexts={[
                { text: "OverAll", size: "14px", lineHeight: 18 },
                { text: `${categoryAll.rrc_setup_success_rate.toFixed(1)}%`, size: "30px", lineHeight: 12 },
              ]}
            />
            <div class="flex items-center justify-between gap-4">
              <Circleprogress size={55} stroke={2} trackColor="#000000"
                progress={category800M.rrc_setup_success_rate}
                centerTexts={[
                  { text: "800M", size: "10px", lineHeight: 20 },
                  { text: category800M.rrc_setup_success_rate.toFixed(1), size: "14px", lineHeight: 20 }
                ]}
              />
              <Circleprogress size={55} stroke={2} trackColor="#000000"
                progress={category23G.rrc_setup_success_rate}
                centerTexts={[
                  { text: "2.3GHz", size: "10px", lineHeight: 20 },
                  { text: category23G.rrc_setup_success_rate.toFixed(1), size: "14px", lineHeight: 20 }
                ]}
              />
              <Circleprogress size={55} stroke={2} trackColor="#000000" 
                progress={category26G.rrc_setup_success_rate}
                centerTexts={[
                  { text: "2.6GHz", size: "10px", lineHeight: 20 },
                  { text: category26G.rrc_setup_success_rate.toFixed(1), size: "14px", lineHeight: 20 }
                ]}
              />
            </div>
            {:else}
              <p class="text-sm text-rose-400">Pending update statistic</p>
            {/if}
          </div>
          <div class="flex flex-col w-2/4">
            <h1 class="text-sm text-slate-400 ps-4 mb-2">Selected Band: [{selectedBand}]</h1>
            <Rrcsetupsuccess {selectedBand} {chartdata}/>
            
          </div>
        </div>
      </Card>

      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-xs font-bold">RRC Setup Success Rate ({selectedBand})</h5>
        </div>
        <Rrcsetupsuccess {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4">
          <a href={`/statistic/map?fields=rrc_setup_success_rate&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>
      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-xs font-bold">eRAB Setup Success Rate ({selectedBand})</h5>
        </div>
        <Erabsetupsuccess {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4">
          <a href={`/statistic/map?fields=erab_setup_success_rate_ngbr&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>
      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-xs font-bold">Call Drop Rate (nGBR) ({selectedBand})</h5>
        </div>
        <Calldropdata {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4">
          <a href={`/statistic/map?fields=call_drop_rate_erab_ngbr&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>
      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-xs font-bold">Call Drop Rate (VoLTE) ({selectedBand})</h5>
        </div>
        <Calldropvolte {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4">
          <a href={`/statistic/map?fields=volte_call_drop_rate_erab_gbr&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>
      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-xs font-bold">BLER DL ({selectedBand})</h5>
        </div>
        <Blerdl {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4">
          <a href={`/statistic/map?fields=dl_bler&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>
      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-xs font-bold">BLER UL ({selectedBand})</h5>
        </div>
        <Blerul {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4">
          <a href={`/statistic/map?fields=ul_bler&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>
      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-xs font-bold">HOSR Intra Success Rate ({selectedBand})</h5>
        </div>
        <Hsorintra {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4">
          <a href={`/statistic/map?fields=hosr_intra_frequency&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>
      
      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-xs font-bold">HSOR Inter Success Rate ({selectedBand})</h5>
        </div>
        <Hsorinter {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4">
          <a href={`/statistic/map?fields=hosr_inter_frequency&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>
      
      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-xs font-bold">HOSR X2 Out Success Rate ({selectedBand})</h5>
        </div>
        <Hox2out {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4">
          <a href={`/statistic/map?fields=x2_handover_out_success_rate&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>
      
      <Card size="sm" class="p-2">
        <div class="flex items-center gap-2 mb-4">
          <h5 class="text-xs font-bold">HOSR X2 In Success Rate ({selectedBand})</h5>
        </div>
        <Hox2in {selectedBand} {chartdata}/>
        <hr class="border-slate-550 my-6">
        <div class="flex items-center gap-4">
          <a href={`/statistic/map?fields=x2_handover_in_success_rate&band=${encodeURIComponent(selectedBand)}&region=${encodeURIComponent(selectedRegion)}`} target="_blank">
            <button class="text-slate-900 text-xs rounded-md flex items-center py-2 px-3 bg-slate-400 hover:bg-slate-200 ">
              <Icon icon="ph:map-pin-bold" class="me-1 text-slate-900 hover:text-slate-50" />Show Map
            </button>
          </a>
        </div>
      </Card>
  
      <!-- site id search-->
      <div class="grid grid-cols-4 items-center gap-2 mb-1">
        <div class="col-span-2">
          <Search
            size='sm'
            id="siteid-serch-input"
            class="flex items-center py-2"
            placeholder="Search Site ID..." 
            bind:value={sitebasicinfo} 
            on:keypress="{checkForEnter}"
          >
          </Search>
    
        </div>
        <Button size="xs" color="purple" class="rounded-md" on:click={resetFilters}>
          <Icon icon="ri:restart-line" /> <span class="ms-2 whitespace-nowrap">Reset Filter</span>
        </Button>    
      </div>
  
      <!-- Table-->
      <div class="flex flex-col col-span-4 pr-3">
        <Table shadow={true} hoverable={true} customeColor="bg-gray-700" class="w-full">
          <TableHead>
            <TableHeadCell class="py-2 text-xs text-center">BAND</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">SITEID</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">CELL AVAIL</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">ATTACH SETUP</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">RRC SETUP</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">eRAB SETUP</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">VOLTE SETUP</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">CALL DROPT</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">VLOTE DROP</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">HSOR INTRA</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">HSOR INTER</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">X2 OUT</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">X2 IN</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">DL BLER</TableHeadCell>
            <TableHeadCell class="py-2 text-xs text-center">UL BLER</TableHeadCell>
          </TableHead>
    
          <TableBody tableBodyClass="border-none">
            {#each data.statisticData.data.results as statistic}
            <TableBodyRow color="default" class="border-b border-gray-500/50">
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="text-slate-500">{statistic.band}</span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <Button class="text-slate-900 py-1 px-1 text-xs w-full" size="xs" color="green">{statistic.uid.substring(2)}</Button>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.cell_availability < 99 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.cell_availability).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.attach_setup_success_rate < 99 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.attach_setup_success_rate).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.rrc_setup_success_rate < 99 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.rrc_setup_success_rate).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.erab_setup_success_rate_ngbr < 99 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.erab_setup_success_rate_ngbr).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.volte_setup_success_rate_gbr < 99 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.volte_setup_success_rate_gbr).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.call_drop_rate_erab_ngbr >= 1  ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.call_drop_rate_erab_ngbr).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.volte_call_drop_rate_erab_gbr >= 1 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.volte_call_drop_rate_erab_gbr).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.hosr_intra_frequency < 99 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.hosr_intra_frequency).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.hosr_inter_frequency < 99 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.hosr_inter_frequency).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.x2_handover_out_success_rate < 99 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.x2_handover_out_success_rate).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.x2_handover_in_success_rate < 99 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.x2_handover_in_success_rate).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.dl_bler >= 1 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.dl_bler).toFixed(1)}
                </span>
              </TableBodyCell>
              <TableBodyCell tdClass="py-2 text-xs text-center">
                <span class="{statistic.ul_bler >= 1 ? 'text-rose-400' : 'text-slate-500'}">
                  {parseFloat(statistic.ul_bler).toFixed(1)}
                </span>
              </TableBodyCell>
            </TableBodyRow>
            {/each}
          </TableBody>
        </Table>
        
        <!-- Pagination -->
        <PaginationComponent bind:totalPages={totalPages} bind:activePage={activePage} bind:limit={limit} bind:paginationurl={paginationurl} filterParams={{sitebasicinfo, band, region, year, weeknum, cell_availability, attach_setup_rate, rrc_setup_rate, erab_setup_rate_ngbr, volte_setup_rate_gbr, call_drop_rate_erab_ngbr, volte_call_drop_rate_erab_gbr, hosr_intra_frequency, hosr_inter_frequency, x2_handover_out_rate, x2_handover_in_rate, s1_handover_in_rate, s1_handover_out_rate, dl_bler, ul_bler}} />
      
      </div>  
    </div>
</div>


<Toaster />