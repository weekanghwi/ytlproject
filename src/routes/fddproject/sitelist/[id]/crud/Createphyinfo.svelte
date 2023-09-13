<script lang="ts">
  import { PhysicalSiteFormSchema } from '$lib/schemas';
  import { createEventDispatcher, onMount } from 'svelte';
  import { z } from 'zod'
  import { createphySiteData, fetchLSMData } from './crudphy'
  import { type PhysicalSiteData, type ErrorsRecord, createInitialphySiteData } from '$lib/types';
	import Icon from '@iconify/svelte';
  import { Button, Label, Input, Modal, TabItem, Tabs, NumberInput, Select } from 'flowbite-svelte';
  import { fetchAntennaTypeData } from '$lib/categoryapicall'

  export let physiteinfoCreateModal = false;
  export let _physiteinfoid: string;

  let physiteData: PhysicalSiteData = createInitialphySiteData();
  let lsmData: any = {};
  let errors: ErrorsRecord = {};
  let antennaTypes: string[] = [];

  const dispatch = createEventDispatcher();
  const crudSchema = PhysicalSiteFormSchema.extend({
    id: PhysicalSiteFormSchema.shape.id.optional(),
  })

  onMount(async () => {
    try {
      const antennaTypeData = await fetchAntennaTypeData();
      
      if (antennaTypeData) {
        antennaTypes = antennaTypeData.map((item: { antennatype: string }) => item.antennatype);
      } else {
        console.error('antennaTypeData is undefined or not in the expected format');
      }
    } catch (error) {
      console.error('Failed to fetch antenna types:', error);
    }
  });

  function calculateSecId(lsmData: any): number | null {
    if (lsmData.channelcard === 'LCC2_B1') {
      if (lsmData.cellnum === 0 || lsmData.cellnum === 2) {
        return 0;
      } else if (lsmData.cellnum === 9 || lsmData.cellnum === 11) {
        return 1;
      } else if (lsmData.cellnum === 18 || lsmData.cellnum === 20) {
        return 2;
      } else if (lsmData.cellnum === 3 || lsmData.cellnum === 5) {
        return 6;
      } else if (lsmData.cellnum === 12 || lsmData.cellnum === 14) {
        return 7;
      } else if (lsmData.cellnum === 21 || lsmData.cellnum === 23) {
        return 8;
      } else if (lsmData.cellnum === 1) {
        return 3;
      } else if (lsmData.cellnum === 10) {
        return 4;
      } else if (lsmData.cellnum === 19) {
        return 5;
      }
    }

    if (lsmData.channelcard === 'LCA3_A1') {
      if (lsmData.cellnum === 3 || lsmData.cellnum === 9) {
        return 0;
      } else if (lsmData.cellnum === 4 || lsmData.cellnum === 10) {
        return 1;
      } else if (lsmData.cellnum === 5 || lsmData.cellnum === 11) {
        return 2;
      } else if (lsmData.cellnum === 15) {
        return 6;
      } else if (lsmData.cellnum === 16) {
        return 7;
      } else if (lsmData.cellnum === 17) {
        return 8;
      } else if (lsmData.cellnum === 0) {
        return 3;
      } else if (lsmData.cellnum === 1) {
        return 4;
      } else if (lsmData.cellnum === 2) {
        return 5;
      } else if (lsmData.cellnum === 6) {
        return 9;
      } else if (lsmData.cellnum === 7) {
        return 10;
      } else if (lsmData.cellnum === 8) {
        return 11;
      }
    }

    return null;
  }

  async function fetchAndSetLSMData(_physiteinfoid: string) {
    try {
      const data = await fetchLSMData(_physiteinfoid);
      lsmData = data.results[0];
      physiteData = {
        ...physiteData,
        secid: calculateSecId(lsmData) as number,
        portnum: lsmData.cellnum,
        band: lsmData.freqband,
        sitebasicinfo: lsmData.siteid
      }
      return data;
    } catch (error) {
      console.error('Error:', error);
      lsmData = [];
      return [];
    }
  }
  $: fetchAndSetLSMData(_physiteinfoid);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    try {
      crudSchema.parse(physiteData);
      await createphySiteData(physiteData);
      physiteinfoCreateModal = false;
      errors = {};
      // siteData = createInitialSiteData();
      dispatch('physiteCreated');
    } catch (error) {
      console.error('Failed to create site data:', error);
      if (error instanceof z.ZodError) {
      error.errors.forEach(({ path, message }) => {
        errors[path[0]] = message;
      });
      }
    }
  }

  $: {
    if (physiteinfoCreateModal) {
      fetchAndSetLSMData(_physiteinfoid);
      // fetchAndSetBasesiteData(siteId);
    }
  }
