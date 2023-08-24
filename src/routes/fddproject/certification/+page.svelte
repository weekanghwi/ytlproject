<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Breadcrumb, BreadcrumbItem, Button, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Tooltip, Search } from "flowbite-svelte";
  import Icon from '@iconify/svelte';
  
  import PaginationComponent from '../../../components/PaginationComponent.svelte';
  import DropdownMulti from '../../../components/DropdownMulti.svelte';
  
  export let data;

  // Pagination variables
  let paginationurl = 'fddproject/certification'
  let sitebasicinfo = '';
  let contracttype = '';
  let regions = '';
  let opt_approval_date = '';
  let pac_submit_date = '';
  let fac_submit_date = '';
  let pac_status = '';
  let fac_status = '';

  let limit = Number($page.url.searchParams.get('limit')) || 5;
  $: totalPages = (Number(data?.reldata?.totalPages) || 0);
  $: activePage = (Number($page.url.searchParams.get('offset')) || 0) / limit;

  // Search
  async function search() {
    let params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', '0');
    params.set('sitebasicinfo', sitebasicinfo);
    params.set('contracttype', contracttype);
    params.set('regions', regions);
    params.set('opt_approval_date', opt_approval_date);
    params.set('pac_submit_date', pac_submit_date);
    params.set('fac_submit_date', fac_submit_date);
    params.set('pac_status', pac_status);
    params.set('fac_status', fac_status);
    goto(`/${paginationurl}/?${params.toString()}`);
  }

  function resetFilters() {
    sitebasicinfo = '';
    contracttype = '';
    regions = '';
    opt_approval_date = '';
    pac_submit_date = '';
    fac_submit_date = '';
    pac_status = '';
    fac_status = '';
    search();
  }

  function checkForEnter(event) {
    if (event.keyCode === 13) {
      search();
    }
  }

  // Modal
  let siteId = '';
  let certiCreateModal = false
  let certiUpdateModal = false
  let certiDeleteModal = false

</script>

