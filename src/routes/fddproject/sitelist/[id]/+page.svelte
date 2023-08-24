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
    const res = await fetch(`http://10.24.8.115:8000/api/v2/physicalsiteinfo/?sitebasicinfo_id=${data.sitedata.id}`)
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
      <h2 class="text-slate-400 text-lg">{data.sitedata.site_id} Site Detail Informations</h2>
      <p class="text-xs text-slate-400 dark:text-gray-400">{data.sitedata.site_name}</p>
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

      <!-- Task Timeline -->
      <!-- <div class="flex my-4">
        <Timeline order="horizontal">
          <TimelineItem title="DO Number" date={relateDoinfo.do_issue_date}>
            <svelte:fragment slot="icon">
              <div class="flex items-center">
                <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                  <Icon icon="mdi:truck-delivery-outline"/>
                </div>
                <div class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
              </div>
            </svelte:fragment>
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">
              Get started with dozens of web components and interactive elements.
            </p>
          </TimelineItem> 
          <TimelineItem title="OnAir Date" date={relateInstallinfo.onair_date}>
            <svelte:fragment slot="icon">
              <div class="flex items-center">
                <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                  <Icon icon="mdi:truck-delivery-outline"/>
                </div>
                <div class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
              </div>
            </svelte:fragment>
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">
              Get started with dozens of web components and interactive elements.
            </p>
          </TimelineItem> 
          <TimelineItem title="BS Approve date" date={relateSSVinfo.bs_approval_date}>
            <svelte:fragment slot="icon">
              <div class="flex items-center">
                <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                  <Icon icon="mdi:truck-delivery-outline"/>
                </div>
                <div class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
              </div>
            </svelte:fragment>
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">
              Get started with dozens of web components and interactive elements.
            </p>
          </TimelineItem> 
          <TimelineItem title="OPT Approve date" date={relateOPTinfo.opt_approval_date}>
            <svelte:fragment slot="icon">
              <div class="flex items-center">
                <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                  <Icon icon="mdi:truck-delivery-outline"/>
                </div>
                <div class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
              </div>
            </svelte:fragment>
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">
              Get started with dozens of web components and interactive elements.
            </p>
          </TimelineItem> 
          <TimelineItem title="FAC Statue" date={relateCerti.fac_status}>
            <svelte:fragment slot="icon">
              <div class="flex items-center">
                <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                  <Icon icon="mdi:truck-delivery-outline"/>
                </div>
                <div class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
              </div>
            </svelte:fragment>
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">
              Get started with dozens of web components and interactive elements.
            </p>
          </TimelineItem> 
        </Timeline>
      </div> -->
      <div class="grid grid-cols-5 gap-4">
        {#if data.sitedata.contracttype !== 'TDD Only'}
        <!-- DO Information -->
        <div 
          class="flex flex-col rounded-lg p-4 gap-1 bg-slate-50 dark:bg-slate-700/50 shadow-md text-slate-800 dark:text-slate-400
          {relateDoinfo.cod_approval_date ? 'border border-green-400' : ''}">
          <Icon icon="mdi:truck-delivery-outline" class="text-3xl {relateDoinfo.cod_approval_date ? 'text-green-400' : ''}"/>
          <h1 class="text-lg font-semibold {relateDoinfo.cod_approval_date ? 'text-green-400' : ''}">Delivery</h1>
          {#if data.sitedata.contracttype === 'TDD Only'}
            <p class="text-rose-500">TDD Only site</p>
          {:else if relateDoinfo.do_number}
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">DO Number: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateDoinfo.do_number}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">Issue date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateDoinfo.do_issue_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">COD Sumbit date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateDoinfo.cod_submit_to_ytl_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm mb-4">
              <p class="text-sm text-gray-500 dark:text-gray-400">COD Approve date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateDoinfo.cod_approval_date}</p>
            </div>
          {:else}
            <p class="text-green-500 dark:text-rose-500">Not yet</p>
          {/if}
          <div class="flex mt-auto gap-2">
            <Button class="py-1.5 dark:bg-sky-600 dark:hover:bg-sky-700 dark:fucus:ring-4 dark:focus:ring-sky-600">View</Button>
            <Button class="py-1.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:fucus:ring-4 dark:focus:ring-purple-600">Update</Button>
          </div>
        </div>

        <!-- Installation Information -->
        <div 
          class="flex flex-col rounded-lg p-4 gap-1 bg-slate-50 dark:bg-slate-700/50 shadow-md text-slate-800 dark:text-slate-400
          {relateInstallinfo.coic_approval_status ? 'border border-green-400' : ''}">
          <Icon icon="ion:construct-outline" class="text-3xl {relateInstallinfo.coic_approval_status ? 'text-green-400' : ''}"/>
          <h1 class="text-lg font-semibold {relateInstallinfo.coic_approval_status ? 'text-green-400' : ''}">Installation</h1>
          {#if data.sitedata.contracttype === 'TDD Only'}
            <p class="text-green-500 dark:text-rose-500">TDD Only site</p>
          {:else if relateDoinfo.do_number}
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">Install date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateInstallinfo.install_complete}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">OnAir date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateInstallinfo.onair_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">COIC Submit: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateInstallinfo.coic_submit_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">COIC Status: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateInstallinfo.coic_approval_status}</p>
            </div>
          {:else}
            <p class="text-green-500 dark:text-rose-500">Not yet</p>
          {/if}
          <div class="flex mt-auto gap-2">
            <Button class="py-1.5 dark:bg-sky-600 dark:hover:bg-sky-700 dark:fucus:ring-4 dark:focus:ring-sky-600">View</Button>
            <Button class="py-1.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:fucus:ring-4 dark:focus:ring-purple-600">Update</Button>
          </div>
        </div>

        <!-- SSV Information -->
        <div 
          class="flex flex-col rounded-lg p-4 gap-1 bg-slate-50 dark:bg-slate-700/50 shadow-md text-slate-800 dark:text-slate-400
          {relateSSVinfo.bs_approval_date ? 'border border-green-400' : ''}">
          <Icon icon="ic:baseline-laptop" class="text-3xl {relateSSVinfo.bs_approval_date ? 'text-green-400' : ''}"/>
          <h1 class="text-lg font-semibold {relateSSVinfo.bs_approval_date ? 'text-green-400' : ''}">Single Site Verification</h1>
          {#if data.sitedata.contracttype === 'TDD Only'}
            <p class="text-green-500 dark:text-rose-500">TDD Only site</p>
          {:else if relateDoinfo.do_number}
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">Start date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateSSVinfo.ssv_start_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">Complete date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateSSVinfo.ssv_complete_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">BS Submit date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateSSVinfo.bs_submit_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">BS Approve date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateSSVinfo.bs_approval_date}</p>
            </div>
          {:else}
            <p class="text-green-500 dark:text-rose-500">Not yet</p>
          {/if}
          <div class="flex mt-auto gap-2">
            <Button class="py-1.5 dark:bg-sky-600 dark:hover:bg-sky-700 dark:fucus:ring-4 dark:focus:ring-sky-600">View</Button>
            <Button class="py-1.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:fucus:ring-4 dark:focus:ring-purple-600">Update</Button>
          </div>
        </div>

        <!-- OPT Information -->
        <div 
          class="flex flex-col rounded-lg p-4 gap-1 bg-slate-50 dark:bg-slate-700/50 shadow-md text-slate-800 dark:text-slate-400
          {relateOPTinfo.opt_approval_date ? 'border border-green-400' : ''}">
          <Icon icon="icon-park-outline:smart-optimization" class="text-3xl {relateSSVinfo.bs_approval_date ? 'text-green-400' : ''}"/>
          <h1 class="text-lg font-semibold {relateSSVinfo.bs_approval_date ? 'text-green-400' : ''}">Optimization</h1>
          {#if data.sitedata.contracttype === 'TDD Only'}
            <p class="text-green-500 dark:text-rose-500">TDD Only site</p>
          {:else if relateDoinfo.do_number}
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">Start date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateOPTinfo.opt_start_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">Complete date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateOPTinfo.opt_complete_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">Submit date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateOPTinfo.opt_submit_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">Approve date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateOPTinfo.opt_approval_date}</p>
            </div>
          {:else}
            <p class="text-green-500 dark:text-rose-500">Not yet</p>
          {/if}
          <div class="flex mt-auto gap-2">
            <Button class="py-1.5 dark:bg-sky-600 dark:hover:bg-sky-700 dark:fucus:ring-4 dark:focus:ring-sky-600">View</Button>
            <Button class="py-1.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:fucus:ring-4 dark:focus:ring-purple-600">Update</Button>
          </div>
        </div>

        <!-- Certi Information -->
        <div 
          class="flex flex-col rounded-lg p-4 gap-1 bg-slate-50 dark:bg-slate-700/50 shadow-md text-slate-800 dark:text-slate-400 {relateCerti.fac_status ? 'border border-green-400' : ''} ">
          <Icon icon="mingcute:certificate-line" class="text-3xl {relateCerti.fac_status ? 'text-green-400' : ''}"/>
          <h1 class="text-lg font-semibold {relateCerti.fac_status ? 'text-green-400' : ''}">Certification</h1>
          {#if relateOPTinfo.opt_approval_date == null}
          <p class="text-xs text-green-500 dark:text-orange-500">Not complete optimization</p>
          {:else if relateOPTinfo.opt_approval_date && relateCerti.pac_submit_date}
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">PAC date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateCerti.pac_submit_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">FAC date: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateCerti.fac_submit_date}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">PAC Approve: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateCerti.pac_status}</p>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <p class="text-sm text-gray-500 dark:text-gray-400">FAC Approve: </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{relateCerti.fac_status}</p>
            </div>
          {:else}
            <p class="text-sm text-green-500 dark:text-rose-500">Pending Submit Certification</p>
          {/if}
          <div class="flex mt-auto gap-2">
            <Button class="py-1.5 dark:bg-sky-600 dark:hover:bg-sky-700 dark:fucus:ring-4 dark:focus:ring-sky-600">View</Button>
            <Button class="py-1.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:fucus:ring-4 dark:focus:ring-purple-600">Update</Button>
          </div>
        </div>
        {:else}
        <p class="text-slate-500 col-span-5">TDD Only site, no status data in the server</p>
        {/if}

      </div>
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