</script>


<Modal bind:open={physiteinfoCreateModal} size="xs" autoclose={false} class="w-full">
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <p class="text-white text-lg mb-6">Physical Site ({physiteData.sitebasicinfo}) Info Update</p>
    <!-- sitebasicinfo hidden input -->
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={physiteData.id} type="hidden" />

    <div class="grid grid-cols-3 items-center justify-center space-x-2 mb-4">
      <p class="text-slate-800 rounded-md bg-slate-400 flex justify-center text-xs py-1">{physiteData.sitebasicinfo}</p>
      <p class="text-slate-800 rounded-md bg-slate-400 flex justify-center text-xs py-1">
        {#if physiteData.band === 20}
          800MHz
        {:else if physiteData.band === 38}
          2.6GHz
        {:else}
          2.3GHz
        {/if}
      <p class="text-slate-800 rounded-md flex justify-center text-xs py-1"
          class:bg-rose-400={physiteData.secid === 0 || physiteData.secid === 3}
          class:bg-green-400={physiteData.secid === 1 || physiteData.secid === 4}
          class:bg-blue-400={physiteData.secid === 2 || physiteData.secid === 5}>
        {#if physiteData.secid === 0 || physiteData.secid === 3}
          Alpha
        {:else if physiteData.secid === 1 || physiteData.secid === 4}
          Beta
        {:else}
          Gamma
        {/if}
    </div>

    <div class="flex flex-col gap-3">

      <div class="flex flex-col gap-1">
        <Label class="mb-1 flex items-center"><Icon icon="tabler:category" class="me-1 text-md" />Antenna Type</Label>
        <Select class="mt-2" bind:value={physiteData.antennatype}>
          {#each antennaTypes as antennaType}
          <option value={antennaType}>{antennaType}</option>
          {/each}
        </Select>
        {#if errors.antennatype}
        <p class="text-red-500 text-sm">{errors.antennatype}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-1">
        <Label class="mb-1 flex items-center"><Icon icon="tabler:arrow-autofit-height" class="me-1 text-md" />Antenna Height</Label>
        <NumberInput bind:value={physiteData.antennaheight} />
        {#if errors.antennaheight}
        <p class="text-red-500 text-sm">{errors.antennaheight}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-1">
        <Label class="mb-1 flex items-center"><Icon icon="mdi:sun-azimuth" class="me-1 text-md"/>Azimuth</Label>
        <NumberInput bind:value={physiteData.azimuth} />
        {#if errors.azimuth}
        <p class="text-red-500 text-sm">{errors.azimuth}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-1">
        <Label class="mb-1 flex items-center"><Icon icon="mdi:slope-downhill" class="me-1 text-md" />M-Tilt</Label>
        <NumberInput bind:value={physiteData.mtilt} />
        {#if errors.mtilt}
        <p class="text-red-500 text-sm">{errors.mtilt}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-1">
        <Label class="mb-1 flex items-center">
          <Icon icon="mdi:slope-downhill" class="me-1 text-md" />
          E-Tilt
          <small class="text-xs text-slate-500 ms-3">(No need to update ETILT if RET installed site)</small>
        </Label>
        <NumberInput bind:value={physiteData.etilt} />
        {#if errors.etilt}
        <p class="text-red-500 text-sm">{errors.etilt}</p>
        {/if}
      </div>

      <div class="flex items-center mt-4 gap-3">
        <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update</Button>
        <Button color='red' on:click={() => {physiteinfoCreateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
      </div>
    </div>
  </form>
</Modal>