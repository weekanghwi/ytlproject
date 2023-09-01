<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  
  import Createphyinfo from './crud/Createphyinfo.svelte';
	import Updatephyinfo from './crud/Updatephyinfo.svelte';
  import Deletephyinfo from './crud/Deletephyinfo.svelte';
  import { Breadcrumb, BreadcrumbItem, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Tabs, TabItem, Button, Badge, Timeline, TimelineItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';

  export let data: PageData;
  let physicaldata:any = [];

  async function fetchPhysicalData() {
    const res = await fetch(`http://10.24.8.120:8000/api/physiteinfo/?sitebasicinfo_id=${data.sitedata.id}`)
    const resphyData = await res.json();
    const phyData_base = resphyData.results.filter((item:any) => item.sitebasicinfo_id == data.sitedata.id)
    const phyData_800 = resphyData.results.filter((item:any) => item.earfcndl == 6245)
    const phyData_2300 = resphyData.results.filter((item:any) => item.earfcndl >= 38101)
    const phyData_2600 = resphyData.results.filter((item:any) => item.earfcndl == 38100)
    return {
      phyData_base,
      phyData_800,
      phyData_2300,
      phyData_2600
    };
  }

  onMount(async () => {
    physicaldata = await fetchPhysicalData();
    physicaldata = {...physicaldata};
  });

  let _cellidentity: string = '';
  let siteId: string = ''
  let physiteinfoCreateModal = false
  let physiteinfoUpdateModal = false
  let physiteinfoDeleteModal = false

  let relateDoinfo = data.relateddata.results[0].doinfo;
  let relateInstallinfo = data.relateddata.results[0].installtillonair;
  let relateSSVinfo = data.relateddata.results[0].ssvsection;
  let relateOPTinfo = data.relateddata.results[0].optinformation;
  let relateCerti = data.relateddata.results[0].certi;

  async function handleRefrash() {
    let params = new URLSearchParams();
    params.set('refresh', Date.now().toString())
    physicaldata = await fetchPhysicalData();
    goto(`/fddproject/sitelist/${$page.params.id}/`)
  }

</script>
  <div class="p-2 w-full pt-2">
    <!-- Breadcrumb -->
    <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/fddproject">FDD Project</BreadcrumbItem>
      <BreadcrumbItem href="/fddproject/sitelist">Site Lsit</BreadcrumbItem>
      <BreadcrumbItem>{data.sitedata.site_id} Detail</BreadcrumbItem>
    </Breadcrumb>

    <!-- site detail title-->
    <div class="flex flex-col mb-6">
      <h2 class="text-slate-400 text-lg">{data.sitedata.siteid} Site Detail Informations</h2>
      <p class="text-xs text-slate-400 dark:text-gray-400">{data.sitedata.sitename}</p>
    </div>

    <!-- Physical Info -->
    <div class="flex flex-col mb-6">
      <div class="flex items-center gap-2 mb-4">
        <h4 class="text-slate-400 dark:text-slate-400">Site Physical Information</h4>
        {#if physicaldata.phyData_base && physicaldata.phyData_base.length > 0}
        <div 
          class="py-1.5 px-3 text-xs text-slate-800 rounded-sm
          {physicaldata.phyData_base[0].sitestatus === 'OnAir' ? 'bg-green-400' : 'bg-rose-400'}">
          {physicaldata.phyData_base[0].sitestatus}
        </div>
        <div 
          class="py-1.5 px-3 text-xs text-slate-800 rounded-sm
          {physicaldata.phyData_base[0].channelcard === 'LCC2_B1' ? 'bg-green-400' : 'bg-rose-400'}">
          {physicaldata.phyData_base[0].channelcard}
        </div>
        <div 
          class="py-1.5 px-3 text-xs text-slate-800 rounded-sm bg-green-400">
          {physicaldata.phyData_base[0].siteconfig}
        </div>
        {/if}
        <Button
          size="xs" 
          class="py-1.5 px-3 rounded-sm"
          on:click={() => {siteId=data.sitedata.site_id; physiteinfoCreateModal = true}}>Add New</Button>
      </div>
      <Tabs style="underline" contentClass="py-4 bg-white rounded-lg dark:bg-gray-800">
        {#if physicaldata.phyData_800 && physicaldata.phyData_800.length > 0}
        <TabItem open 
          activeClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50 bg-primary-600 dark:bg-indigo-600"
          inactiveClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50">
          <div slot="title" class="flex items-center">
            FDD-800
            <p class="text-xs h-5 w-5 bg-slate-50 rounded-full flex items-center justify-center ms-1 dark:text-indigo-500 text-slate-500">
              {physicaldata.phyData_800.length}
            </p>
          </div>
          <Table shadow>
            <TableHead>
              <TableHeadCell padding="py-4 px-6">ANT Type</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ANT Height</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Azimuth</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">MTILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ETILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PCI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PSS</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Action</TableHeadCell>
            </TableHead>
            <TableBody>
              {#each physicaldata.phyData_800 as item}
              <TableBodyRow>
                <TableBodyCell tdClass="px-6 py-3">{item.antennatype}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.antennaheight}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.azimuth}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.mtilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.etilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pci}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pss}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">
                  <Button size="xs" color="purple" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.cellidentity; physiteinfoUpdateModal = true}}>
                    <Icon icon="ri:edit-line" />
                  </Button>
                  <Button size="xs" color="red" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.cellidentity; physiteinfoDeleteModal = true}}>
                    <Icon icon="ri:delete-bin-line" />
                  </Button>
                </TableBodyCell>
              </TableBodyRow>
              {/each}
            </TableBody>
          </Table>
        </TabItem>
        {/if}

        {#if physicaldata.phyData_2300 && physicaldata.phyData_2300.length > 0}
        <TabItem open 
          activeClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50 bg-primary-600 dark:bg-indigo-600"
          inactiveClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50">
          <div slot="title" class="flex items-center">
            TDD-2.3
            <p class="text-xs h-5 w-5 bg-slate-50 rounded-full flex items-center justify-center ms-1 dark:text-indigo-500 text-slate-500">
              {physicaldata.phyData_2300.length}
            </p>
          </div>
          <Table shadow>
            <TableHead>
              <TableHeadCell padding="py-4 px-6">ANT Type</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ANT Height</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Azimuth</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">MTILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ETILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PCI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PSS</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Action</TableHeadCell>
            </TableHead>
            <TableBody>
              {#each physicaldata.phyData_2300 as item}
              <TableBodyRow>
                <TableBodyCell tdClass="px-6 py-3">{item.antennatype}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.antennaheight}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.azimuth}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.mtilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.etilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pci}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pss}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">
                  <Button size="xs" color="purple" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.cellidentity; physiteinfoUpdateModal = true}}>
                    <Icon icon="ri:edit-line" />
                  </Button>
                  <Button size="xs" color="red" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.cellidentity; physiteinfoDeleteModal = true}}>
                    <Icon icon="ri:delete-bin-line" />
                  </Button>
                </TableBodyCell>
              </TableBodyRow>
              {/each}
            </TableBody>
          </Table>
        </TabItem>
        {/if}

        {#if physicaldata.phyData_2600 && physicaldata.phyData_2600.length > 0}
        <TabItem open 
          activeClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50 bg-primary-600 dark:bg-indigo-600"
          inactiveClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50">
          <div slot="title" class="flex items-center">
            TDD-2.6
            <p class="text-xs h-5 w-5 bg-slate-50 rounded-full flex items-center justify-center ms-1 dark:text-indigo-500 text-slate-500">
              {physicaldata.phyData_2600.length}
            </p>
          </div>
          <Table shadow>
            <TableHead>
              <TableHeadCell padding="py-4 px-6">ANT Type</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ANT Height</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Azimuth</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">MTILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ETILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PCI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PSS</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Action</TableHeadCell>
            </TableHead>
            <TableBody>
              {#each physicaldata.phyData_2600 as item}
              <TableBodyRow>
                <TableBodyCell tdClass="px-6 py-3">{item.antennatype}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.antennaheight}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.azimuth}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.mtilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.etilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pci}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pss}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">
                  <Button size="xs" color="purple" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.cellidentity; physiteinfoUpdateModal = true}}>
                    <Icon icon="ri:edit-line" />
                  </Button>
                  <Button size="xs" color="red" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.cellidentity; physiteinfoDeleteModal = true}}>
                    <Icon icon="ri:delete-bin-line" />
                  </Button>
                </TableBodyCell>
              </TableBodyRow>
              {/each}
            </TableBody>
          </Table>
        </TabItem>
        {/if}
      </Tabs>
    </div>

    <!-- Task Status -->
    <div class="flex flex-col mb-6">
      <h4 class="text-slate-400 dark:text-slate-400 mb-2">Status of Tasks</h4>
      
    </div>
  </div>
<!-- CRUD Modal -->
<Createphyinfo
  bind:physiteinfoCreateModal={physiteinfoCreateModal} {siteId}
  on:physiteCreated={handleRefrash} />
<Updatephyinfo
  bind:physiteinfoUpdateModal={physiteinfoUpdateModal} {_cellidentity}
  on:physiteUpdated={handleRefrash} />
<Deletephyinfo
  bind:physiteinfoDeleteModal={physiteinfoDeleteModal} {_cellidentity}
  on:sitephyinfoDeleted={handleRefrash} />