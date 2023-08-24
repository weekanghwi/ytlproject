<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Breadcrumb, BreadcrumbItem, Button, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Tooltip, Search } from "flowbite-svelte";
  import Icon from '@iconify/svelte';
  
  import PaginationComponent from '../../../components/PaginationComponent.svelte';
  import DropdownMulti from '../../../components/DropdownMulti.svelte';
  
  export let data;


  const subconName = data.reldata.subcon.results
    .filter((item:any) => item.subcon_category == 'Optimization')
    .map((item:any) => item.subcon_name)
  let subconOptions: string[] = subconName

  // Pagination variables
  let paginationurl = 'fddproject/optimization'
  let sitebasicinfo = '';
  let contracttype = '';
  let regions = '';
  let ssv_complete_date = '';
  let optcategory = '';
  let opt_start_date = '';
  let opt_complete_date = '';
  let opt_submit_date = '';
  let opt_approval_date = '';
  let optsubcon = '';
  let onair_date = 'Not Null'

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
    params.set('ssv_complete_date', ssv_complete_date);
    params.set('optcategory', optcategory);
    params.set('opt_start_date', opt_start_date);
    params.set('opt_complete_date', opt_complete_date);
    params.set('opt_submit_date', opt_submit_date);
    params.set('opt_approval_date', opt_approval_date);
    params.set('optsubcon', optsubcon);
    params.set('onair_date', onair_date);
    goto(`/${paginationurl}/?${params.toString()}`);
  }

  function resetFilters() {
    sitebasicinfo = '';
    contracttype = '';
    regions = '';
    ssv_complete_date = '';
    optcategory = '';
    opt_start_date = '';
    opt_complete_date = '';
    opt_submit_date = '';
    opt_approval_date = '';
    optsubcon = '';
    onair_date = 'Not Null';
    search();
  }

  function checkForEnter(event) {
    if (event.keyCode === 13) {
      search();
    }
  }

  // Modal
  let siteId = '';
  let optCreateModal = false
  let optUpdateModal = false
  let optDeleteModal = false

</script>

<div class="p-2 w-full pt-2">
  <!-- Breadcrumb -->
  <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/fddproject">FDD Project</BreadcrumbItem>
    <BreadcrumbItem>SSV Information</BreadcrumbItem>
  </Breadcrumb>

  <!-- Table Title -->
  <div class="flex items-center gap-4 mb-3">
    <h5 class="text-2xl text-gray-800 dark:text-gray-300">Optimization Information</h5>
    <Button 
      size="sm" 
      color="purple" 
      class="py-1.5 px-3"
      on:click={() => {optCreateModal=true}}
    >
      <Icon icon="system-uicons:button-add" class="text-2xl me-2" /> Add new OPT info
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
    
        <DropdownMulti
          options={subconOptions}
          bind:selectedOptions={optsubcon}
          onOptionChange={search}
          placeholder="Sub-Contractor" 
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
          bind:selectedOptions={ssv_complete_date}
          onOptionChange={search}
          placeholder="SSV Complete" 
        />

        <DropdownMulti
          options={['SSO', 'CLOPT', 'IBS', 'Dismantle', 'TDD']}
          bind:selectedOptions={optcategory}
          onOptionChange={search}
          placeholder="OPT Category" 
        />

        <DropdownMulti
          options={['Null', 'Not Null']}
          bind:selectedOptions={opt_start_date}
          onOptionChange={search}
          placeholder="OPT Start" 
        />
      
        <DropdownMulti
          options={['Null', 'Not Null']}
          bind:selectedOptions={opt_complete_date}
          onOptionChange={search}
          placeholder="OPT Complete" 
        />
    
        <DropdownMulti
        options={['Null', 'Not Null']}
          bind:selectedOptions={opt_submit_date}
          onOptionChange={search}
          placeholder="OPT Submit" 
        />

        <DropdownMulti
        options={['Null', 'Not Null']}
          bind:selectedOptions={opt_approval_date}
          onOptionChange={search}
          placeholder="OPT Approve" 
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
      <TableHeadCell class="py-4 text-sm">OPT Category</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">SubCon</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">SSV Comp</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">OPTIMIZATION</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">REPORT</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Action</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="border-none">
      {#each data.reldata.data.results as rellist}
        <TableBodyRow color="custom" class="dark:bg-gray-700/30 border-b border-gray-500/50">
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start">
              <span class="dark:text-gray-400">{rellist.optinformation.sitebasicinfo}</span>
              <span class="dark:text-gray-400 text-xs">{rellist.sitebasicinfo.regions}</span>
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">{rellist.sitebasicinfo.contracttype}</span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            {#if rellist.optinformation.optcategory}
            <span class="dark:text-gray-400">{rellist.optinformation.optcategory}</span>
            {/if}
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                {#if rellist.optinformation.subcon}
                {rellist.optinformation.subcon}
                {/if}
              </span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            {#if rellist.ssvsection.ssv_complete_date}
            <span class="dark:text-gray-400">{rellist.ssvsection.ssv_complete_date}</span>
            {/if}
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.optinformation.opt_start_date}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="heroicons-outline:play" class="text-sky-500" />{rellist.optinformation.opt_start_date}
                <Tooltip color="green">OPT Start Date</Tooltip>
              </span>
              {/if}
              {#if rellist.optinformation.opt_complete_date}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="heroicons-outline:stop" class="text-green-500" />{rellist.optinformation.opt_complete_date}
                <Tooltip color="green">OPT Complete Date</Tooltip>
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.optinformation.opt_submit_date}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.optinformation.opt_submit_date}
                <Tooltip color="green">OPT Report Submit</Tooltip>
              </span>
              {/if}
              {#if rellist.optinformation.opt_approval_date}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-a-box-outline" class="text-sky-500" />{rellist.optinformation.opt_approval_date}
                <Tooltip color="green">OPT Report Approve</Tooltip>
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">
              <div class="flex gap-1">
                <span>
                  <Button size="sm" color="purple" class="rounded-md px-2">
                    <Icon icon="bx:detail" />
                  </Button>
                  <Tooltip color="green">OPT Info Detail</Tooltip>
                </span>

                <Button
                  on:click={() => {siteId = rellist.optinformation.id; optUpdateModal = true}}
                  size="sm" 
                  class="rounded-md px-2 bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:border-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 dark:focus:ring-sky-400 dark:focus:border-sky-700"
                >
                  <Icon icon="ri:edit-line" />
                </Button>
                <Tooltip color="yellow">OPT Info Update</Tooltip>
    
                <Button
                  on:click={() => {siteId = rellist.optinformation.id; optDeleteModal = true}}
                  size="sm" 
                  color="red" 
                  class="rounded-md px-2"
                >
                  <Icon icon="ri:delete-bin-line" />
                </Button>
                <Tooltip color="red">OPT Info Delete</Tooltip>
              </div>
            </span>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

  <!-- Pagination -->
  <PaginationComponent bind:totalPages={totalPages} bind:activePage={activePage} bind:limit={limit} bind:paginationurl={paginationurl} filterParams={{sitebasicinfo, contracttype, regions, ssv_complete_date, optcategory, opt_start_date, opt_complete_date, opt_submit_date, opt_approval_date, optsubcon, onair_date}} />
</div>