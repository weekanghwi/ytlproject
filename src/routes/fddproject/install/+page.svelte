<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Breadcrumb, BreadcrumbItem, Button, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Tooltip, Search } from "flowbite-svelte";
  import Icon from '@iconify/svelte';

  import PaginationComponent from '../../../components/PaginationComponent.svelte';
  import DropdownMulti from '../../../components/DropdownMulti.svelte';
  import InstalldetailDrawer from './detail/InstalldetailDrawer.svelte';
  import UpdateInstallModal from './crud/UpdateInstallModal.svelte';

  export let data;

  // Pagination variables
  let paginationurl = 'fddproject/install'
  let sitebasicinfo = '';
  let contracttype = '';
  let regions = '';
  let install_start = '';
  let install_complete = '';
  let integration_date = '';
  let integration_turnon = '';
  let onair_date = '';
  let coi_submit_date = '';
  let coi_approval_date = '';
  let coic_submit_date = '';
  let coic_approval_status = '';
  let pnoc_ho_trigger_date = '';
  let pnoc_ho_complete_date = '';

  let limit = Number($page.url.searchParams.get('limit')) || 5;
  $: totalPages = (Number(data?.reldata?.totalPages) || 0);
  $: activePage = (Number($page.url.searchParams.get('offset')) || 0) / limit;

  //Drawer
  let installdetaildrawer = true;
  let selectedRellist: any = {};

  function showDrawer(rellist) {
    selectedRellist = rellist;
    installdetaildrawer = false;
  }

  // Search
  async function search() {
    let params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', '0');
    params.set('sitebasicinfo', sitebasicinfo);
    params.set('contracttype', contracttype);
    params.set('regions', regions);
    params.set('install_start', install_start);
    params.set('install_complete', install_complete);
    params.set('integration_date', integration_date);
    params.set('integration_turnon', integration_turnon);
    params.set('onair_date', onair_date);
    params.set('coi_submit_date', coi_submit_date);
    params.set('coi_approval_date', coi_approval_date);
    params.set('coic_submit_date', coic_submit_date);
    params.set('coic_approval_status', coic_approval_status);
    params.set('pnoc_ho_trigger_date', pnoc_ho_trigger_date);
    params.set('pnoc_ho_complete_date', pnoc_ho_complete_date);
    goto(`/${paginationurl}/?${params.toString()}`);
  }

  function resetFilters() {
    sitebasicinfo = '';
    regions = '';
    contracttype = '';
    install_start = '';
    install_complete = '';
    integration_date = '';
    integration_turnon = '';
    onair_date = '';
    coi_submit_date = '';
    coi_approval_date = '';
    coic_submit_date = '';
    coic_approval_status = '';
    pnoc_ho_trigger_date = '';
    pnoc_ho_complete_date = '';
    search();
  }

  function checkForEnter(event) {
    if (event.keyCode === 13) {
      search();
    }
  }

  // Modal
  let siteId = '';
  let installCreateModal = false
  let installUpdateModal = false
  let installDeleteModal = false
  

</script>

