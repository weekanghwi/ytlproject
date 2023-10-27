<script lang="ts">
  import { page } from '$app/stores';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Search, Button, Breadcrumb, BreadcrumbItem, Tooltip } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';

  import PaginationComponent from '../../../components/PaginationComponent.svelte';
  import DropdownMulti from '../../../components/DropdownMulti.svelte';
	import CreateModal from './crud/CreateModal.svelte';
  import UpdateModal from './crud/UpdateModal.svelte';
  import DeleteModal from './crud/DeleteModal.svelte';


  export let data;

  let paginationurl = 'fddproject/sitelist'
  let q = '';
  let cluster = '';
  let region = '';
  let state = '';
  let contracttype = '';
  let siteconfig = '';
  let btsmanager_count = ''
  let antennatypes = ''

  // Pagination
  let limit = Number($page.url.searchParams.get('limit')) || 5;
  $: totalPages = (Number(data?.sitelists?.totalPages) || 0);
  $: activePage = (Number($page.url.searchParams.get('offset')) || 0) / limit;

  async function search() {
    let params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', '0');
    params.set('q', q);
    params.set('cluster', cluster);
    params.set('region', region);
    params.set('state', state);
    params.set('contracttype', contracttype);
    params.set('siteconfig', siteconfig);
    params.set('btsmanager_count', btsmanager_count);
    params.set('antennatypes', antennatypes);
    goto(`/${paginationurl}/?${params.toString()}`);
  }

  function resetFilters() {
    q = '';
    cluster = '';
    region = '';
    state = '';
    contracttype = '';
    siteconfig = '';
    btsmanager_count = '';
    antennatypes = ''
    search();
  }

  function checkForEnter(event) {
    if (event.keyCode === 13) {
      search();
    }
  }

  let stateOptions:any = [];
  async function fetchStates(region) {
    const url = region
      ? `http://10.24.8.120:8000/api/state/?region=${region}`
      : `http://10.24.8.120:8000/api/state/`
    const res = await fetch(url)
    const data = await res.json()
    return data.results.map(state => state.state)
  }
  $: if (region) {
    fetchStates(region).then(states => {
      stateOptions = states;
    });
  }

  let siteUpdateModal = false
  let siteCreateModal = false
  let siteDeleteModal = false
  let siteId = '';

</script>

