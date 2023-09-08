<script lang="ts">
  import { fetchphysiteData, updatephySiteData } from './crudphy'
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

    <div class="grid grid-cols-3 items-center justify-center mb-4 text-center bg-indigo-400 rounded-lg p-2">
      <p class="text-slate-800 text-sm mb-2">Site ID</p>
      <p class="text-slate-800 text-sm mb-2">Sector</p>
      <p class="text-slate-800 text-sm mb-2">Band</p>
      <p class="text-slate-800 text-xs">{physiteData.sitebasicinfo}</p>
      <p class="text-slate-800 text-xs">
        {#if physiteData.secid === 0 || physiteData.secid === 3}
          Alpha
        {:else if physiteData.secid === 1 || physiteData.secid === 4}
          Beta
        {:else}
          Gamma
        {/if}
      </p>
      <p class="text-slate-800 text-xs">
        {#if physiteData.band === 20}
          FDD 800MHz
        {:else if physiteData.band === 40}
          TDD 2.3GHz
        {:else}
          TDD 2.6GHz
        {/if}
      </p>
    </div>
    <!-- sitebasicinfo hidden input -->
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={physiteData.id} type="hidden" />

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <Label class="mb-1">Antenna Type</Label>
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
        <Label class="mb-1">Antenna Height</Label>
        <NumberInput bind:value={physiteData.antennaheight} />
        {#if errors.antennaheight}
        <p class="text-red-500 text-sm">{errors.antennaheight}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-1">
        <Label class="mb-1">Azimuth</Label>
        <NumberInput bind:value={physiteData.azimuth} />
        {#if errors.azimuth}
        <p class="text-red-500 text-sm">{errors.azimuth}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-1">
        <Label class="mb-1">M-Tilt</Label>
        <NumberInput bind:value={physiteData.mtilt} />
        {#if errors.mtilt}
        <p class="text-red-500 text-sm">{errors.mtilt}</p>
        {/if}
      </div>

      <div class="flex items-center mt-4 gap-3">
        <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update</Button>
        <Button color='red' on:click={() => {physiteinfoUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
      </div>
    </div>
  </form>
</Modal>