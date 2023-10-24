<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { Breadcrumb, BreadcrumbItem, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Tabs, TabItem, Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
  import Createphyinfo from '../../fddproject/sitelist/[id]/crud/Createphyinfo.svelte';
  import Updatephyinfo from '../../fddproject/sitelist/[id]/crud/Updatephyinfo.svelte';
  import Deletephyinfo from '../../fddproject/sitelist/[id]/crud/Deletephyinfo.svelte';

  export let data: PageData;
  let btsmanagerdata:any = [];

  async function fetchBTSmanagerData() {
    const res = await fetch(`http://10.24.8.120:8000/api/btsmanager/?siteid=${data.sitedata.siteid}`)
    const resBTSmanagerData = await res.json();
    const BTSmanager_all = resBTSmanagerData.results;
    const BTSmanager_800 = resBTSmanagerData.results.filter((item:any) => item.freqband == 20);
    const BTSmanager_2300 = resBTSmanagerData.results.filter((item:any) => item.freqband == 40);
    const BTSmanager_2600 = resBTSmanagerData.results.filter((item:any) => item.freqband == 38);
    return {
      BTSmanager_all,
      BTSmanager_800,
      BTSmanager_2300,
      BTSmanager_2600
    }
  }

  onMount(async () => {
    btsmanagerdata = await fetchBTSmanagerData();
    btsmanagerdata = {...btsmanagerdata}

  });

  let _cellidentity: string = '';
  let _physiteinfoid: string = '';
  let siteId: string = ''
  let physiteinfoCreateModal = false
  let physiteinfoUpdateModal = false
  let physiteinfoDeleteModal = false

  let relateDoinfo = data.relateddata.results[0].do;
  let relateInstallinfo = data.relateddata.results[0].install;
  let relateSSVinfo = data.relateddata.results[0].ssv;
  let relateOPTinfo = data.relateddata.results[0].optimization;
  let relateCerti = data.relateddata.results[0].certification;

  async function handleRefrash() {
    let params = new URLSearchParams();
    params.set('refresh', Date.now().toString())
    btsmanagerdata = await fetchBTSmanagerData();
    goto(`/fddproject/sitelist/${$page.params.id}/`)
  }

</script>
  <div class="p-2 w-full pt-2">
    <!-- Breadcrumb -->
    <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/fddproject/sitelist">YTL LTE Site List</BreadcrumbItem>
      <BreadcrumbItem>{data.sitedata.siteid} Detail</BreadcrumbItem>
    </Breadcrumb>
    <!-- site detail title-->
    <div class="flex flex-col mb-6">
      <h2 class="text-slate-400 font-bold mb-1">
        {data.sitedata.siteid}
        (
          {#if data.sitedata.region === 'Central'}
            eNB_1{data.sitedata.siteid.substring(5, 10)}
          {:else if data.sitedata.region === 'Northern'}
            eNB_2{data.sitedata.siteid.substring(5, 10)}
          {:else if data.sitedata.region === 'Southern'}
            eNB_3{data.sitedata.siteid.substring(5, 10)}
          {:else if data.sitedata.region === 'Eastern'}
            eNB_4{data.sitedata.siteid.substring(5, 10)}
          {:else if data.sitedata.region === 'Sabah'}
            eNB_5{data.sitedata.siteid.substring(5, 10)}
          {:else}
            eNB_6{data.sitedata.siteid.substring(5, 10)}
          {/if}
        )
         Site Detail Informations
      </h2>
      <div class="flex items-center">
        <p class="text-xs text-slate-400">Site Name:</p>
        <p class="text-xs text-slate-400 rounded-md bg-slate-600 py-0.5 px-2 ms-2 me-4">{data.sitedata.sitename}</p>
        <p class="text-xs text-slate-400">Cluster:</p>
        <p class="text-xs text-slate-400 rounded-md bg-slate-600 py-0.5 px-2 ms-2 me-6">{data.sitedata.cluster}</p>
      </div>
    </div>

    <!-- Physical Info -->
    <div class="flex flex-col mb-6">
      <div class="flex items-center gap-2 mb-1">
        <h4 class="text-slate-400 dark:text-slate-400">Site Physical Information</h4>
        {#if relateInstallinfo && relateInstallinfo.oaairdate && relateInstallinfo.oaairdate.length > 0}
        <div 
          class="py-0.5 px-3 text-xs text-slate-800 rounded-sm
          {relateInstallinfo.oaairdate ? 'bg-green-400' : 'bg-rose-400'}">
          OnAir
        </div>
        {/if}
        {#if btsmanagerdata.BTSmanager_all && btsmanagerdata.BTSmanager_all.length > 0}
        <div 
          class="py-0.5 px-3 text-xs text-slate-800 rounded-sm
          {btsmanagerdata.BTSmanager_all[0].channelcard ? 'bg-green-400' : 'bg-rose-400'}">
          {btsmanagerdata.BTSmanager_all[0].channelcard}
        </div>
        {:else}
        <div class="py-0.5 px-3 text-xs text-slate-800 rounded-sm bg-rose-400">
          No BTS Manager data found
        </div>
        {/if}
        {#if data.sitedata.siteconfig && data.sitedata.siteconfig.length > 0}
        <div 
          class="py-0.5 px-3 text-xs text-slate-800 rounded-sm
          {data.sitedata.siteconfig ? 'bg-green-400' : 'bg-rose-400'}">
          {data.sitedata.siteconfig}
        </div>
        {/if}
      </div>

      <p class="text-slate-400 text-xs mb-4">
        LSM & RET informations are no need to update here because it will be updated automatically 
        (once a week will updated LSM, RET and TX Attn informations.)
      </p>

      <!-- Site Phy&LSM info table-->
      <Tabs style="underline" contentClass="py-4 bg-white rounded-lg dark:bg-gray-800">

        <!-- L800 BTS Information -->
        {#if btsmanagerdata.BTSmanager_800 && btsmanagerdata.BTSmanager_800.length > 0}
        <TabItem open 
          activeClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50 bg-primary-600 dark:bg-indigo-600"
          inactiveClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50">
          <div slot="title" class="flex items-center">
            FDD-800
            <p class="text-xs h-5 w-5 bg-slate-50 rounded-full flex items-center justify-center ms-1 dark:text-indigo-500 text-slate-500">
              {btsmanagerdata.BTSmanager_800.length}
            </p>
          </div>
          <Table shadow>
            <TableHead>
              <TableHeadCell padding="py-4 px-6">ECGI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ANT Type</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ANT Height</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Azimuth</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">MTILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ETILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PCI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PSS</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">SSS</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">TAC</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">RSI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Action</TableHeadCell>
            </TableHead>
            <TableBody>
              {#each btsmanagerdata.BTSmanager_800 as item}
              <TableBodyRow>
                <TableBodyCell tdClass="px-6 py-3">{item.cellidentity}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.antennatype}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.antennaheight}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.azimuth}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.mtilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.etilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pci}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pss}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.sss}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.tac}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.rsi}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">
                  {#if !item.phyinfo.antennatype}
                  <Button size="xs" color="blue" class="rounded-md px-2"
                  on:click={() => {siteId = item.siteid; _physiteinfoid = item.uid; physiteinfoCreateModal = true}}>
                    <Icon icon="gridicons:create" />
                  </Button>
                  {/if}
                  {#if item.phyinfo.antennatype}
                  <Button size="xs" color="purple" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.phyinfo.id; _physiteinfoid = item.uid; physiteinfoUpdateModal = true}}>
                    <Icon icon="ri:edit-line" />
                  </Button>
                  <Button size="xs" color="red" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.phyinfo.id; _physiteinfoid = item.uid; physiteinfoDeleteModal = true}}>
                    <Icon icon="ri:delete-bin-line" />
                  </Button>
                  {/if}
                </TableBodyCell>
              </TableBodyRow>
              {/each}
            </TableBody>
          </Table>
        </TabItem>
        {/if}

        <!-- L2300 BTS Information -->
        {#if btsmanagerdata.BTSmanager_2300 && btsmanagerdata.BTSmanager_2300.length > 0}
        <TabItem open 
          activeClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50 bg-primary-600 dark:bg-indigo-600"
          inactiveClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50">
          <div slot="title" class="flex items-center">
            TDD-2.3GHz
            <p class="text-xs h-5 w-5 bg-slate-50 rounded-full flex items-center justify-center ms-1 dark:text-indigo-500 text-slate-500">
              {btsmanagerdata.BTSmanager_2300.length}
            </p>
          </div>
          <Table shadow>
            <TableHead>
              <TableHeadCell padding="py-4 px-6">ECGI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ANT Type</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ANT Height</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Azimuth</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">MTILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ETILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PCI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PSS</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">SSS</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">TAC</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">RSI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Action</TableHeadCell>
            </TableHead>
            <TableBody>
              {#each btsmanagerdata.BTSmanager_2300 as item}
              <TableBodyRow>
                <TableBodyCell tdClass="px-6 py-3">{item.cellidentity}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.antennatype}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.antennaheight}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.azimuth}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.mtilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.etilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pci}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pss}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.sss}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.tac}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.rsi}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">
                  {#if !item.phyinfo.antennatype}
                  <Button size="xs" color="blue" class="rounded-md px-2"
                  on:click={() => {siteId = item.siteid; _physiteinfoid = item.uid; physiteinfoCreateModal = true}}>
                    <Icon icon="gridicons:create" />
                  </Button>
                  {/if}
                  {#if item.phyinfo.antennatype}
                  <Button size="xs" color="purple" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.phyinfo.id; _physiteinfoid = item.uid; physiteinfoUpdateModal = true}}>
                    <Icon icon="ri:edit-line" />
                  </Button>
                  <Button size="xs" color="red" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.phyinfo.id; _physiteinfoid = item.uid; physiteinfoDeleteModal = true}}>
                    <Icon icon="ri:delete-bin-line" />
                  </Button>
                  {/if}
                </TableBodyCell>
              </TableBodyRow>
              {/each}
            </TableBody>
          </Table>
        </TabItem>
        {/if}

        <!-- L2600 BTS Information -->
        {#if btsmanagerdata.BTSmanager_2600 && btsmanagerdata.BTSmanager_2600.length > 0}
        <TabItem open 
          activeClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50 bg-primary-600 dark:bg-indigo-600"
          inactiveClasses="px-3 py-2 text-primary-50 bg-gray-100 rounded-t-md dark:bg-gray-800 dark:text-indigo-50">
          <div slot="title" class="flex items-center">
            TDD-2.6GHz
            <p class="text-xs h-5 w-5 bg-slate-50 rounded-full flex items-center justify-center ms-1 dark:text-indigo-500 text-slate-500">
              {btsmanagerdata.BTSmanager_2600.length}
            </p>
          </div>
          <Table shadow>
            <TableHead>
              <TableHeadCell padding="py-4 px-6">ECGI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ANT Type</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ANT Height</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Azimuth</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">MTILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">ETILT</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PCI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">PSS</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">SSS</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">TAC</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">RSI</TableHeadCell>
              <TableHeadCell padding="py-4 px-6">Action</TableHeadCell>
            </TableHead>
            <TableBody>
              {#each btsmanagerdata.BTSmanager_2600 as item}
              <TableBodyRow>
                <TableBodyCell tdClass="px-6 py-3">{item.cellidentity}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.antennatype}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.antennaheight}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.azimuth}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.phyinfo.mtilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.etilt}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pci}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.pss}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.sss}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.tac}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">{item.rsi}</TableBodyCell>
                <TableBodyCell tdClass="px-6 py-3">
                  {#if !item.phyinfo.antennatype}
                  <Button size="xs" color="blue" class="rounded-md px-2"
                  on:click={() => {siteId = item.siteid; _physiteinfoid = item.uid; physiteinfoCreateModal = true}}>
                    <Icon icon="gridicons:create" />
                  </Button>
                  {/if}
                  {#if item.phyinfo.antennatype}
                  <Button size="xs" color="purple" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.phyinfo.id; _physiteinfoid = item.uid; physiteinfoUpdateModal = true}}>
                    <Icon icon="ri:edit-line" />
                  </Button>
                  <Button size="xs" color="red" class="rounded-md px-2"
                    on:click={() => {_cellidentity = item.phyinfo.id; _physiteinfoid = item.uid; physiteinfoDeleteModal = true}}>
                    <Icon icon="ri:delete-bin-line" />
                  </Button>
                  {/if}
                </TableBodyCell>
              </TableBodyRow>
              {/each}
            </TableBody>
          </Table>
        </TabItem>
        {/if}

      </Tabs>
    </div>

    <!-- additional information -->
  </div>
<!-- CRUD Modal -->
<Createphyinfo
  bind:physiteinfoCreateModal={physiteinfoCreateModal} {_physiteinfoid}
  on:physiteCreated={handleRefrash} />
<Updatephyinfo
  bind:physiteinfoUpdateModal={physiteinfoUpdateModal} {_cellidentity} {_physiteinfoid}
  on:physiteUpdated={handleRefrash} />
<Deletephyinfo
  bind:physiteinfoDeleteModal={physiteinfoDeleteModal} {_cellidentity}
  on:sitephyinfoDeleted={handleRefrash} />