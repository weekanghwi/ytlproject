<script lang="ts">
  import { type doData, type ErrorsRecord, createInitialdoData } from '$lib/types';
  import { createEventDispatcher } from 'svelte';
  import { fetchDOData, updateDOData } from './crud'
  import { Modal, Label, Input, Button } from 'flowbite-svelte';
  import { z } from 'zod'
  import { DoFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  export let doUpdateModal = false;
  export let siteId: string;
  export let search: () => Promise<void>;

  let doData: doData = createInitialdoData();
  let errors: ErrorsRecord = {}

  const crudSchema = DoFormSchema.extend({
    id: DoFormSchema.shape.id.optional(),
  })

  $: if (siteId) {
    (async () => {
      try {
        const data = await fetchDOData(siteId);
        doData = data;
      } catch (error) {
        console.error('Failed to fetch DO data:', error);
      }
    })();
    errors = {};
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!doData.doissuedate || doData.doissuedate === "") {
        doData.doissuedate = null;
    }


    try {
      crudSchema.parse(doData);
      await updateDOData(siteId, doData);
      doUpdateModal = false;
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

<Modal bind:open={doUpdateModal} size="xs" autoclose={false} class="w-full">
  {#if doData}
  
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-6">
      <Icon icon="carbon:delivery-add" class="text-2xl "/>
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Update DO Information</h3>
      <p class="text-sm text-slate-500">({doData.sitebasicinfo})</p>
    </div>
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={doData.id} type="hidden" />

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Site ID {#if errors.sitebasicinfo}<span class="text-rose-600 text-xs"> !{errors.sitebasicinfo}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="site_id" 
            placeholder="Site ID" 
            bind:value={doData.sitebasicinfo} type="text" disabled
          />
        </Label>
      </div>
    </div>

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            DO Date
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="doissuedate" 
            placeholder="DO Date" 
            bind:value={doData.doissuedate} type="date" 
          />
          {#if errors.doissuedate}<span class="text-rose-600 text-xs"> !{errors.doissuedate}</span>{/if}
        </Label>
      </div>
    </div>

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            COD Submit Date
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="codsubmitdate" 
            placeholder="COD Submit Date" 
            bind:value={doData.codsubmitdate} type="date" 
          />
          {#if errors.codsubmitdate}<span class="text-rose-600 text-xs"> !{errors.codsubmitdate}</span>{/if}
        </Label>
      </div>
    </div>

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            COD Approve Date
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="codapprovedate" 
            placeholder="COD Approve Date" 
            bind:value={doData.codapprovedate} type="date" 
          />
          {#if errors.codapprovedate}<span class="text-rose-600 text-xs"> !{errors.codapprovedate}</span>{/if}
        </Label>
      </div>
    </div>

    <div class="flex gap-4">
      <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update DO info</Button>
      <Button color='red' on:click={() => {doUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>
  {/if}

</Modal>