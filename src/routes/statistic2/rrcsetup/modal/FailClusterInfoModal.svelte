<script lang="ts">
	import { Modal } from "flowbite-svelte";
  import Icon from '@iconify/svelte';
  import toast, { Toaster } from 'svelte-french-toast'
  import PaginationSmall from "../../../../components/PaginationSmall.svelte";
	import { onMount } from "svelte";

  export let FailClusterModal = false;
  export let band: string = '';
  export let field: string = '';
  // export let field: keyof typeof failClusterData.results[number] = ''
  export let region: string = '';

  let failClusterData: any = '';
  let totalPages = 0;
  let activePage = 0;
  let limit = 5; // 초기 limit 값을 설정하세요.

  function displayFieldData(item: typeof failClusterData.results[number]): string {
    if (field in item) {
      const value = item[field];
      if (typeof value === 'number') {
        return value.toFixed(2) + '%';
      }
      return value.toString();
    }
    return '';
  }

  async function fetchFailClusterInfo(page: number = 0) {
    const FailClusterAPIpoint = 'http://10.24.8.120:8000/api/failclusterinfo/';
    const queryParams = new URLSearchParams({
      region,
      band,
      field,
      limit: limit.toString(),
      offset: ((page - 1) * limit).toString()
    });

    try {
      const response = await fetch(`${FailClusterAPIpoint}?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        failClusterData = data;
        totalPages = Math.ceil(data.count / limit);
      } else {
        toast.error('Network response was not ok.');
      }
    } catch (error) {
      toast.error('Fail to fetch API data !!!');
    }
  }

  onMount(() => {
    fetchFailClusterInfo(activePage);
  });

  function handlePageChange(event: CustomEvent) {
    const newPage = event.detail;
    activePage = newPage;
    fetchFailClusterInfo(newPage);
  }

  function checkForEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      fetchFailClusterInfo();
    }
  }

  $: band, region, field, fetchFailClusterInfo();

</script>


<Modal backdropClass="bg-gray-900 bg-opacity-80" size="sm" bind:open={FailClusterModal}>
  <!-- MODAL TITLE -->
  <div class="flex flex-col mb-4">
    <div class="flex items-center gap-4">
      <Icon icon="zondicons:information-outline" class="text-4xl text-white" />
      <div class="flex flex-col">
        <h1 class="text-sm text-white">FAIL CLUASTER INFO</h1>
        <p class="text-xs text-slate-500 flex gap-2 items-center">
          Week11 fail cluster information for <span class="px-1 py-[2px] bg-sky-400 text-black rounded-md">{band}</span>
        </p>
      </div>
    </div>
  </div>

  <!-- CLUSTER COUNT INFORMATION -->
  <div class="flex flex-col gap-2">
    <h1 class="text-xs text-slate-500 text-center">{region.toLocaleUpperCase()} CLUSTER COUNT BY BAND</h1>
    <div class="flex justify-around">
      <div class="flex flex-col items-center">
        <h1 class="text-xs text-slate-500">2.3GHz</h1>
        <h1 class="text-2xl text-white font-bold">
          {#if failClusterData}
          {failClusterData.cluster_total.count[0]}
          {/if}
        </h1>
      </div>
      <div class="flex flex-col items-center">
        <h1 class="text-xs text-slate-500">2.6GHz</h1>
        <h1 class="text-2xl text-white font-bold">
          {#if failClusterData}
          {failClusterData.cluster_total.count[1]}
          {/if}
        </h1>
      </div>
      <div class="flex flex-col items-center">
        <h1 class="text-xs text-slate-500">800MHz</h1>
        <h1 class="text-2xl text-white font-bold">
          {#if failClusterData}
          {failClusterData.cluster_total.count[2]}
          {/if}
        </h1>
      </div>
    </div>
  </div>

  <!-- FAIL CLUSTER TABLE -->
  <div class="flex flex-col">
    {#if failClusterData.results && failClusterData.results.length > 0}
    <table>
      <thead>
        <tr class="text-sm bg-gray-950/20">
          <th class="py-2">Band</th>
          <th>Region</th>
          <th>Cluster</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody class="text-xs text-center">
        {#each failClusterData.results as list}
          <tr>
            <td class="py-2">{list.band}</td>
            <td>{list.region}</td>
            <td>{list.cluster}</td>
            <!-- <td>{(list.rrc_setup_success_rate).toFixed(2)}%</td> -->
            <td>{displayFieldData(list)}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="flex items-start justify-start w-full">
      <PaginationSmall
        {totalPages}
        bind:activePage
        on:change={handlePageChange} />
    </div>
    {:else}
      No fail Cluster
    {/if}
  </div>
</Modal>

<Toaster />