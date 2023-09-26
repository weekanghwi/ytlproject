<script lang="ts">
  import { type OPTReviewData, type ErrorsRecord, createInitialOPTReviewData } from '$lib/types';
  import { fetchOPTData, createOPTReviewData } from './crud'
  import { fetchPICData, fetchOPTReviewStatusData } from '$lib/categoryapicall';
  import { Modal, Label, Input, Button, Select, Textarea } from 'flowbite-svelte';
  import { z } from 'zod'
  import { OPTReviewFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  export let createOPTReviewModal = false;
  export let siteId: string;
  export let search: () => Promise<void>;

  let picselect: { value: string; name: string }[] = [];
  let optreviewstatusselect: { value: string; name: string }[] = [];
  let optreviewData: OPTReviewData = createInitialOPTReviewData();
  let errors: ErrorsRecord = {}

  const crudSchema = OPTReviewFormSchema.extend({
    id: OPTReviewFormSchema.shape.id.optional(),
  })

  async function fetchAndSetPICData() {
    try {
      const data = await fetchPICData();
      picselect = data
        .map(pic => ({ value: pic.pic, name: pic.pic}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      picselect = [];
      return [];
    }
  }
  $: fetchAndSetPICData();

  async function fetchAndSetOPTReviewStatusData() {
    try {
      const data = await fetchOPTReviewStatusData();
      optreviewstatusselect = data
        .map(status => ({ value: status.reviewstatus, name: status.reviewstatus}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      optreviewstatusselect = [];
      return [];
    }
  }
  $: fetchAndSetOPTReviewStatusData();

  $: if (siteId) {
    (async () => {
      try {
        const data = await fetchOPTData(siteId);
        optreviewData = data;
      } catch (error) {
        console.error('Failed to fetch DO data:', error);
      }
    })();
    errors = {};
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    Object.keys(optreviewData).forEach((key: string) => {
      const k = key as keyof OPTReviewData
      if (optreviewData[k] === "") {
        (optreviewData[k] as string | null) = null;
      }
    })

    try {
      crudSchema.parse(optreviewData);
      await createOPTReviewData(optreviewData);
      createOPTReviewModal = false;
      errors = {};
      // dispatch('doUpdated');

      if (search) {
        await search();
      }
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

<Modal bind:open={createOPTReviewModal} size="xs" autoclose={false} class="w-full">
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-6">
      <h3 class="text-md font-medium text-gray-900 dark:text-white">Create OPT Review</h3>
      <p class="text-sm text-slate-500">({optreviewData.sitebasicinfo})</p>
    </div>
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={optreviewData.id} type="hidden" />
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={optreviewData.sitebasicinfo} type="hidden" />

    <div class="flex flex-col gap-3 mb-4 pb-4">
      {optreviewData.sitebasicinfo} Review data
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-3 mb-4 pb-4">
        <div class="flex items-center w-full gap-4">
          <Label class="space-y-2 w-full">
            <span class="text-slate-800 dark:text-slate-400">
              Review Date {#if errors.reviewdate}<span class="text-rose-600 text-xs"> !{errors.reviewdate}</span>{/if}
            </span>
            <Input 
              class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
              name="reviewdate" 
              placeholder="Review Date" 
              bind:value={optreviewData.reviewdate} type="date"
            />
          </Label>
        </div>
      </div>
      <div class="flex flex-col gap-3 mb-4 pb-4">
        <div class="flex items-center w-full gap-4">
          <Label class="space-y-2 w-full">
            <span class="text-slate-800 dark:text-slate-400">
              PIC {#if errors.pic}<span class="text-rose-600 text-xs"> !{errors.pic}</span>{/if}
            </span>
            <Select 
              class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
              name="pci" 
              items={picselect} bind:value={optreviewData.pic}
            />
          </Label>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Review Detail {#if errors.reviewdetail}<span class="text-rose-600 text-xs"> !{errors.reviewdetail}</span>{/if}
          </span>
          <Textarea 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="reviewdetail" 
            placeholder="Review Detail" 
            bind:value={optreviewData.reviewdetail} rows="5"
          />
        </Label>
      </div>
    </div>

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Review Status {#if errors.reviewstatus}<span class="text-rose-600 text-xs"> !{errors.reviewstatus}</span>{/if}
          </span>
          <Select 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="reviewstatus" 
            items={optreviewstatusselect} bind:value={optreviewData.reviewstatus}
          />
        </Label>
      </div>
    </div>

    <div class="flex gap-4 mt-5">
      <Button color="green" type="submit" class="w-fit py-1.5 px-3">Create OPT Review</Button>
      <Button color='red' on:click={() => {createOPTReviewModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>

  </form>
</Modal>