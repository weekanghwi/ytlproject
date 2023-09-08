<script lang="ts">
  import { type CertiData, type ErrorsRecord, createInitialCertiData } from '$lib/types';
  import { fetchOPTTypeData, fetchSubconData } from '$lib/categoryapicall';
  import { fetchCertiData, updateCertiData } from './crud'
  import { Modal, Label, Input, Button, Select, Tabs, TabItem } from 'flowbite-svelte';
  import { z } from 'zod'
  import { CertiFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  export let certificationUpdateModal = false;
  export let siteId: string;
  export let search: () => Promise<void>;
  let subconSelectData: { value: string; name: string }[] = [];
  let opttypeSelectData: { value: string; name: string }[] = [];

  let CertiData: CertiData = createInitialCertiData();
  let errors: ErrorsRecord = {}

  const crudSchema = CertiFormSchema.extend({
    id: CertiFormSchema.shape.id.optional(),
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


    <div class="flex gap-4 mt-5">
      <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update SSV info</Button>
      <Button color='red' on:click={() => {certificationUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>
</Modal>