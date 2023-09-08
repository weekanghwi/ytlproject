<script lang="ts">
  import { type SiteData, type ErrorsRecord, createInitialSiteData } from '$lib/types';
  import { createEventDispatcher } from 'svelte';
  import { fetchSiteData, updateSiteData } from './crud'
  import { fetchClusterData, fetchRegionData, fetchStateData, fetchContractTypeData, fetchSiteConfigData, fetchAntennaTypeData } from '$lib/categoryapicall';
  import { Modal, Label, Input, Button, NumberInput } from 'flowbite-svelte';
  import { z } from 'zod'
  import { SiteFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  export let siteUpdateModal = false;
  export let siteId: string;

  let siteData: SiteData = createInitialSiteData();
  let errors: ErrorsRecord = {}

  const crudSchema = SiteFormSchema.extend({
    id: SiteFormSchema.shape.id.optional(),
  })

  let ClustersearchQuery: string = '';
  let ClustersearchResults:any[] = [];
  let selectedCluster: any = null;
  let selectedClusterName: string = '';
  let showClusterDropdownmenu: boolean = false;

  let regionResults: any[] = [];
  let stateResults: any[] = [];
  let contracttypeResults: any[] = [];
  let siteconfigResults: any[] = [];
  let antennatypeResults: any[] = [];

  async function fetchAndSetClusterData(query: string) {
    try {
      const data = await fetchClusterData(query);
      ClustersearchResults = data;
      return data;
    } catch (error) {
      console.error('Error:', error);
      ClustersearchResults = [];
      return [];
    }
  }

  async function fetchAndSetRegionData() {
    try {
      const data = await fetchRegionData();
      regionResults = data;
      return data;
    } catch (error) {
      console.error('Error:', error);
      regionResults = [];
      return [];
    }
  }
  $: fetchAndSetRegionData();

  async function fetchAndSetStateData(region: string) {
    try {
      const data = await fetchStateData(region);
      stateResults = Array.isArray(data) ? data: [];
    } catch (error) {
      console.error('Error:', error);
      stateResults = [];
    }
  }
  let regions = siteData.region;
  $: regions = siteData.region;
  $: fetchAndSetStateData(regions);

  async function fetchAndSetContracttypeData() {
    try {
      const data = await fetchContractTypeData();
      contracttypeResults = data;
      return data;
    } catch (error) {
      console.error('Error:', error);
      contracttypeResults = [];
      return [];
    }
  }
  $: fetchAndSetContracttypeData();

  async function fetchAndSetSiteConfiData() {
    try {
      const data = await fetchSiteConfigData();
      siteconfigResults = data;
      return data;
    } catch (error) {
      console.error('Error:', error);
      siteconfigResults = [];
      return [];
    }
  }
  $: fetchAndSetSiteConfiData();

  async function fetchAndSetAnttypeData() {
    try {
      const data = await fetchAntennaTypeData();
      antennatypeResults = data;
      return data;
    } catch (error) {
      console.error('Error:', error);
      antennatypeResults = [];
      return [];
    }
  }
  $: fetchAndSetAnttypeData();

  $: if (siteId) {
    (async () => {
      try {
        const data = await fetchSiteData(siteId);
        siteData = data;
        if (data.cluster) {
          selectedCluster = data.cluster;
          ClustersearchQuery = data.cluster; 
        } else {
          selectedCluster = null;
          ClustersearchQuery = '';
        }
        showClusterDropdownmenu = false;
      } catch (error) {
        console.error('Failed to fetch site or cluster data:', error);
      }
    })();
    errors = {};
  }

  async function selectClusterResult(query: string) {
    if (query.length >= 2) {
      try {
        const results = await fetchAndSetClusterData(query);
        ClustersearchResults = results;
        showClusterDropdownmenu = true;
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      ClustersearchResults = [];
      showClusterDropdownmenu = false;
    }
  }

  async function handleClusterSelection(result: any) {
    selectedCluster = result;
    selectedClusterName = selectedCluster.cluster;
    ClustersearchQuery = selectedCluster.cluster;
    ClustersearchResults = [];
    showClusterDropdownmenu = false;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    // siteData.cluster = selectedCluster ? selectedCluster.cluster_name : siteData.cluster;
    siteData.cluster = selectedClusterName !== '' ? selectedClusterName : siteData.cluster;
    siteData.lat = parseFloat(siteData.lat as any);
    siteData.lon = parseFloat(siteData.lon as any);

    try {
      crudSchema.parse(siteData);
      await updateSiteData(siteId, siteData);
      siteUpdateModal = false;
      errors = {};
      // siteData = createInitialSiteData();
      selectedClusterName = '';
      dispatch('siteUpdated');
    } catch (error) {
      console.error('Failed to update site data:', error);
      if (error instanceof z.ZodError) {
      error.errors.forEach(({ path, message }) => {
        errors[path[0]] = message;
      });
      }
    }
  }
 
</script>

<Modal bind:open={siteUpdateModal} size="md" autoclose={false} class="w-full">
  {#if siteData}
  
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-6">
      <!-- <Icon icon="icon-park-solid:update-rotation" class="text-2xl text-indigo-600 animate-spin"/> -->
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Update Site Information</h3>
      <p class="text-sm text-slate-500">({siteData.siteid})</p>
    </div>
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={siteData.id} type="hidden" />

    <!-- Identification Info -->
    <div class="flex w-full items-center mb-2">
      <Icon icon="teenyicons:id-outline" class="me-2 text-md text-indigo-600"/>
      <p class="text-xl text-slate-800 dark:text-slate-400">Identification Information</p>
    </div>
    <div class="flex flex-col gap-3 mb-4 pb-4 border-b border-indigo-600/50">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2">
          <span class="text-slate-800 dark:text-slate-400">
            Site ID {#if errors.siteid}<span class="text-rose-600 text-xs"> !{errors.siteid}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="siteid" 
            placeholder="Site ID" 
            bind:value={siteData.siteid} type="text" 
          />
        </Label>
  
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Site Name {#if errors.sitename}<span class="text-rose-600 text-xs"> !{errors.sitename}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="sitename" 
            placeholder="Site Name" 
            bind:value={siteData.sitename} type="text" 
          />
        </Label>
      </div>
    </div>

    <!-- Location Info -->
    <div class="flex w-full items-center  mb-2">
      <Icon icon="octicon:location-16" class="me-2 text-md text-emerald-600"/>
      <p class="text-xl text-slate-800 dark:text-slate-400">Location Information</p>
    </div>
    <div class="flex flex-col gap-3 mb-4 pb-4 border-b border-emerald-600/50">
      <div class="relative flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Cluster {#if errors.cluster}<span class="text-rose-600 text-xs">{errors.cluster}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="cluster" 
            placeholder="Cluster..." 
            type="text"
            bind:value={ClustersearchQuery}
            on:input={() => selectClusterResult(ClustersearchQuery)}
            autocomplete="off"
          />
          {#if showClusterDropdownmenu}
            <div class="absolute flex flex-col items-start max-h-32 overflow-y-scroll top-16 left-0 z-50 bg-slate-50 dark:bg-slate-300 rounded-lg p-4 gap-1" >
              {#each ClustersearchResults as result (result.id)}
                <button 
                  class="dark:text-slate-700 text-xs dark:hover:bg-slate-400/50 px-2 rounded-sm" 
                  type="button" 
                  on:click={() => handleClusterSelection(result)}
                >
                  {result.cluster}
                </button>
              {/each}
            </div>
          {/if}
        </Label>

        <Label class="space-y-2">
          <span class="text-slate-800 dark:text-slate-400">Region</span>
          <select 
            class="text-sm py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="regions" 
            placeholder="Region" 
            bind:value={siteData.region}
          >
            {#each regionResults as regions (regions.id)}
              <option value={regions.region}>{regions.region}</option>
            {/each}
          </select>
          {#if errors.region}<span class="text-rose-600 text-xs">{errors.region}</span>{/if}
        </Label>

        <Label class="flex flex-col space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            State {#if errors.state}<span class="text-rose-600 text-xs">{errors.state}</span>{/if}
          </span>
          <select 
            class="text-sm py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="state" 
            placeholder="State" 
            bind:value={siteData.state}
          >
            {#each stateResults as states (states.id)}
              <option value={states.state}>{states.state}</option>
            {/each}
          </select>
        </Label>
      </div>

      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Latitude {#if errors.lat}<span class="text-rose-600 text-xs">{errors.lat}</span>{/if}
          </span>
          <NumberInput 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="lat" 
            placeholder="Latitude" 
            step="any"
            bind:value={siteData.lat}
          />
        </Label>

        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Longitude {#if errors.lon}<span class="text-rose-600 text-xs">{errors.lon}</span>{/if}
          </span>
          <NumberInput 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="lon" 
            placeholder="Longitude"
            step="any"
            bind:value={siteData.lon}
          />
        </Label>
      </div>
    </div>

    <!-- Site Category Info -->
    <div class="flex w-full items-center mb-2">
      <Icon icon="iconamoon:category-bold" class="me-2 text-md text-sky-500"/>
      <p class="text-xl text-slate-800 dark:text-slate-400">Site Category Information</p>
    </div>
    <div class="flex flex-col gap-3 mb-4 pb-4 border-b border-sky-600/50">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Contract Type {#if errors.contracttype}<span class="text-rose-600 text-xs">{errors.contracttype}</span>{/if}
          </span>
          <select 
            class="w-full text-sm py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="contracttype" 
            placeholder="Contract Type" 
            bind:value={siteData.contracttype}
          >
          {#each contracttypeResults as contracttypes (contracttypes.id)}
            <option value={contracttypes.contracttype}>{contracttypes.contracttype}</option>
          {/each}
          </select>
        </Label>

        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Site Configuration {#if errors.siteconfig}<span class="text-rose-600 text-xs">{errors.siteconfig}</span>{/if}
          </span>
          <select 
            class="w-full text-sm py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="siteconfig" 
            placeholder="Optimization Type" 
            bind:value={siteData.siteconfig} 
          >
            {#each siteconfigResults as siteconfigs (siteconfigs.id)}
              <option value={siteconfigs.siteconfig}>{siteconfigs.siteconfig}</option>
            {/each}
          </select>
        </Label>
      </div>
    </div>

    <div class="flex gap-4">
      <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update</Button>
      <Button color='red' on:click={() => {siteUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>
  {/if}

</Modal>
