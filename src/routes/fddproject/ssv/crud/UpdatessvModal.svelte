<script lang="ts">
  import { type SSVData, type ErrorsRecord, createInitialSSVData } from '$lib/types';
  import { fetchSubconData } from '$lib/categoryapicall';
  import { fetchSSVData, updateSSVData } from './crud'
  import { Modal, Label, Input, Button, Select, Tabs, TabItem } from 'flowbite-svelte';
  import { z } from 'zod'
  import { SSVFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  export let ssvUpdateModal = false;
  export let siteId: string;
  export let search: () => Promise<void>;
  let subconSelectData: { value: string; name: string }[] = [];

  let SSVData: SSVData = createInitialSSVData();
  let errors: ErrorsRecord = {}

  const crudSchema = SSVFormSchema.extend({
    id: SSVFormSchema.shape.id.optional(),
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

  $: if (siteId) {
    (async () => {
      try {
        const data = await fetchSSVData(siteId);
        SSVData = data;
      } catch (error) {
        console.error('Failed to fetch SSV data:', error);
      }
    })();
    errors = {};
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    // siteData.cluster = selectedCluster ? selectedCluster.cluster_name : siteData.cluster;

    try {
      crudSchema.parse(SSVData);
      await updateSSVData(siteId, SSVData);
      ssvUpdateModal = false;
      errors = {};
      if (search) {
        await search();
      }
    } catch (error) {
      console.error('Failed to update SSV data:', error);
      if (error instanceof z.ZodError) {
      error.errors.forEach(({ path, message }) => {
        errors[path[0]] = message;
      });
      }
    }
  }
</script>


<Modal bind:open={ssvUpdateModal} size="sm" autoclose={false} class="w-full">
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-6">
      <h3 class="text-md font-medium text-gray-900 dark:text-white">Update SSV Information</h3>
      <p class="text-sm text-slate-500">({SSVData.sitebasicinfo})</p>
    </div>
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={SSVData.id} type="hidden" />

    <!-- Form data-->
    <div class="flex flex-col">
      <!-- Basic Information -->
      <div class="flex gap-4 mb-4">
        <p class="text-slate-400">{SSVData.sitebasicinfo}</p>
        <p class="text-slate-400">{SSVData.sitebasicinfo}</p>
      </div>

      <div class="grid grid-cols-2 items-center px-2 w-full mb-3">
        <div class="flex items-center">
          <Label for="ssvstartdate">SSV Sub Contractor</Label>
        </div>
        <div class="flex items-center">
          <Select
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
            items={subconSelectData} bind:value={SSVData.ssvsubcon} />
          
        </div>
        <div class="flex itemx-center col-span-2">
          {#if errors.ssvsubcon}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.ssvsubcon}</span>{/if}
        </div>
      </div>

      <!-- SSV Form -->
      <div class="flex flex-col w-full mb-3">
        <div class="flex items-center gap-2 pl-2 font-bold w-full bg-slate-700 mb-3 py-1.5 rounded-md">
          <Icon icon="mdi:laptop" />
          <h5 class="text-slate-800 dark:text-slate-400">SSV Act status</h5>
        </div>
        <div class="grid grid-cols-2 items-center px-2 w-full mb-3">
          <div class="flex items-center">
            <Label for="ssvstartdate">SSV Start Date</Label>
          </div>
          <div class="flex items-center">
            <Input 
              class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
              name="ssvstartdate" 
              placeholder="SSV Start Date" 
              bind:value={SSVData.ssvstartdate} type="date"
            />
          </div>
          <div class="flex itemx-center col-span-2">
            {#if errors.ssvstartdate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.ssvstartdate}</span>{/if}
          </div>
        </div>

        <div class="grid grid-cols-2 items-center px-2 w-full mb-3">
          <div class="flex items-center">
            <Label for="ssvcompletedate">SSV Complete Date</Label>
          </div>
          <div class="flex items-center">
            <Input 
              class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
              name="ssvcompletedate" 
              placeholder="SSV Complete Date" 
              bind:value={SSVData.ssvcompletedate} type="date"
            />
          </div>
          <div class="flex itemx-center col-span-2">
            {#if errors.ssvcompletedate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.ssvcompletedate}</span>{/if}
          </div>
        </div>

        <div class="grid grid-cols-2 items-center px-2 w-full mb-3">
          <div class="flex items-center">
            <Label for="ssvsubmitdate">SSV Submit Date</Label>
          </div>
          <div class="flex items-center">
            <Input 
              class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
              name="ssvsubmitdate" 
              placeholder="SSV Submit Date" 
              bind:value={SSVData.ssvsubmitdate} type="date"
            />
          </div>
          <div class="flex itemx-center col-span-2">
            {#if errors.ssvsubmitdate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.ssvsubmitdate}</span>{/if}
          </div>
        </div>
      </div>

      <!-- BS Report Form -->
      <div class="flex flex-col items-center w-full">
        <div class="flex items-center gap-2 pl-2 font-bold w-full bg-slate-700 mb-3 py-1.5 rounded-md">
          <Icon icon="ep:document" />
          <h5 class="text-slate-800 dark:text-slate-400">BS Report Status</h5>
        </div>
        <div class="grid grid-cols-2 items-center px-2 w-full mb-3">
          <div class="flex items-center">
            <Label for="bsreceivedate">BS Report Receive Date</Label>
          </div>
          <div class="flex items-center">
            <Input 
              class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
              name="bsreceivedate" 
              placeholder="BS Report Receive Date" 
              bind:value={SSVData.bsreceivedate} type="date"
            />
          </div>
          <div class="flex itemx-center col-span-2">
            {#if errors.bsreceivedate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.bsreceivedate}</span>{/if}
          </div>
        </div>

        <div class="grid grid-cols-2 items-center px-2 w-full mb-3">
          <div class="flex items-center">
            <Label for="bssubmitdate">BS Report Submit Date</Label>
          </div>
          <div class="flex items-center">
            <Input 
              class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
              name="bssubmitdate" 
              placeholder="BS Report Submit Date" 
              bind:value={SSVData.bssubmitdate} type="date"
            />
          </div>
          <div class="flex itemx-center col-span-2">
            {#if errors.bssubmitdate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.bssubmitdate}</span>{/if}
          </div>
        </div>

        <div class="grid grid-cols-2 items-center px-2 w-full mb-3">
          <div class="flex items-center">
            <Label for="bsapprovedate">BS Report Approve Date</Label>
          </div>
          <div class="flex items-center">
            <Input 
              class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
              name="bsapprovedate" 
              placeholder="BS Report Approve Date" 
              bind:value={SSVData.bsapprovedate} type="date"
            />
          </div>
          <div class="flex itemx-center col-span-2">
            {#if errors.bsapprovedate}<span class="text-rose-600 text-xs col-span-2 mb-4"> !{errors.bsapprovedate}</span>{/if}
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-4 mt-5">
      <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update SSV info</Button>
      <Button color='red' on:click={() => {ssvUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>
</Modal>