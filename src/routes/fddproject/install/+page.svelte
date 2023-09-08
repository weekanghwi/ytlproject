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
  let region = '';
  let doissuedate = '';
  let startdate = '';
  let completedate = '';
  let integrationdate = '';
  let integrationondate = '';
  let oaairdate = '';
  let coisubmitdate = '';
  let coiapprovedate = '';
  let coicsubmitdate = '';
  let coicapprovestatus = '';
  let pnochotriggerdate = '';
  let pnochocompletedate = '';

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
    params.set('region', region);
    params.set('doissuedate', doissuedate);
    params.set('startdate', startdate);
    params.set('completedate', completedate);
    params.set('integrationdate', integrationdate);
    params.set('integrationondate', integrationondate);
    params.set('oaairdate', oaairdate);
    params.set('coisubmitdate', coisubmitdate);
    params.set('coiapprovedate', coiapprovedate);
    params.set('coicsubmitdate', coicsubmitdate);
    params.set('coicapprovestatus', coicapprovestatus);
    params.set('pnochotriggerdate', pnochotriggerdate);
    params.set('pnochocompletedate', pnochocompletedate);
    goto(`/${paginationurl}/?${params.toString()}`);
  }

  function resetFilters() {
    sitebasicinfo = '';
    region = '';
    contracttype = '';
    doissuedate = '';
    startdate = '';
    completedate = '';
    integrationdate = '';
    integrationondate = '';
    oaairdate = '';
    coisubmitdate = '';
    coiapprovedate = '';
    coicsubmitdate = '';
    coicapprovestatus = '';
    pnochotriggerdate = '';
    pnochocompletedate = '';
    search();
  }

  function checkForEnter(event) {
    if (event.keyCode === 13) {
      search();
    }
  }

  // Modal
  let siteId = '';
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
          bind:selectedOptions={region}
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
            bind:selectedOptions={doissuedate}
            onOptionChange={search}
            placeholder="DO Issue" 
          />

          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={startdate}
            onOptionChange={search}
            placeholder="Insatall Start" 
          />
      
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={completedate}
            onOptionChange={search}
            placeholder="Install Complete" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={integrationdate}
            onOptionChange={search}
            placeholder="Integration" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={integrationondate}
            onOptionChange={search}
            placeholder="Integration TurnOn" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={oaairdate}
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
            bind:selectedOptions={coisubmitdate}
            onOptionChange={search}
            placeholder="COI Submit" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={coiapprovedate}
            onOptionChange={search}
            placeholder="COI Approve" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={coicsubmitdate}
            onOptionChange={search}
            placeholder="COI&C Submit" 
          />
    
          <DropdownMulti
          options={['Dato Approved', 'Pending Dato', 'Pending ASN Manager', '-']}
            bind:selectedOptions={coicapprovestatus}
            onOptionChange={search}
            placeholder="COI&C Approve" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={pnochotriggerdate}
            onOptionChange={search}
            placeholder="PNOC HO Trigger" 
          />
    
          <DropdownMulti
            options={['Null', 'Not Null']}
            bind:selectedOptions={pnochocompletedate}
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
              <span class="dark:text-gray-400">{rellist.sitebasicinfo.siteid}</span>
              <span class="dark:text-gray-400 text-xs">{rellist.sitebasicinfo.region}</span>
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <span class="dark:text-gray-400">{rellist.sitebasicinfo.contracttype}</span>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.install.startdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.install.startdate}
              </span>
              {/if}
              {#if rellist.install.completedate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-e-box-outline" class="text-green-500" />{rellist.install.completedate}
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.install.integrationdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="heroicons-outline:play" class="text-sky-500" />{rellist.install.integrationdate}
              </span>
              {/if}
              {#if rellist.install.integrationondate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="heroicons-outline:stop" class="text-green-500" />{rellist.install.integrationondate}
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.install.oaairdate}
              <span class="dark:text-gray-400">{rellist.install.oaairdate}</span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.install.coisubmitdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.install.coisubmitdate}
              </span>
              {/if}
              {#if rellist.install.coiapprovedate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-a-box-outline" class="text-sky-500" />{rellist.install.coiapprovedate}
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.install.coicsubmitdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.install.coicsubmitdate}
              </span>
              {/if}
              {#if rellist.install.coicapprovestatus}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-a-box-outline" class="text-sky-500" />{rellist.install.coicapprovestatus}
              </span>
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell class="py-2">
            <div class="flex flex-col items-start justify-center">
              {#if rellist.install.pnochotriggerdate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-s-box-outline" class="text-sky-500" />{rellist.install.pnochotriggerdate}
              </span>
              {/if}
              {#if rellist.install.pnochocompletedate}
              <span class="dark:text-gray-400 flex items-center jusitfy-center">
                <Icon icon="mdi:alpha-a-box-outline" class="text-sky-500" />{rellist.install.pnochocompletedate}
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
                  on:click={() => {siteId = rellist.install.id; installUpdateModal = true}}
                  size="sm" 
                  class="rounded-md px-2 bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600"
                >
                  <Icon icon="ri:edit-line" />
                </Button>
                <Tooltip color="yellow">Install Info Update</Tooltip>
              </div>
            </span>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

  <!-- Pagination -->
  <PaginationComponent bind:totalPages={totalPages} bind:activePage={activePage} bind:limit={limit} bind:paginationurl={paginationurl} filterParams={{sitebasicinfo, contracttype, region, doissuedate, startdate, completedate, integrationdate, integrationondate, oaairdate, coisubmitdate, coiapprovedate, coicsubmitdate, coicapprovestatus, pnochotriggerdate, pnochocompletedate}} />

  <!-- Drawer -->
  <InstalldetailDrawer bind:installdetaildrawer={installdetaildrawer} {selectedRellist} {search} />

  <!-- Modal -->
  <UpdateInstallModal 
    bind:installUpdateModal={installUpdateModal} {siteId} {search}
  />
</div>
