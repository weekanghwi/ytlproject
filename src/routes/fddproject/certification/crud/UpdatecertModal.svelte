<script lang="ts">
  import { type CertiData, type ErrorsRecord, createInitialCertiData } from '$lib/types';
  import { fetchPACApproveStatusData, fetchFACApproveStatusData } from '$lib/categoryapicall';
  import { fetchCertiData, updateCertiData } from './crud'
  import { Modal, Label, Input, Button, Select, Tabs, TabItem } from 'flowbite-svelte';
  import { z } from 'zod'
  import { CertiFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  export let certificationUpdateModal = false;
  export let siteId: string;
  export let search: () => Promise<void>;
  let pacapprovestatusData: { value: string; name: string } [] = [];
  let facapprovestatusData: { value: string; name: string } [] = [];

  let CertiData: CertiData = createInitialCertiData();
  let errors: ErrorsRecord = {}

  const crudSchema = CertiFormSchema.extend({
    id: CertiFormSchema.shape.id.optional(),
  })

  async function fetchAndSetPACApproveStatusData() {
    try {
      const data = await fetchPACApproveStatusData();
      pacapprovestatusData = data
        .map(pacapprovestatus => ({ value: pacapprovestatus.pacapprovestatus, name: pacapprovestatus.pacapprovestatus}));
        return data;
    } catch (error) {
      console.error('Error:', error);
      pacapprovestatusData = [];
      return []
    }
  }
  $: fetchAndSetPACApproveStatusData()

  async function fetchAndSetFACApproveStatusData() {
    try {
      const data = await fetchFACApproveStatusData();
      facapprovestatusData = data
        .map(facapprovestatus => ({ value: facapprovestatus.facapprovestatus, name: facapprovestatus.facapprovestatus}));
        return data;
    } catch (error) {
      console.error('Error:', error);
      facapprovestatusData = [];
      return []
    }
  }
  $: fetchAndSetFACApproveStatusData()

  $: if (siteId) {
    (async () => {
      try {
        const data = await fetchCertiData(siteId);
        CertiData = data;
      } catch (error) {
        console.error('Failed to fetch SSV data:', error);
      }
    })();
    errors = {};
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      crudSchema.parse(CertiData);
      await updateCertiData(siteId, CertiData);
      certificationUpdateModal = false;
      errors = {};
      if (search) {
        await search();
      }
    } catch (error) {
      console.error('Failed to update Certi data:', error);
      if (error instanceof z.ZodError) {
      error.errors.forEach(({ path, message }) => {
        errors[path[0]] = message;
      });
      }
    }
  }
</script>


<Modal bind:open={certificationUpdateModal} size="xs" autoclose={false} class="w-full">
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-6">
      <h3 class="text-md font-medium text-gray-900 dark:text-white">Update Optimization Information</h3>
      <p class="text-sm text-slate-500">({CertiData.sitebasicinfo})</p>
    </div>
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={CertiData.id} type="hidden" />

    <!-- Optimization form data -->
    <div class="grid grid-2 items-center">
      <div class="flex mb-3">
        <Label for="pacsubmitdate">PAC Submit Date</Label>
      </div>
      <div class="flex mb-3">
        <Input 
          class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
          name="pacsubmitdate" 
          placeholder="PAC Submit Date" 
          bind:value={CertiData.pacsubmitdate} type="date"
        />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.pacsubmitdate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.pacsubmitdate}</span>{/if}
      </div>

      <div class="flex mb-4">
        <Label for="facsubmitdate">FAC Submit Date</Label>
      </div>
      <div class="flex mb-3">
        <Input 
          class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
          name="facsubmitdate" 
          placeholder="FAC Submit Date" 
          bind:value={CertiData.facsubmitdate} type="date"
        />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.facsubmitdate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.facsubmitdate}</span>{/if}
      </div>

      <div class="flex mb-3">
        <Label for="pacapprovestatus">PAC Approve Status</Label>
      </div>
      <div class="flex mb-3">
        <Select
          class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
          items={pacapprovestatusData} bind:value={CertiData.pacapprovestatus} />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.pacapprovestatus}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.pacapprovestatus}</span>{/if}
      </div>

      <div class="flex mb-3">
        <Label for="facapprovestatus">FAC Approve Status</Label>
      </div>
      <div class="flex mb-3">
        <Select
          class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
          items={facapprovestatusData} bind:value={CertiData.facapprovestatus} />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.facapprovestatus}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.facapprovestatus}</span>{/if}
      </div>


    <div class="flex gap-4 mt-5">
      <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update Certi</Button>
      <Button color='red' on:click={() => {certificationUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>
</Modal>