<div class="p-2 w-full pt-2">
  <!-- Breadcrumb -->
  <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/fddproject">FDD Project</BreadcrumbItem>
    <BreadcrumbItem>Site Lsit</BreadcrumbItem>
  </Breadcrumb>

  <!-- Table Title -->
  <div class="flex items-center gap-4 mb-3">
    <h5 class="text-2xl text-gray-800 dark:text-gray-300">Base site information</h5>
    <Button 
      size="sm" 
      color="purple" 
      class="py-1.5 px-3"
      on:click={() => {siteCreateModal=true}}
    >
      <Icon icon="system-uicons:button-add" class="text-2xl me-2" /> Add new site
    </Button>
  </div>

  <!-- search -->
  <div class="grid grid-cols-8 items-center gap-2 mb-1 full">
    <div class="col-span-2">
      <Search size='md' class="flex gap-2 items-center" placeholder="Search Site ID or Name ..." bind:value={q} on:keypress="{checkForEnter}">
      </Search>
    </div>

    <div class="col-span-2">
      <Search size='md' class="flex gap-2 items-center" placeholder="Search cluster ..." bind:value={cluster} on:keypress="{checkForEnter}">
      </Search>
    </div>

    <DropdownMulti
      options={['Central', 'Northern', 'Southern', 'Eastern', 'Sabah', 'Sarawak']}
      bind:selectedOptions={region}
      onOptionChange={search}
      placeholder="Region" 
    />

    <DropdownMulti
      options={stateOptions}
      bind:selectedOptions={state}
      onOptionChange={search}
      placeholder="State" 
    />

    <DropdownMulti
      options={['Confirm', 'Reuse_Material', 'KIV', 'Drop', 'TDD Only', 'Reuse_Replace']}
      bind:selectedOptions={contracttype}
      onOptionChange={search}
      placeholder="Contract type" 
    />

    <DropdownMulti
      options={['L23', 'L23+L26', 'L23+L800', 'L23+L26+L800', 'L26', 'L26+L800', 'L800']}
      bind:selectedOptions={siteconfig}
      onOptionChange={search}
      placeholder="Site Config" 
    />
  </div>

  <div class="grid grid-cols-8 gap-2 mb-4 full">
    <DropdownMulti
      options={['Null', 'Not Null']}
      bind:selectedOptions={btsmanager_count}
      onOptionChange={search}
      placeholder="LSM Info" 
    />

    <div class="col-span-2">
      <DropdownMulti
        options={['Updated', 'Pending']}
        bind:selectedOptions={antennatypes}
        onOptionChange={search}
        placeholder="Phyinfo Update Status" 
      />
    </div>
    
    <Button size="sm" color="light" on:click={search}>
      <Icon icon="ri:search-line" /> <span class="ms-2">Search</span>
    </Button>

    <Button size="sm" color="purple" class="rounded-md" on:click={resetFilters}>
      <Icon icon="ri:restart-line" /> <span class="ms-2 whitespace-nowrap">Reset Filter</span>
    </Button>
  </div>

  <!-- Table -->
  <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
    <TableHead>
      <TableHeadCell class="py-4 text-sm">Site ID</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Cluster</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Region</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">state</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Contract Type</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Site Config</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Operation</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Action</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="border-none">
      {#each data.sitelists.data.results as sites}
        <TableBodyRow color="custom" class="dark:bg-gray-700/30 border-b border-gray-500/50">
          <TableBodyCell class="flex flex-col py-2">
            <span class="text-sm dark:text-gray-400">{sites.siteid}</span>
            <span class="text-xs dark:text-gray-500 truncate w-[160px] inline-block">{sites.sitename}</span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400 truncate w-[160px] inline-block">{sites.cluster}</span>
          </TableBodyCell>
          <TableBodyCell class="py-2"><span class="dark:text-gray-400">{sites.region}</span></TableBodyCell>
          <TableBodyCell class="py-2"><span class="dark:text-gray-400">{sites.state}</span></TableBodyCell>
          <TableBodyCell class="py-2"><span class="dark:text-gray-400">{sites.contracttype}</span></TableBodyCell>
          <TableBodyCell class="py-2"><span class="dark:text-gray-400">{sites.siteconfig}</span></TableBodyCell>
          <TableBodyCell class="py-2"><span class="dark:text-gray-400">
            <div class="flex items-center gap-2">
              {#if sites.btsmanager_count}
                <p class="rounded-full h-6 w-6 ring-1 ring-lime-400 flex items-center justify-center">
                  <Icon icon="akar-icons:gear" class="text-lime-400" />
                  <Tooltip placement="right" defaultClass="bg-slate-700 text-xs text-lime-400 py-1 px-2" type="custom">In LSM</Tooltip>
                </p>
              {:else}
                <p class="rounded-full h-6 w-6 ring-1 ring-rose-400 flex items-center justify-center">
                  <Icon icon="pepicons-pop:gear-off" class="text-rose-400" />
                  <Tooltip placement="right" defaultClass="bg-slate-700 text-xs text-rose-400 py-1 px-2" type="custom">No LSM Data</Tooltip>
                </p>
              {/if}
              {#if sites.antennatypes === 'Updated' && sites.btsmanager_count > 0}
                <p class="text-lime-400 text-xs">{sites.antennatypes}</p>
              {:else}
                <p class="text-rose-400 text-xs">{sites.antennatypes}</p>
              {/if}
            </div>
          </span></TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">
              <div class="flex gap-1">
                <a href="/fddproject/sitelist/{sites.id}">
                  <Button size="sm" color="purple" class="rounded-md px-2">
                    <Icon icon="bx:detail" />
                  </Button>
                  <Tooltip color="green">Site Detail</Tooltip>
                </a>
                <Button
                  on:click={() => {siteId = sites.id; siteUpdateModal = true}}
                  size="sm" 
                  class="rounded-md px-2 bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600"
                >
                  <Icon icon="ri:edit-line" />
                </Button>
                <Tooltip color="yellow">Site Update</Tooltip>
    
                <Button
                  on:click={() => {siteId = sites.id; siteDeleteModal = true}}
                  size="sm" 
                  color="red" 
                  class="rounded-md px-2"
                >
                  <Icon icon="ri:delete-bin-line" />
                </Button>
                <Tooltip color="red">Site Delete</Tooltip>
              </div>
            </span>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
  
  <!-- Pagination -->
  <PaginationComponent bind:totalPages={totalPages} bind:activePage={activePage} bind:limit={limit} bind:paginationurl={paginationurl} filterParams={{q, cluster, region, state, contracttype, siteconfig, btsmanager_count, antennatypes}} />
  
</div>

  <!-- CRUD Modal -->
  <CreateModal
    bind:siteCreateModal={siteCreateModal}
    on:siteCreated={search}
  />
  <UpdateModal
    bind:siteUpdateModal={siteUpdateModal} {siteId}
    on:siteUpdated={search}
  />
  <DeleteModal
    bind:siteDeleteModal={siteDeleteModal} {siteId}
    on:siteDeleted={search}
  />