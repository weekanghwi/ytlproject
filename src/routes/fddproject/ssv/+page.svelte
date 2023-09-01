<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Breadcrumb, BreadcrumbItem, Button, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Tooltip, Search } from "flowbite-svelte";
  import Icon from '@iconify/svelte';
  
  import PaginationComponent from '../../../components/PaginationComponent.svelte';
  import DropdownMulti from '../../../components/DropdownMulti.svelte';
  import SSVdetailDrawer from './detail/SSVdetailDrawer.svelte';
  
  export let data;


  const subconName = data.reldata.subcon.results
    .filter((item:any) => item.type == 'Service')
    .map((item:any) => item.subcon)
  let subconOptions: string[] = subconName

  // Pagination variables
  let paginationurl = 'fddproject/ssv'
  let sitebasicinfo = '';
  let contracttype = '';
  let region = '';
  let oaairdate = '';
  let ssvstartdate = '';
  let ssvcompletedate = '';
  let ssvsubmitdate = '';
  let bsreceivedate = '';
  let bssubmitdate = '';
  let bsapprovedate = '';
  let icsubmitdate = '';
  let ssvsubcon = '';

  let limit = Number($page.url.searchParams.get('limit')) || 5;
  $: totalPages = (Number(data?.reldata?.totalPages) || 0);
  $: activePage = (Number($page.url.searchParams.get('offset')) || 0) / limit;

  //Drawer
  let ssvdetaildrawer = true;
  let selectedRellist: any = {};

  function showDrawer(rellist) {
    selectedRellist = rellist;
    ssvdetaildrawer = false;
  }

  // Search
  async function search() {
    let params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', '0');
    params.set('sitebasicinfo', sitebasicinfo);
    params.set('contracttype', contracttype);
    params.set('region', region);
    params.set('oaairdate', oaairdate);
    params.set('ssvstartdate', ssvstartdate);
    params.set('ssvcompletedate', ssvcompletedate);
    params.set('ssvsubmitdate', ssvsubmitdate);
    params.set('bsreceivedate', bsreceivedate);
    params.set('bssubmitdate', bssubmitdate);
    params.set('bsapprovedate', bsapprovedate);
    params.set('icsubmitdate', icsubmitdate);
    params.set('ssvsubcon', ssvsubcon);
    goto(`/${paginationurl}/?${params.toString()}`);
  }

  function resetFilters() {
    sitebasicinfo = '';
    contracttype = '';
    region = '';
    oaairdate = '';
    ssvstartdate = '';
    ssvcompletedate = '';
    ssvsubmitdate = '';
    bsreceivedate = '';
    bssubmitdate = '';
    bsapprovedate = '';
    icsubmitdate = '';
    ssvsubcon = '';
    search();
  }

  function checkForEnter(event) {
    if (event.keyCode === 13) {
      search();
    }
  }

  // Modal
  let siteId = '';
  let ssvCreateModal = false
  let ssvUpdateModal = false
  let ssvDeleteModal = false

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
    <h5 class="text-2xl text-gray-800 dark:text-gray-300">SSV Information</h5>
    <Button 
      size="sm" 
      color="purple" 
      class="py-1.5 px-3"
      on:click={() => {ssvCreateModal=true}}
    >
      <Icon icon="system-uicons:button-add" class="text-2xl me-2" /> Add new SSV info
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
          bind:selectedOptions={region}
          onOptionChange={search}
          placeholder="Region" 
        />
      
        <DropdownMulti
          options={['Confirm', 'ReUse', 'KIV', 'Drop', 'TDD Only', 'Reuse_Replace']}
          bind:selectedOptions={contracttype}
          onOptionChange={search}
          placeholder="Contract type" 
        />
    
        <DropdownMulti
          options={subconOptions}
          bind:selectedOptions={ssvsubcon}
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
          bind:selectedOptions={oaairdate}
          onOptionChange={search}
          placeholder="OnAir" 
        />

        <DropdownMulti
          options={['Null', 'Not Null']}
          bind:selectedOptions={ssvstartdate}
          onOptionChange={search}
          placeholder="SSV Start" 
        />
      
        <DropdownMulti
          options={['Null', 'Not Null']}
          bind:selectedOptions={ssvcompletedate}
          onOptionChange={search}
          placeholder="SSV Complete" 
        />
    
        <DropdownMulti
        options={['Null', 'Not Null']}
          bind:selectedOptions={ssvsubmitdate}
          onOptionChange={search}
          placeholder="SSV Submit" 
        />

        <DropdownMulti
        options={['Null', 'Not Null']}
          bind:selectedOptions={bssubmitdate}
          onOptionChange={search}
          placeholder="BS Submit" 
        />

        <DropdownMulti
        options={['Null', 'Not Null']}
          bind:selectedOptions={bsapprovedate}
          onOptionChange={search}
          placeholder="BS Approve" 
        />

        <DropdownMulti
        options={['Null', 'Not Null']}
          bind:selectedOptions={icsubmitdate}
          onOptionChange={search}
          placeholder="I&C Submit" 
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
      <TableHeadCell class="py-4 text-sm">SubCon</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">OnAir</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">SSV</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">SSV Report</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">BS Report</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">I&C Submit</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Action</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="border-none">
      {#each data.reldata.data.results as rellist}
        <TableBodyRow color="custom" class="dark:bg-gray-700/30 border-b border-gray-500/50">
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start">
              <span class="dark:text-gray-400">{rellist.ssv.sitebasicinfo}</span>
              <span class="dark:text-gray-400 text-xs">{rellist.sitebasicinfo.region}</span>
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">{rellist.sitebasicinfo.contracttype}</span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                {#if rellist.ssv.ssvsubcon}
                {rellist.ssv.ssvsubcon}
                {/if}
              </span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                {#if rellist.install.oaairdate}
                <div class="flex items-center gap-1 rounded-md bg-lime-400 py-0.5 px-2">
                  <Icon icon="pepicons-pop:wifi-circle" class="me-1 text-xs text-slate-900"/>
                  <small class="text-xs text-slate-900">OnAir</small>
                </div>
                {:else}
                <div class="flex items-center gap-1 rounded-md bg-rose-400 py-0.5 px-2">
                  <Icon icon="clarity:no-wifi-solid" class="me-1 text-xs text-slate-900"/>
                  <small class="text-xs text-slate-900">Not OnAir</small>
                </div>
                {/if}
              </span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.ssv.ssvstartdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="heroicons-outline:play" class="text-sky-500" />{rellist.ssv.ssvstartdate}
                <Tooltip color="green">SSV Start Date</Tooltip>
              </span>
              {/if}
              {#if rellist.ssv.ssvcompletedate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="heroicons-outline:stop" class="text-green-500" />{rellist.ssv.ssvcompletedate}
                <Tooltip color="green">SSV Complete Date</Tooltip>
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.ssv.ssvsubmitdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                {rellist.ssv.ssvsubmitdate}
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.ssv.bssubmitdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.ssv.bssubmitdate}
                <Tooltip color="green">BS Report Submit</Tooltip>
              </span>
              {/if}
              {#if rellist.ssv.bsapprovedate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-a-box-outline" class="text-sky-500" />{rellist.ssv.bsapprovedate}
                <Tooltip color="green">BS Report Approve</Tooltip>
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.ssv.icsubmitdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                {rellist.ssv.icsubmitdate}
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
                  <Tooltip color="green">SSV Info Detail</Tooltip>
                </span>

                <Button
                  on:click={() => {siteId = rellist.ssv.id; ssvUpdateModal = true}}
                  size="sm" 
                  class="rounded-md px-2 bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600"
                >
                  <Icon icon="ri:edit-line" />
                </Button>
                <Tooltip color="yellow">SSV Info Update</Tooltip>
    
                <Button
                  on:click={() => {siteId = rellist.ssv.id; ssvDeleteModal = true}}
                  size="sm" 
                  color="red" 
                  class="rounded-md px-2"
                >
                  <Icon icon="ri:delete-bin-line" />
                </Button>
                <Tooltip color="red">SSV Info Delete</Tooltip>
              </div>
            </span>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

  <!-- Pagination -->
  <PaginationComponent bind:totalPages={totalPages} bind:activePage={activePage} bind:limit={limit} bind:paginationurl={paginationurl} filterParams={{sitebasicinfo, contracttype, region, oaairdate, ssvstartdate, ssvcompletedate, ssvsubmitdate, bsreceivedate, bssubmitdate, bsapprovedate, icsubmitdate, ssvsubcon}} />

  <!-- Drawer -->
  <SSVdetailDrawer bind:ssvdetaildrawer={ssvdetaildrawer} {selectedRellist} />
</div>