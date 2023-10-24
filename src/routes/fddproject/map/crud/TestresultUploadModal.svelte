<script lang="ts">
  import { type TestResultData, type ErrorsRecord, createInitialTestResultData } from '$lib/types';
  import { createEventDispatcher } from 'svelte';
  import { createTestresultData } from './crud'
  import { Modal, Label, Input, Button, NumberInput, Fileupload } from 'flowbite-svelte';
  import { z } from 'zod'
  import { TestresultSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  export let testresultCreateModal = false;
  export let siteId: string;

  let selectedFile: File | null = null;

  let testResultData: TestResultData = createInitialTestResultData();
  let errors: ErrorsRecord = {}

  const crudSchema = TestresultSchema.extend({
    id: TestresultSchema.shape.id.optional(),
  })

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      selectedFile = input.files[0];
    }
  };


  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    Object.keys(testResultData).forEach((key: string) => {
      const k = key as keyof TestResultData
      if (testResultData[k] === "") {
        (testResultData[k] as string | null) = null;
      }
    })

    const formData = new FormData();
    Object.keys(testResultData).forEach(key => {
      formData.append(key, testResultData[key]);
    });

    if (selectedFile) {
      formData.append('testdata', selectedFile)
    }

    try {
      crudSchema.parse(testResultData);
      await createTestresultData(formData);
      testresultCreateModal = false;
      errors = {};
      testResultData = createInitialTestResultData();
      selectedFile = null;
      dispatch('testdataUploaded');
    } catch (error) {
      console.error('Failed to upload test data:', error);
      if (error instanceof z.ZodError) {
      error.errors.forEach(({ path, message }) => {
        errors[path[0]] = message;
      });
      }
    }
  }
 
</script>

<div class="testresult-modal">
  <Modal 
    color="blue"
    title="Upload Test Data ({siteId})"
    bind:open={testresultCreateModal} 
    size="xs" 
    autoclose={false} 
    class="testresult-modal w-full">
    <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
      
      <Input class="py-1.5 px-3 w-full text-red-500" bind:value={testResultData.id} type="hidden" />

      <div class="flex flex-col gap-3 mb-4 pb-4">
        <div class="flex items-center w-full gap-4">
          <Label class="space-y-2 w-full">
            <span class="text-slate-800 dark:text-slate-400">
              Test Site ID {#if errors.sitebasicinfo}<span class="text-rose-600 text-xs"> !{errors.sitebasicinfo}</span>{/if}
            </span>
            <Input 
              class="py-2 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
              name="sitebasicinfo" 
              placeholder="Test Site ID" 
              bind:value={testResultData.sitebasicinfo} type="text"
            />
          </Label>

          <Label class="space-y-2 w-full">
            <span class="text-slate-800 dark:text-slate-400">
              XRO Cycle {#if errors.cycle}<span class="text-rose-600 text-xs"> !{errors.cycle}</span>{/if}
            </span>
            <Input 
              class="py-2 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
              name="cycle" 
              placeholder="XRO Cycle" 
              bind:value={testResultData.cycle} type="text"
            />
          </Label>
        </div>
      </div>

      <div class="flex flex-col gap-3 mb-4 pb-4">
        <div class="flex items-center w-full gap-4">
          <Label class="space-y-2 w-full">
            <span class="text-slate-800 dark:text-slate-400">
              Test Result (Poor SINR) {#if errors.testdata}<span class="text-rose-600 text-xs"> !{errors.testdata}</span>{/if}
            </span>
            <Fileupload 
              class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600" 
              name="testdata"
              accept=".csv"
              on:change={handleFileChange}
              type="file"
            />
          </Label>
        </div>
      </div>

      <div class="flex gap-4 mt-5">
        <Button color="green" type="submit" class="w-fit py-1.5 px-3">Upload Test Data</Button>
        <Button color='red' on:click={() => {testresultCreateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
      </div>

    </form>
  </Modal>
</div>

<style>
  .testresult-modal {
    position: absolute;
    z-index: 1000
  }
</style>