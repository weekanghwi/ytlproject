<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Breadcrumb, BreadcrumbItem, Button, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Tooltip, Search } from "flowbite-svelte";
  import Icon from '@iconify/svelte';
  
  import PaginationComponent from '../../../components/PaginationComponent.svelte';
  import DropdownMulti from '../../../components/DropdownMulti.svelte';
  import OptdetailDrawer from './detail/OptdetailDrawer.svelte';
  import UpdateoptModal from './crud/UpdateoptModal.svelte';
	import { fetchOPTReviewData } from './crud/crud';
  
  export let data;


  const optsubconName = data.reldata.subcon.results
    .filter((item:any) => item.type == 'Service')
    .map((item:any) => item.subcon)
  let optsubconOptions: string[] = optsubconName

  // Pagination variables
  let paginationurl = 'fddproject/optimization'
  let sitebasicinfo = '';
  let contracttype = '';
  let region = '';
  let ssvcompletedate = '';
  let opttype = '';
  let optstartdate = '';
  let optcompletedate = '';
  let optsubmitdate = '';
  let optapprovedate = '';
  let optsubcon = '';

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
    params.set('region', region);
    params.set('ssvcompletedate', ssvcompletedate);
    params.set('opttype', opttype);
    params.set('optstartdate', optstartdate);
    params.set('optcompletedate', optcompletedate);
    params.set('optsubmitdate', optsubmitdate);
    params.set('optapprovedate', optapprovedate);
    params.set('optsubcon', optsubcon);
    goto(`/${paginationurl}/?${params.toString()}`);
  }

  function resetFilters() {
    sitebasicinfo = '';
    contracttype = '';
    region = '';
    ssvcompletedate = '';
    opttype = '';
    optstartdate = '';
    optcompletedate = '';
    optsubmitdate = '';
    optapprovedate = '';
    optsubcon = '';
    search();
  }

  function checkForEnter(event) {
    if (event.keyCode === 13) {
      search();
    }
  }
  
  //Drawer
  let optdetaildrawer = true;
  let selectedRellist: any = {};
  let reviewtarget: string = '';
  let optReviewData: any = [];

  async function showDrawer(rellist: any) {
    reviewtarget = rellist.sitebasicinfo.siteid
    selectedRellist = rellist;
    try {
      const data = await fetchOPTReviewData(reviewtarget);
      optReviewData = data
      console.log('Fetched OPT Review data: ', optReviewData);
    } catch (error) {
      console.error('Failed to fetch OPT Review data:', error);
      optReviewData = [];
    }
    optdetaildrawer = false;
  }

  // Modal
  let siteId = '';
  let optUpdateModal = false

</script>

<div class="p-2 w-full pt-2">
  <!-- Breadcrumb -->
  <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/fddproject">FDD Project</BreadcrumbItem>
    <BreadcrumbItem>Optimization</BreadcrumbItem>
  </Breadcrumb>

  <!-- Table Title -->
  <div class="flex items-center gap-4 mb-3">
    <h5 class="text-2xl text-gray-800 dark:text-gray-300">Optimization Information</h5>
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
          bind:selectedOptions={region}
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
          options={optsubconOptions}
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
          bind:selectedOptions={ssvcompletedate}
          onOptionChange={search}
          placeholder="SSV Complete" 
        />

        <DropdownMulti
          options={['SSO', 'CLOPT', 'IBS', 'Dismantle', 'TDD']}
          bind:selectedOptions={opttype}
          onOptionChange={search}
          placeholder="OPT Category" 
        />

        <DropdownMulti
          options={['Null', 'Not Null']}
          bind:selectedOptions={optstartdate}
          onOptionChange={search}
          placeholder="OPT Start" 
        />
      
        <DropdownMulti
          options={['Null', 'Not Null']}
          bind:selectedOptions={optcompletedate}
          onOptionChange={search}
          placeholder="OPT Complete" 
        />
    
        <DropdownMulti
        options={['Null', 'Not Null']}
          bind:selectedOptions={optsubmitdate}
          onOptionChange={search}
          placeholder="OPT Submit" 
        />

        <DropdownMulti
        options={['Null', 'Not Null']}
          bind:selectedOptions={optapprovedate}
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
      <TableHeadCell class="py-4 text-sm">OPT Subcon</TableHeadCell>
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
              <span class="dark:text-gray-400">{rellist.optimization.sitebasicinfo}</span>
              <span class="dark:text-gray-400 text-xs">{rellist.sitebasicinfo.region}</span>
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">{rellist.sitebasicinfo.contracttype}</span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            {#if rellist.optimization.opttype}
            <span class="dark:text-gray-400">{rellist.optimization.opttype}</span>
            {/if}
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                {#if rellist.optimization.optsubcon}
                {rellist.optimization.optsubcon}
                {/if}
              </span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            {#if rellist.ssv.ssvcompletedate}
            <span class="dark:text-gray-400">{rellist.ssv.ssvcompletedate}</span>
            {/if}
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.optimization.optstartdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="heroicons-outline:play" class="text-sky-500" />{rellist.optimization.optstartdate}
                <Tooltip color="green">OPT Start Date</Tooltip>
              </span>
              {/if}
              {#if rellist.optimization.optcompletedate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="heroicons-outline:stop" class="text-green-500" />{rellist.optimization.optcompletedate}
                <Tooltip color="green">OPT Complete Date</Tooltip>
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.optimization.optsubmitdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.optimization.optsubmitdate}
                <Tooltip color="green">OPT Report Submit</Tooltip>
              </span>
              {/if}
              {#if rellist.optimization.optapprovedate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-a-box-outline" class="text-sky-500" />{rellist.optimization.optapprovedate}
                <Tooltip color="green">OPT Report Approve</Tooltip>
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">
              <div class="flex gap-1">
                <span>
                  <Button size="sm" color="purple" class="rounded-md px-2" on:click={() => showDrawer(rellist)}>
                    <Icon icon="bx:detail" />
                  </Button>
                  <Tooltip color="green">OPT Info Detail</Tooltip>
                </span>

                <Button
                  on:click={() => {siteId = rellist.optimization.id; optUpdateModal = true}}
                  size="sm" 
                  class="rounded-md px-2 bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:border-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 dark:focus:ring-sky-400 dark:focus:border-sky-700"
                >
                  <Icon icon="ri:edit-line" />
                </Button>
                <Tooltip color="yellow">OPT Info Update</Tooltip>
              </div>
            </span>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

  <!-- Pagination -->
  <PaginationComponent bind:totalPages={totalPages} bind:activePage={activePage} bind:limit={limit} bind:paginationurl={paginationurl} filterParams={{sitebasicinfo, contracttype, region, ssvcompletedate, opttype, optstartdate, optcompletedate, optsubmitdate, optapprovedate, optsubcon}} />

  <!-- Drawer -->
  <OptdetailDrawer bind:optdetaildrawer={optdetaildrawer} {selectedRellist} {optReviewData} {search} />

    <!-- Modal -->
  <UpdateoptModal 
    bind:optUpdateModal={optUpdateModal} {siteId} {search}
  />
</div>