<div class="p-2 w-full pt-2">
  <!-- Breadcrumb -->
  <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/fddproject">FDD Project</BreadcrumbItem>
    <BreadcrumbItem>Certification</BreadcrumbItem>
  </Breadcrumb>

  <!-- Table Title -->
  <div class="flex items-center gap-4 mb-3">
    <h5 class="text-2xl text-gray-800 dark:text-gray-300">Certification Information</h5>
    <Button 
      size="sm" 
      color="purple" 
      class="py-1.5 px-3"
      on:click={() => {certiCreateModal=true}}
    >
      <Icon icon="system-uicons:button-add" class="text-2xl me-2" /> Add new Certi info
    </Button>
  </div>

  <!-- search -->
  <div class="flex flex-col mb-4">
    <!-- Default Filter-->
    <div class="flex items-center gap-2 w-full mb-2">
      <div class="grid grid-cols-7 items-center w-full gap-2">
        <div class="col-span-2">
          <Search size='md' class="flex gap-2 items-center" placeholder="Search Site ID..." bind:value={sitebasicinfo} on:keypress="{checkForEnter}">
          </Search>
        </div>
    
        <DropdownMulti
          options={['Central', 'Northern', 'Southern', 'Eastern', 'Sabah', 'Sarawak']}
          bind:selectedOptions={regions}
          onOptionChange={search}
          placeholder="Region" 
        />
      
        <DropdownMulti
          options={['Confirm', 'ReUse', 'KIV', 'Drop', 'TDD Only', 'Reuse-Replace']}
          bind:selectedOptions={contracttype}
          onOptionChange={search}
          placeholder="Contract type" 
        />
        
        <div class="col-span-2 space-x-1">
          <Button size="sm" color="light" on:click={search}>
            <Icon icon="ri:search-line" /> <span class="ms-2">Search</span>
          </Button>
        
          <Button size="sm" color="purple" class="rounded-md" on:click={resetFilters}>
            <Icon icon="ri:restart-line" /> <span class="ms-2 whitespace-nowrap">Reset Filter</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- SSV Activity Filter-->
    <div class="flex items-center gap-2 w-full">
      <div class="grid grid-cols-7 items-center w-full gap-2">
        <DropdownMulti
          options={['Null', 'Not Null']}
          bind:selectedOptions={pac_submit_date}
          onOptionChange={search}
          placeholder="PAC Submit" 
        />

        <DropdownMulti
          options={['SSO', 'CLOPT', 'IBS', 'Dismantle', 'TDD']}
          bind:selectedOptions={fac_submit_date}
          onOptionChange={search}
          placeholder="FAC Submit" 
        />

        <DropdownMulti
          options={['Dato Approved', 'Pending Dato Approval', 'Pending SeckFoo Approval']}
          bind:selectedOptions={pac_status}
          onOptionChange={search}
          placeholder="PAC Status" 
        />
      
        <DropdownMulti
          options={['Dato Approved', 'Pending Dato Approval', 'Pending SeckFoo Approval']}
          bind:selectedOptions={fac_status}
          onOptionChange={search}
          placeholder="FAC Status" 
        />
      </div>
    </div>
    
    <!-- Report relative Filter-->
  </div>

  <!-- Table -->
  <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
    <TableHead>
      <TableHeadCell class="py-4 text-sm">Site ID</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Contract Type</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">PAC Submit</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">FAC Submit</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">PAC Status</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">FAC Status</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Action</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="border-none">
      {#each data.reldata.data.results as rellist}
        <TableBodyRow color="custom" class="dark:bg-gray-700/30 border-b border-gray-500/50">
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start">
              <span class="dark:text-gray-400">{rellist.certi.sitebasicinfo}</span>
              <span class="dark:text-gray-400 text-xs">{rellist.sitebasicinfo.regions}</span>
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">{rellist.sitebasicinfo.contracttype}</span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            {#if rellist.certi.pac_submit_date}
            <span class="dark:text-gray-400">{rellist.certi.pac_submit_date}</span>
            {/if}
          </TableBodyCell>
          <TableBodyCell class="py-2">
            {#if rellist.certi.fac_submit_date}
            <span class="dark:text-gray-400">{rellist.certi.fac_submit_date}</span>
            {/if}
          </TableBodyCell>
          <TableBodyCell class="py-2">
            {#if rellist.certi.pac_status}
            <span class="dark:text-gray-400">{rellist.certi.pac_status}</span>
            {/if}
          </TableBodyCell>
          <TableBodyCell class="py-2">
            {#if rellist.certi.fac_status}
            <span class="dark:text-gray-400">{rellist.certi.fac_status}</span>
            {/if}
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">
              <div class="flex gap-1">
                <span>
                  <Button size="sm" color="purple" class="rounded-md px-2">
                    <Icon icon="bx:detail" />
                  </Button>
                  <Tooltip color="green">Certi Info Detail</Tooltip>
                </span>

                <Button
                  on:click={() => {siteId = rellist.certi.id; certiUpdateModal = true}}
                  size="sm" 
                  class="rounded-md px-2 bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:border-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 dark:focus:ring-sky-400 dark:focus:border-sky-700"
                >
                  <Icon icon="ri:edit-line" />
                </Button>
                <Tooltip color="yellow">Certi Info Update</Tooltip>
    
                <Button
                  on:click={() => {siteId = rellist.certi.id; certiDeleteModal = true}}
                  size="sm" 
                  color="red" 
                  class="rounded-md px-2"
                >
                  <Icon icon="ri:delete-bin-line" />
                </Button>
                <Tooltip color="red">Certi Info Delete</Tooltip>
              </div>
            </span>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

  <!-- Pagination -->
  <PaginationComponent bind:totalPages={totalPages} bind:activePage={activePage} bind:limit={limit} bind:paginationurl={paginationurl} filterParams={{sitebasicinfo, contracttype, regions, opt_approval_date, pac_submit_date, fac_submit_date, pac_status, fac_status}} />
</div>