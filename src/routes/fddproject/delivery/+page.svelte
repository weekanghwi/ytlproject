<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { Breadcrumb, BreadcrumbItem, Button, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Tooltip, Search } from "flowbite-svelte";

  import DropdownMulti from '../../../components/DropdownMulti.svelte';
  import PaginationComponent from '../../../components/PaginationComponent.svelte';
  import DodetailDrawer from './detail/DodetailDrawer.svelte';
  import CreateDOModal from './crud/CreateDOModal.svelte';
  import UpdateDOModal from './crud/UpdateDOModal.svelte';

  export let data;

  // Pagination variables
  let paginationurl = 'fddproject/delivery'
  let sitebasicinfo = '';
  let contracttype = '';
  let doissuedate = '';
  let codsubmitdate = '';
  let codapprovedate = '';

  //Drawer
  let dodetaildrawer = true;
  let selectedRellist: any = {};

  // Modal
  let siteId = '';
  let doCreateModal = false
  let doUpdateModal = false
  let doDeleteModal = false

  // Pagination
  let limit = Number($page.url.searchParams.get('limit')) || 5;
  $: totalPages = (Number(data?.reldata?.totalPages) || 0);
  $: activePage = (Number($page.url.searchParams.get('offset')) || 0) / limit;

  async function search() {
    let params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', '0');
    params.set('sitebasicinfo', sitebasicinfo);
    params.set('contracttype', contracttype);
    params.set('doissuedate', doissuedate ? doissuedate.toString() : '');
    params.set('codsubmitdate', codsubmitdate);
    params.set('codapprovedate', codapprovedate);
    goto(`/${paginationurl}/?${params.toString()}`);
  }

  function resetFilters() {
    sitebasicinfo = '';
    contracttype = '';
    doissuedate = '';
    codsubmitdate = '';
    codapprovedate = '';
    search();
  }

  function checkForEnter(event) {
    if (event.keyCode === 13) {
      search();
    }
  }

  function showDrawer(rellist) {
    selectedRellist = rellist;
    dodetaildrawer = false;
  }

</script>

<div class="p-2 w-full pt-2">
  <!-- Breadcrumb -->
  <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/fddproject">FDD Project</BreadcrumbItem>
    <BreadcrumbItem>Material Delivery</BreadcrumbItem>
  </Breadcrumb>

  <!-- Table Title -->
  <div class="flex items-center gap-4 mb-3">
    <h5 class="text-2xl text-gray-800 dark:text-gray-300">Delivery Order Information</h5>
    <Button 
      size="sm" 
      color="purple" 
      class="py-1.5 px-3"
      on:click={() => {doCreateModal=true}}
    >
      <Icon icon="system-uicons:button-add" class="text-2xl me-2" /> Add new delivery order
    </Button>
  </div>

  <!-- search -->
  <div class="flex items-center gap-2 mb-4 full">
    <Search size='md' class="flex gap-2 items-center" placeholder="Search Site ID..." bind:value={sitebasicinfo} on:keypress="{checkForEnter}">
    </Search>

    <DropdownMulti
      options={['Confirm', 'ReUse', 'KIV', 'Drop', 'TDD Only', 'Reuse_Replace']}
      bind:selectedOptions={contracttype}
      onOptionChange={search}
      placeholder="Contract type" 
    />

    <DropdownMulti
      options={['Null', 'Not Null', 'All']}
      bind:selectedOptions={doissuedate}
      onOptionChange={search}
      placeholder="DO Date" 
    />

    <DropdownMulti
      options={['Null', 'Not Null']}
      bind:selectedOptions={codsubmitdate}
      onOptionChange={search}
      placeholder="COD Submit Date" 
    />

    <DropdownMulti
      options={['Null', 'Not Null']}
      bind:selectedOptions={codapprovedate}
      onOptionChange={search}
      placeholder="COD Approval Date" 
    />
    
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
      <TableHeadCell class="py-4 text-sm">Contract Type</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">DO Date</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">COD Submit Date</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">COD Approve Date</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Action</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="border-none">
      {#each data.reldata.data.results as rellist}
        <TableBodyRow color="custom" class="dark:bg-gray-700/30 border-b border-gray-500/50">
          <TableBodyCell class="py-2"><span class="dark:text-gray-400">{rellist.sitebasicinfo.siteid}</span></TableBodyCell>
          <TableBodyCell class="py-2"><span class="dark:text-gray-400">{rellist.sitebasicinfo.contracttype}</span></TableBodyCell>
          <TableBodyCell class="py-2"><span class="dark:text-gray-400">{rellist.do.doissuedate}</span></TableBodyCell>
          <TableBodyCell class="py-2"><span class="dark:text-gray-400">{rellist.do.codsubmitdate}</span></TableBodyCell>
          <TableBodyCell class="py-2"><span class="dark:text-gray-400">{rellist.do.codapprovedate}</span></TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">
              <div class="flex gap-1">
                <span>
                  <Button size="sm" color="purple" class="rounded-md px-2" on:click={() => showDrawer(rellist)}>
                    <Icon icon="bx:detail" />
                  </Button>
                  <Tooltip color="green">DOinfo Detail</Tooltip>
                </span>

                <Button
                  on:click={() => {siteId = rellist.do.id; doUpdateModal = true}}
                  size="sm" 
                  class="rounded-md px-2 bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600"
                >
                  <Icon icon="ri:edit-line" />
                </Button>
                <Tooltip color="yellow">DOinfo Update</Tooltip>
    
                <Button
                  on:click={() => {siteId = rellist.do.id; doDeleteModal = true}}
                  size="sm" 
                  color="red" 
                  class="rounded-md px-2"
                >
                  <Icon icon="ri:delete-bin-line" />
                </Button>
                <Tooltip color="red">DOinfo Delete</Tooltip>
              </div>
            </span>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

  <!-- Pagination -->
  <PaginationComponent bind:totalPages={totalPages} bind:activePage={activePage} bind:limit={limit} bind:paginationurl={paginationurl} filterParams={{sitebasicinfo, contracttype, doissuedate, codsubmitdate, codapprovedate}} />

  <!-- Drawer -->
  <DodetailDrawer bind:dodetaildrawer={dodetaildrawer} {selectedRellist} />

  <!-- CRUD Modal -->
  <CreateDOModal
    bind:doCreateModal={doCreateModal}
    on:doCreated={search}
  />

  <UpdateDOModal
    bind:doUpdateModal={doUpdateModal} {siteId}
    on:doUpdated={search}
  />
</div>