<div class="p-2 w-full pt-2">
  <!-- Breadcrumb -->
  <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/fddproject">FDD Project</BreadcrumbItem>
    <BreadcrumbItem>Installation</BreadcrumbItem>
  </Breadcrumb>

  <!-- Table Title -->
  <div class="flex items-center gap-4 mb-3">
    <h5 class="text-2xl text-gray-800 dark:text-gray-300">Installation Information</h5>
    <Button 
      size="sm" 
      color="purple" 
      class="py-1.5 px-3"
      on:click={() => {installCreateModal=true}}
    >
      <Icon icon="system-uicons:button-add" class="text-2xl me-2" /> Add new install info
    </Button>
  </div>

    <!-- search -->
    <div class="flex flex-col mb-4">
      <div class="flex gap-2 w-fit mb-2">
        <Search
          size='md'
          class="flex gap-2"
          placeholder="Search Site ID..." 
          bind:value={sitebasicinfo} 
          on:keypress="{checkForEnter}"
        >
        </Search>
    
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
          placeholder="Contract Type" 
        />

        <Button size="sm" color="yellow" on:click={search}>
          <Icon icon="ri:search-line" /> <span class="ms-2">Search</span>
        </Button>
  
        <Button size="sm" color="purple" class="rounded-md" on:click={resetFilters}>
          <Icon icon="ri:restart-line" /> <span class="ms-2 whitespace-nowrap">Reset Filter</span>
        </Button>
      </div>
      
      <div class="flex items-center gap-2 w-full">
        <div class="grid grid-cols-7 items-center w-full gap-2 pt-3 pb-1 px-2 bg-slate-100 dark:bg-slate-900 rounded-t-lg">
          <span class="text-slate-400 min-w-[172px]">Installation relative filter</span>

          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={install_start}
            onOptionChange={search}
            placeholder="Insatall Start" 
          />
      
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={install_complete}
            onOptionChange={search}
            placeholder="Install Complete" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={integration_date}
            onOptionChange={search}
            placeholder="Integration" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={integration_turnon}
            onOptionChange={search}
            placeholder="Integration TurnOn" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={onair_date}
            onOptionChange={search}
            placeholder="OnAir" 
          />
        </div>
      </div>

      <div class="flex items-center gap-2 w-full">
        <div class="grid grid-cols-7 items-center w-full gap-2 pb-3 px-2 bg-slate-100 dark:bg-slate-900 rounded-b-lg">
          <span class="text-slate-900 dark:text-slate-400 min-w-[172px]">Document relative filter</span>

          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={coi_submit_date}
            onOptionChange={search}
            placeholder="COI Submit" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={coi_approval_date}
            onOptionChange={search}
            placeholder="COI Approve" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={coic_submit_date}
            onOptionChange={search}
            placeholder="COI&C Submit" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={coic_approval_status}
            onOptionChange={search}
            placeholder="COI&C Approve" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={pnoc_ho_trigger_date}
            onOptionChange={search}
            placeholder="PNOC HO Trigger" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={pnoc_ho_complete_date}
            onOptionChange={search}
            placeholder="PNOC HO Complete" 
          />
        </div>
      </div>
    </div>

  <!-- Table -->
  <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
    <TableHead>
      <TableHeadCell class="py-4 text-sm">Site ID</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Contract Type</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Install</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Integration</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">OnAir</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">COI</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">COI&C</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">PNOC HO</TableHeadCell>
      <TableHeadCell class="py-4 text-sm">Action</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="border-none">
      {#each data.reldata.data.results as rellist}
        <TableBodyRow color="custom" class="dark:bg-gray-700/30 border-b border-gray-500/50">
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start">
              <span class="dark:text-gray-400">{rellist.sitebasicinfo.site_id}</span>
              <span class="dark:text-gray-400 text-xs">{rellist.sitebasicinfo.regions}</span>
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">{rellist.sitebasicinfo.contracttype}</span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.installtillonair.install_start}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.installtillonair.install_start}
              </span>
              {/if}
              {#if rellist.installtillonair.install_complete}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-e-box-outline" class="text-green-500" />{rellist.installtillonair.install_complete}
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.installtillonair.integration_date}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="heroicons-outline:play" class="text-sky-500" />{rellist.installtillonair.integration_date}
              </span>
              {/if}
              {#if rellist.installtillonair.integration_turnon}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="heroicons-outline:stop" class="text-green-500" />{rellist.installtillonair.integration_turnon}
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.installtillonair.onair_date}
              <span class="dark:text-gray-400">{rellist.installtillonair.onair_date}</span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.installtillonair.coi_submit_date}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.installtillonair.coi_submit_date}
              </span>
              {/if}
              {#if rellist.installtillonair.coi_approval_date}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-a-box-outline" class="text-sky-500" />{rellist.installtillonair.coi_approval_date}
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.installtillonair.coic_submit_date}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.installtillonair.coic_submit_date}
              </span>
              {/if}
              {#if rellist.installtillonair.coic_approval_status}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-a-box-outline" class="text-sky-500" />{rellist.installtillonair.coic_approval_status}
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.installtillonair.pnoc_ho_trigger_date && rellist.installtillonair.pnoc_ho_trigger_date != '1976-01-01'}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.installtillonair.pnoc_ho_trigger_date}
              </span>
              {/if}
              {#if rellist.installtillonair.pnoc_ho_complete_date && rellist.installtillonair.pnoc_ho_complete_date != '1976-01-01'}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-a-box-outline" class="text-sky-500" />{rellist.installtillonair.pnoc_ho_complete_date}
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
                  <Tooltip color="green">Install Info Detail</Tooltip>
                </span>

                <Button
                  on:click={() => {siteId = rellist.installtillonair.id; installUpdateModal = true}}
                  size="sm" 
                  class="rounded-md px-2 bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600"
                >
                  <Icon icon="ri:edit-line" />
                </Button>
                <Tooltip color="yellow">Install Info Update</Tooltip>
    
                <Button
                  on:click={() => {siteId = rellist.installtillonair.id; installDeleteModal = true}}
                  size="sm" 
                  color="red" 
                  class="rounded-md px-2"
                >
                  <Icon icon="ri:delete-bin-line" />
                </Button>
                <Tooltip color="red">Install Info Delete</Tooltip>
              </div>
            </span>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

  <!-- Pagination -->
  <PaginationComponent bind:totalPages={totalPages} bind:activePage={activePage} bind:limit={limit} bind:paginationurl={paginationurl} filterParams={{sitebasicinfo, contracttype, regions, install_start, install_complete, integration_date, integration_turnon, onair_date, coi_submit_date, coi_approval_date, coic_submit_date, coic_approval_status, pnoc_ho_trigger_date, pnoc_ho_complete_date}} />

  <!-- Drawer -->
  <InstalldetailDrawer bind:installdetaildrawer={installdetaildrawer} {selectedRellist} />

  <!-- Modal -->
  <UpdateInstallModal 
    bind:installUpdateModal={installUpdateModal} {siteId} 
    on:installUpdated={search}
  />
</div>
