<script lang="ts">
  import { Search } from "flowbite-svelte";
  import { onMount } from "svelte";
  import toast, { Toaster } from 'svelte-french-toast'
  import PaginationSmall from "../../../components/PaginationSmall.svelte";
  import ClusterInfomationModal from "./ClusterInfoModal.svelte";

  export let region: string;
  export let field: string;

  let tableData: any[] = [];
  let cluster = '';
  let selectedCluster = '';
  let totalPages = 0;
  let activePage = 0;
  let limit = 5; // 초기 limit 값을 설정하세요.
  let band = '';

  async function fetchData(page: number = 0) {
    const apiEndPoint = 'http://10.24.8.120:8000/api/statisticcalcluster/';
    const queryParams = new URLSearchParams({
      region,
      cluster: selectedCluster,
      // band,
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
    if (event.key === 'Enter') {
      fetchData();
    }
  }
  
  function search() {
    activePage = 0;
    fetchData();
  }

  // CLUSTER INFORMATION MODAL
  let ClusterInfoModal = false
</script>

<div class="flex flex-col mb-4">
  <div class="flex mb-3 w-2/4 px-4">
    <Search size="sm" class="flex items-center rounded-sm py-1 bg-slate-900 border-none text-white" color="custom" placeholder="Cluster Name" bind:value={selectedCluster} on:keypress="{checkForEnter}">
    </Search>
  </div>
  <table class="w-full">
    <thead class="bg-slate-900/40">
      <tr class="text-slate-200 text-left">
        <th class="text-xs py-[6px] px-6 rounded-s-sm">Cluster</th>
        <th class="text-xs py-[6px] px-6">Week</th>
        <th class="text-xs py-[6px] px-6">Band</th>
        <th class="text-xs py-[6px] px-6 text-right rounded-e-sm">Value</th>
      </tr>
    </thead>
    <tbody>
      {#if tableData && Array.isArray(tableData)}
      {#each tableData as data}
        <tr class="text-left">
          <td class="text-xs py-3 px-6 text-slate-900 truncate w-[150px] inline-block">
            <button class="px-1 py-[2px] rounded-sm bg-blue-500 w-full"
              on:click={() => {band = data.band; cluster=data.cluster.trimStart(); region=region; field=field; ClusterInfoModal = true}}>
              {data.cluster}
            </button>
          </td>
          <td class="text-xs py-3 px-6 text-slate-300">{data.weeknum}</td>
          <td class="text-xs py-3 px-6 text-slate-300">
            <span class="{`text-gray-900 text-xs px-2 py-[1px] rounded-sm ${data.band === '2.3G' ? 'bg-sky-800' : (data.band === '2.6G' ? 'bg-sky-600' : 'bg-sky-400')}`}">
              {data.band}
            </span>
          </td>
          <td class="text-xs py-3 px-6 text-slate-300 text-right">
            <span class="{`font-bold ${data[field] >= 99 ?'text-green-500' : 'text-rose-400'}`}">
              {#if data[field] === null}
              -
              {:else}
              {data[field].toFixed(2)}
              {/if}
            </span>
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

<ClusterInfomationModal {band} {region} {cluster} {field} bind:ClusterInfoModal={ClusterInfoModal}/>

<Toaster />