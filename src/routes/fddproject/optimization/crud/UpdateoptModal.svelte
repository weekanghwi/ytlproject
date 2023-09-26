<script lang="ts">
  import { type OPTData, type ErrorsRecord, createInitialOPTData } from '$lib/types';
  import { fetchOPTTypeData, fetchSubconData, fetchOPTIssueData } from '$lib/categoryapicall';
  import { fetchOPTData, updateOPTData } from './crud'
  import { Modal, Label, Input, Button, Select, Tabs, TabItem, Textarea } from 'flowbite-svelte';
  import { z } from 'zod'
  import { OPTFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  export let optUpdateModal = false;
  export let siteId: string;
  export let search: () => Promise<void>;
  let subconSelectData: { value: string; name: string }[] = [];
  let opttypeSelectData: { value: string; name: string }[] = [];
  let optissueSelectData: { value: string; name: string }[] = [];

  let OPTData: OPTData = createInitialOPTData();
  let errors: ErrorsRecord = {}

  const crudSchema = OPTFormSchema.extend({
    id: OPTFormSchema.shape.id.optional(),
  })

  async function fetchAndSetSubconData() {
    try {
      const data = await fetchSubconData();
      subconSelectData = data
        .filter(subconcategory => subconcategory.type === 'Service')
        .map(subcon => ({ value: subcon.subcon, name: subcon.subcon}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      subconSelectData = [];
      return [];
    }
  }
  $: fetchAndSetSubconData();

  async function fetchAndSetOPTIssueData() {
    try {
      const data = await fetchOPTIssueData();
      optissueSelectData = data
        .map(optissue => ({ value: optissue.optissuetype, name: optissue.optissuetype }));
      return data;
    } catch (error) {
      console.error('Error:', error);
      optissueSelectData = [];
      return [];
    }
  }
  $: fetchAndSetOPTIssueData();

  async function fetchAndSetOpttype() {
    try {
      const data = await fetchOPTTypeData();
      opttypeSelectData = data
        .map(opttype => ({ value: opttype.opttype, name: opttype.opttype}))
      return data;
    } catch (error) {
      console.error('Error:', error);
      opttypeSelectData = [];
      return [];
    }
  }
  $: fetchAndSetOpttype();

  $: if (siteId) {
    (async () => {
      try {
        const data = await fetchOPTData(siteId);
        OPTData = data;
      } catch (error) {
        console.error('Failed to fetch SSV data:', error);
      }
    })();
    errors = {};
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      crudSchema.parse(OPTData);
      await updateOPTData(siteId, OPTData);
      optUpdateModal = false;
      errors = {};
      if (search) {
        await search();
      }
    } catch (error) {
      console.error('Failed to update OPT data:', error);
      if (error instanceof z.ZodError) {
      error.errors.forEach(({ path, message }) => {
        errors[path[0]] = message;
      });
      }
    }
  }
</script>

<Modal bind:open={optUpdateModal} size="xs" autoclose={false} class="w-full">
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-6">
      <h3 class="text-md font-medium text-gray-900 dark:text-white">Update Optimization Information</h3>
      <p class="text-sm text-slate-500">({OPTData.sitebasicinfo})</p>
    </div>
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={OPTData.id} type="hidden" />

    <!-- Optimization form data -->
    <div class="grid grid-cols-2 mt-4">
      <div class="flex mb-3">
        <Label for="opttype">OPT Type</Label>
      </div>
      <div class="flex mb-3">
        <Select
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
            items={opttypeSelectData} bind:value={OPTData.opttype} />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.opttype}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.opttype}</span>{/if}
      </div>

      <div class="flex mb-3">
        <Label for="optsubcon">OPT Sub-Contractor</Label>
      </div>
      <div class="flex mb-3">
        <Select
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
            items={subconSelectData} bind:value={OPTData.optsubcon} />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.optsubcon}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.optsubcon}</span>{/if}
      </div>

      <div class="flex mb-3">
        <Label for="optstartdate">OPT Start Date</Label>
      </div>
      <div class="flex mb-3">
        <Input 
          class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
          name="optstartdate" 
          placeholder="OPT Start Date" 
          bind:value={OPTData.optstartdate} type="date"
        />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.optstartdate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.optstartdate}</span>{/if}
      </div>

      <div class="flex mb-3">
        <Label for="optcompletedate">OPT Complete Date</Label>
      </div>
      <div class="flex mb-3">
        <Input 
          class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
          name="optcompletedate" 
          placeholder="OPT Complete Date" 
          bind:value={OPTData.optcompletedate} type="date"
        />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.optcompletedate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.optcompletedate}</span>{/if}
      </div>

      <div class="flex mb-3">
        <Label for="optsubmitdate">OPT Report Submit Date</Label>
      </div>
      <div class="flex mb-3">
        <Input 
          class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
          name="optsubmitdate" 
          placeholder="OPT Report Submit Date" 
          bind:value={OPTData.optsubmitdate} type="date"
        />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.optsubmitdate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.optsubmitdate}</span>{/if}
      </div>

      <div class="flex mb-3">
        <Label for="optapprovedate">OPT Approve Date</Label>
      </div>
      <div class="flex mb-3">
        <Input 
          class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
          name="optapprovedate" 
          placeholder="OPT Approve Date" 
          bind:value={OPTData.optapprovedate} type="date"
        />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.optapprovedate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.optapprovedate}</span>{/if}
      </div>

      <div class="flex mb-3">
        <Label for="optapprovedate">OPT Issue</Label>
      </div>
      <div class="flex mb-3">
        <Select
          class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
          items={optissueSelectData} bind:value={OPTData.optissuetype} />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.optissuetype}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.optissuetype}</span>{/if}
      </div>

      {#if OPTData.optissuetype}
      <div class="flex col-span-2 mb-3">
        <Textarea
          class="rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
          placeholder="SSV Issue Detail"
          rows="2" 
          bind:value={OPTData.optissuedetail} />
      </div>
      <div class="flex itemx-center col-span-2 mb-2">
        {#if errors.optissuedetail}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.optissuedetail}</span>{/if}
      </div>
      {/if}

    </div>

    <div class="flex gap-4 mt-5">
      <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update OPT info</Button>
      <Button color='red' on:click={() => {optUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>
</Modal>