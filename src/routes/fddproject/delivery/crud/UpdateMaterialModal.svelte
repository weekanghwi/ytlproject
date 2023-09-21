<script lang="ts">
  import { type MaterialData, type ErrorsRecord, createInitialmaterialData } from '$lib/types';
  import { fetchMaterialData, updateMaterialData } from './crud'
  import { Modal, Label, Input, Button, Select, Textarea } from 'flowbite-svelte';
  import { z } from 'zod'
  import { MaterialFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  export let materialUpdateModal = false;
  export let siteId: string;
  export let search: () => Promise<void>;

  let materialData: MaterialData = createInitialmaterialData();
  let errors: ErrorsRecord = {}
  let materialSelect = [
    { value: null, name: 'None'},
    { value: 'Samsung-Material', name: 'Samsung'},
    { value: 'Reuse-Material', name: 'Re-use'}
  ]

  const crudSchema = MaterialFormSchema.extend({
    id: MaterialFormSchema.shape.id.optional(),
  })

  $: if (siteId) {
    (async () => {
      try {
        const data = await fetchMaterialData(siteId);
        materialData = data;
      } catch (error) {
        console.error('Failed to fetch DO data:', error);
      }
    })();
    errors = {};
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    Object.keys(materialData).forEach((key: string) => {
      const k = key as keyof MaterialData
      if (materialData[k] === "") {
        (materialData[k] as string | null) = null;
      }
    })

    try {
      crudSchema.parse(materialData);
      await updateMaterialData(siteId, materialData);
      materialUpdateModal = false;
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

<Modal bind:open={materialUpdateModal} size="xs" autoclose={false} class="w-full">
  {#if materialData}
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-6">
      <Icon icon="devicon-plain:angularmaterial" class="text-2xl "/>
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Update Material Information</h3>
      <p class="text-sm text-slate-500">({materialData.sitebasicinfo})</p>
    </div>
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={materialData.id} type="hidden" />

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
            bind:value={materialData.sitebasicinfo} type="text" disabled
          />
        </Label>
      </div>
    </div>

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            DU Material {#if errors.dumaterial}<span class="text-rose-600 text-xs"> !{errors.dumaterial}</span>{/if}
          </span>
          <Select 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="dumaterial" 
            items={materialSelect}
            bind:value={materialData.dumaterial}
          />
        </Label>
      </div>
    </div>

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            RU Material {#if errors.rumaterial}<span class="text-rose-600 text-xs"> !{errors.rumaterial}</span>{/if}
          </span>
          <Select 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="rumaterial" 
            items={materialSelect}
            bind:value={materialData.rumaterial}
          />
        </Label>
      </div>
    </div>

    <div class="flex flex-col gap-3 mb-4 pb-4">
      <div class="flex items-center w-full gap-4">
        <Label class="space-y-2 w-full">
          <span class="text-slate-800 dark:text-slate-400">
            Remark {#if errors.remark}<span class="text-rose-600 text-xs"> !{errors.remark}</span>{/if}
          </span>
          <Textarea 
            class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
            name="remark"
            rows="3"
            bind:value={materialData.remark}
          />
        </Label>
      </div>
    </div>

    <div class="flex gap-4">
      <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update Material info</Button>
      <Button color='red' on:click={() => {materialUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>
  {/if}
</Modal>