<script lang="ts">
  import { fetchphysiteData, updatephySiteData, fetchLSMData } from './crudphy'
  import { type PhysicalSiteData, type ErrorsRecord, createInitialphySiteData } from '$lib/types';
  import { PhysicalSiteFormSchema } from '$lib/schemas';
  import { createEventDispatcher, onMount } from 'svelte';
  import { z } from 'zod'
	import { Button, Label, Input, Modal, Select, NumberInput } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
  import { fetchAntennaTypeData } from '$lib/categoryapicall'

  export let physiteinfoUpdateModal = false;
  export let _cellidentity: string;
  export let _physiteinfoid: string;

  let physiteData: PhysicalSiteData = createInitialphySiteData();
  let errors: ErrorsRecord = {}
  let previousIdentity: string;
  let antennaTypes: string[] = [];
  let lsm: any;

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

  $: if (_physiteinfoid && _physiteinfoid !== previousIdentity) {
    (async () => {
      try {
        const data = await fetchphysiteData(_physiteinfoid);
        physiteData = data.results[0];
      } catch (error) {
        console.error('Failed to fetch physical site data:', error);
      }
      previousIdentity = _physiteinfoid;

    })();
    errors = {};
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    try {
      crudSchema.parse(physiteData);
      await updatephySiteData(_cellidentity, physiteData);
      physiteinfoUpdateModal = false;
      errors = {};
      // siteData = createInitialSiteData();
      dispatch('physiteUpdated');
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



<Modal bind:open={physiteinfoUpdateModal} size="xs" autoclose={false} class="w-full">
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-4">
      <Icon icon="codicon:radio-tower" class="font-semibold text-lg text-slate-400"/>
      <p class="text-slate-400 text-lg">Physical Site Info Update</p>
    </div>
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

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <Label class="mb-1 flex items-center"><Icon icon="tabler:category" class="me-1 text-md" />Antenna Type</Label>
        <Select bind:value={physiteData.antennatype}>
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
        <Button color='red' on:click={() => {physiteinfoUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
      </div>
    </div>
  </form>
</Modal>