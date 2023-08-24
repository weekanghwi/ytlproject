<script lang="ts">
  import { type doData, type ErrorsRecord, createInitialdoData } from '$lib/types';
  import { createEventDispatcher } from 'svelte';
  import { createDOData } from './crud'
  import { Modal, Label, Input, Button, NumberInput } from 'flowbite-svelte';
  import { z } from 'zod'
  import { DoFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();
  export let doCreateModal = false;

  let doData: doData = createInitialdoData();
  let errors: ErrorsRecord = {}

  const crudSchema = DoFormSchema.extend({
    id: DoFormSchema.shape.id.optional(),
  })

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    // siteData.cluster = selectedCluster ? selectedCluster.cluster_name : siteData.cluster;

    try {
      crudSchema.parse(doData);
      await createDOData(doData);
      doCreateModal = false;
      errors = {};
      doData = createInitialdoData();
      dispatch('doCreated');
    } catch (error) {
      console.error('Failed to update DO data:', error);
      if (error instanceof z.ZodError) {
      error.errors.forEach(({ path, message }) => {
        errors[path[0]] = message;
      });
      }
    }
  }
</script>

<Modal bind:open={doCreateModal} size="md" autoclose={false} class="w-full">
  {#if doData}
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-6">
      <Icon icon="carbon:delivery-add" class="text-2xl "/>
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Create DO Information</h3>
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
            bind:value={doData.sitebasicinfo} type="text" 
          />
        </Label>

        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            DO Number {#if errors.do_number}<span class="text-rose-600 text-xs"> !{errors.do_number}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="do_number" 
            placeholder="DO Number" 
            bind:value={doData.do_number} type="number" 
          />
        </Label>
      </div>
    </div>

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            DO Date {#if errors.do_issue_date}<span class="text-rose-600 text-xs"> !{errors.do_issue_date}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="do_issue_date" 
            placeholder="DO Date" 
            bind:value={doData.do_issue_date} type="date" 
          />
        </Label>

        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            DO Delay {#if errors.do_delay}<span class="text-rose-600 text-xs"> !{errors.do_delay}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="do_delay" 
            placeholder="DO Delay" 
            bind:value={doData.do_delay} type="text" 
          />
        </Label>
      </div>
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            DO Delay Detail {#if errors.do_delay_detail}<span class="text-rose-600 text-xs"> !{errors.do_delay_detail}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="do_delay_detail" 
            placeholder="DO Delay Detail" 
            bind:value={doData.do_delay_detail} type="text" 
          />
        </Label>
      </div>
    </div>

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            CDO Submit Date {#if errors.cod_submit_to_ytl_date}<span class="text-rose-600 text-xs"> !{errors.cod_submit_to_ytl_date}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="cod_submit_to_ytl_date" 
            placeholder="CDO Submit Date" 
            bind:value={doData.cod_submit_to_ytl_date} type="date" 
          />
        </Label>

        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            CDO Approve Date {#if errors.cod_approval_date}<span class="text-rose-600 text-xs"> !{errors.cod_approval_date}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="cod_approval_date" 
            placeholder="CDO Approve Date" 
            bind:value={doData.cod_approval_date} type="date" 
          />
        </Label>

        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            CDO Delay {#if errors.cod_delay}<span class="text-rose-600 text-xs"> !{errors.cod_delay}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="cod_delay" 
            placeholder="CDO Delay" 
            bind:value={doData.cod_delay} type="text" 
          />
        </Label>
      </div>
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            CDO Delay Detail {#if errors.cod_delay_detail}<span class="text-rose-600 text-xs"> !{errors.cod_delay_detail}</span>{/if}
          </span>
          <Input 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="cod_delay_detail" 
            placeholder="CDO Delay Detail" 
            bind:value={doData.cod_delay_detail} type="text" 
          />
        </Label>
      </div>
    </div>

    <div class="flex gap-4">
      <Button color="purple" type="submit" class="w-fit py-1.5 px-3">Create DO Info</Button>
      <Button color='primary' on:click={() => {doCreateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>
  {/if}
</Modal>