<script lang="ts">
  import { PhysicalSiteFormSchema } from '$lib/schemas';
  import { createEventDispatcher, onMount } from 'svelte';
  import { z } from 'zod'
  import { fetchsiteData, createphySiteData } from './crudphy'
  import { type PhysicalSiteData, type SiteData, type ErrorsRecord, createInitialphySiteData, createInitialSiteData } from '$lib/types';
	import Icon from '@iconify/svelte';
  import { Button, Label, Input, Modal, TabItem, Tabs, NumberInput, Select } from 'flowbite-svelte';
  import { fetchAntennaTypeData } from '$lib/categoryapicall'

  export let physiteinfoCreateModal = false;
  export let siteId: string;

  let physiteData: PhysicalSiteData = createInitialphySiteData();
  let basesiteData: any = {}
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

  async function fetchAndSetBasesiteData(siteId: string) {
    try {
      const data = await fetchsiteData(siteId);
      basesiteData = data.results[0];
      physiteData = {
        ...physiteData,
        sitebasicinfo: basesiteData.id
      }
      return data;
    } catch (error) {
      console.error('Error:', error);
      basesiteData = [];
      return [];
    }
  }
  $: fetchAndSetBasesiteData(siteId);

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


</script>


<Modal bind:open={physiteinfoCreateModal} size="xs" autoclose={false} class="w-full">
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <p class="text-white text-lg mb-6">Physical Site ({physiteData.uid}) Info Update</p>
    <!-- sitebasicinfo hidden input -->
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={physiteData.id} type="hidden" />

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <Label class="mb-1">Antenna Type</Label>
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
        <Button color='red' on:click={() => {physiteinfoCreateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
      </div>
    </div>
  </form>
</Modal>