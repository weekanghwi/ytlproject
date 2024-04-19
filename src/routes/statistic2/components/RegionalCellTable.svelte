<script lang="ts">
  import { Dropdown, DropdownItem, Search } from "flowbite-svelte";
  import { onMount } from "svelte";
  import toast, { Toaster } from 'svelte-french-toast'
  import PaginationSmall from "../../../components/PaginationSmall.svelte";
  import SiteInformationModal from "./SiteInfoModal.svelte";

  export let region: string;
  export let field: string;

  // let tableData: any[] = [];
  let tableData = '';
  let sitebasicinfo = '';
  let cluster = '';
  let band = '';
  let totalPages = 0;
  let activePage = 0;
  let limit = 5; // 초기 limit 값을 설정하세요.
  let dropdownOpen = false;
  let siteid = '';

  function selecteBand(selectedBand: string) {
    band = selectedBand;
    dropdownOpen = false;
    search();
  }

  async function fetchData(page: number = 0) {
    const apiEndPoint = 'http://10.24.8.120:8000/api/statistic/';
    const queryParams = new URLSearchParams({
      region,
      sitebasicinfo,
      cluster,
      band,
      limit: limit.toString(),
      offset: ((page - 1) * limit).toString()
    });

    try {
      const response = await fetch(`${apiEndPoint}?${queryParams}`);
      if (response.ok) {
        const { results, count } = await response.json();
        tableData = results;
        totalPages = Math.ceil(count / limit);
      } else {
        toast.error('Network response was not ok.');
      }
    } catch (error) {
      toast.error('Fail to fetch API data !!!');
    }
  }

  onMount(() => {
    fetchData(activePage);
  });

  function handlePageChange(event: CustomEvent) {
    const newPage = event.detail;
    activePage = newPage;
    fetchData(newPage);
  }

  function checkForEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      fetchData();
    }
  }
  
  function search() {
    activePage = 0;
    fetchData();
  }

  // SITE INFORMATION MODAL
  let SiteInfoModal = false
</script>

<div class="flex flex-col mb-4">
  <div class="flex items-center mb-3 px-4 gap-2">
    <div class="w-4/12">
      <Search size="sm" class="flex items-center rounded-sm py-1 bg-slate-900 border-none text-white" color="custom" placeholder="Site ID" bind:value={sitebasicinfo} on:keypress="{checkForEnter}">
      </Search>
    </div>
    <div class="w-4/12">
      <Search size="sm" class="flex items-center rounded-sm py-1 bg-slate-900 border-none text-white" color="custom" placeholder="Cluster" bind:value={cluster} on:keypress="{checkForEnter}">
      </Search>
    </div>
    <div class="w-3/12">
      <button class="rounded-sm bg-slate-900 px-6 py-1 text-white text-xs">Bands</button>
      <!-- {#if isOpen} -->
      <Dropdown headerClass="py-1 rounded-t-sm" footerClass="py-1 rounded-b-sm" bind:open={dropdownOpen}>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-800" on:click={() => selecteBand('2.3GHz')}>2.3GHz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-600" on:click={() => selecteBand('2.6GHz')}>2.6GHz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteBand('800M')}>800MHz</DropdownItem>
      </Dropdown>
      <!-- {/if} -->
    </div>

  </div>
  <table class="w-full">
    <thead class="bg-slate-900/40">
      <tr class="text-slate-200 text-left">
        <th class="text-xs py-[6px] px-6">Site ID</th>
        <th class="text-xs py-[6px] px-6">Cell ID</th>
        <th class="text-xs py-[6px] px-6">Cluster</th>
        <th class="text-xs py-[6px] px-6">Band</th>
        <th class="text-xs py-[6px] px-6 text-right">Value</th>
        <th class="text-xs py-[6px] px-6 text-right">Stat Info</th>
      </tr>
    </thead>
    <tbody>
      {#if tableData && Array.isArray(tableData)}
        {#each tableData as data}
        <tr class="text-left">
          <td class="text-xs py-3 px-6 text-slate-300">{data.sitebasicinfo_details.siteid}</td>
          <td class="text-xs py-3 px-6 text-slate-300">
            {#if !data.sitephyinfo_details}
              -
            {:else}
              {data.sitephyinfo_details.secid}
            {/if}
          </td>
          <td class="text-xs py-3 px-6 text-slate-300">{data.sitebasicinfo_details.cluster}</td>
          <td class="text-xs py-3 px-6 text-slate-300">
            <span class="{`text-gray-900 text-xs px-2 py-[1px] rounded-sm ${data.band === '2.3GHz' ? 'bg-sky-800 text-white' : (data.band === '2.6GHz' ? 'bg-sky-600' : 'bg-sky-400')}`}">
              {data.band}
            </span>
          </td>
          <td class="text-xs py-3 px-6 text-slate-300 text-right">
            <span class="{`font-bold ${data[field] >= 99 ?'text-green-500' : 'text-rose-400'}`}">
              {#if !data[field]}
                -
              {:else}
              {data[field].toFixed(2)}
              {/if}
            </span>
          </td>
          <td class="text-xs py-3 px-6 text-slate-300 text-right">
            <button class="px-2 py-[2px] rounded-sm bg-gray-500 text-black hover:bg-blue-500 active:bg-blue-500"
            on:click={() => {siteid=data.uid; field=field; band=data.band; SiteInfoModal = true}}>
              Info
            </button>
          </td>
        </tr>
        {/each}
      {/if}
    </tbody>
  </table>

  <div class="flex items-end justify-end w-full pe-2">
    <PaginationSmall
      {totalPages}
      bind:activePage
      on:change={handlePageChange} />
  </div>

</div>

<SiteInformationModal {siteid} {field} {band} bind:SiteInfoModal={SiteInfoModal} />

<style>
  .regiondropdown {
    z-index: 1000;
  }
</style>

<Toaster />