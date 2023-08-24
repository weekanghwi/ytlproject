<script lang="ts">
  import { type SiteData, type ErrorsRecord, createInitialSiteData } from '$lib/types';
  import { createEventDispatcher } from 'svelte';
  import { createSiteData } from './crud'
  import { fetchClusterData, fetchRegionData, fetchStateData, fetchContractTypeData, fetchOptCategoryData, fetchAntennaTypeData } from '$lib/categoryapicall';
  import { Modal, Label, Input, Button, NumberInput } from 'flowbite-svelte';
  import { z } from 'zod'
  import { SiteFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  export let siteCreateModal = false;

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
  let optcategoryResults: any[] = [];
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
  let regions = siteData.regions;
  $: regions = siteData.regions;
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

  async function fetchAndSetOptcategoryData() {
    try {
      const data = await fetchOptCategoryData();
      optcategoryResults = data;
      return data;
    } catch (error) {
      console.error('Error:', error);
      optcategoryResults = [];
      return [];
    }
  }
  $: fetchAndSetOptcategoryData();

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

  // $: if (siteId) {
  //   (async () => {
  //     try {
  //       const data = await fetchSiteData(siteId);
  //       siteData = data;
  //       if (data.cluster) {
  //         selectedCluster = data.cluster;
  //         ClustersearchQuery = data.cluster; 
  //       } else {
  //         selectedCluster = null;
  //         ClustersearchQuery = '';
  //       }
  //       showClusterDropdownmenu = false;
  //     } catch (error) {
  //       console.error('Failed to fetch site or cluster data:', error);
  //     }
  //   })();
  //   errors = {};
  // }

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
    selectedClusterName = selectedCluster.cluster_name;
    ClustersearchQuery = selectedCluster.cluster_name;
    ClustersearchResults = [];
    showClusterDropdownmenu = false;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    // siteData.cluster = selectedCluster ? selectedCluster.cluster_name : siteData.cluster;
    siteData.cluster = selectedClusterName !== '' ? selectedClusterName : siteData.cluster;

    try {
      crudSchema.parse(siteData);
      await createSiteData(siteData);
      siteCreateModal = false;
      errors = {};
      siteData = createInitialSiteData();
      selectedClusterName = '';
      dispatch('siteCreated');
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

<Modal bind:open={siteCreateModal} size="md" autoclose={false} class="w-full">
  {#if siteData}
  
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-6">
      <!-- <Icon icon="icon-park-solid:update-rotation" class="text-2xl text-indigo-600 animate-spin"/> -->
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Create Site Information</h3>
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
            Site ID {#if errors.site_id}<span class="text-rose-600 text-xs"> !{errors.site_id}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="site_id" 
            placeholder="Site ID" 
            bind:value={siteData.site_id} type="text" 
          />
        </Label>
  
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Site Name {#if errors.site_name}<span class="text-rose-600 text-xs"> !{errors.site_name}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="site_name" 
            placeholder="Site Name" 
            bind:value={siteData.site_name} type="text" 
          />
        </Label>
      </div>

      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            WiMAX ID {#if errors.wimax_id}<span class="text-rose-600 text-xs">{errors.wimax_id}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="wimax_id" 
            placeholder="WiMAX ID" 
            bind:value={siteData.wimax_id} type="text" 
          />
        </Label>

        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Candidate ID {#if errors.candidateid}<span class="text-rose-600 text-xs">{errors.candidateid}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="candidateid" 
            placeholder="Candidate ID" 
            bind:value={siteData.candidateid} type="text" 
          />
        </Label>

        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            School Code {#if errors.school_code}<span class="text-rose-600 text-xs">{errors.school_code}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="school_code" 
            placeholder="School Code" 
            bind:value={siteData.school_code} type="text" 
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
                  {result.cluster_name}
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
            bind:value={siteData.regions}
          >
            {#each regionResults as regions (regions.id)}
              <option value={regions.region}>{regions.region}</option>
            {/each}
          </select>
          {#if errors.regions}<span class="text-rose-600 text-xs">{errors.regions}</span>{/if}
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
            class="text-sm py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="contracttype" 
            placeholder="Contract Type" 
            bind:value={siteData.contracttype}
          >
          {#each contracttypeResults as contracttypes (contracttypes.id)}
            <option value={contracttypes.contractype}>{contracttypes.contractype}</option>
          {/each}
          </select>
        </Label>

        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Optimization Type {#if errors.optcategory}<span class="text-rose-600 text-xs">{errors.optcategory}</span>{/if}
          </span>
          <select 
            class="w-full text-sm py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="optcategory" 
            placeholder="Optimization Type" 
            bind:value={siteData.optcategory} 
          >
            {#each optcategoryResults as optcategories (optcategories.id)}
              <option value={optcategories.opt_category}>{optcategories.opt_category}</option>
            {/each}
          </select>
        </Label>

        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Antenna Type {#if errors.antennatype}<span class="text-rose-600 text-xs">{errors.antennatype}</span>{/if}
          </span>
          <select 
            class="w-full text-sm py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="optcategory" 
            placeholder="Antenna Type" 
            bind:value={siteData.antennatype}
          >
          {#each antennatypeResults as antennatypes (antennatypes.id)}
            <option value={antennatypes.antennatype}>{antennatypes.antennatype}</option>
          {/each}
          </select>
        </Label>
      </div>
    </div>

    <div class="flex gap-4">
      <Button color="purple" type="submit" class="w-fit py-1.5 px-3">Create</Button>
      <Button color='primary' on:click={() => {siteCreateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>
  {/if}

</Modal>
