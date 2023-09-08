<script lang="ts">
  import { type InstallData, type ErrorsRecord, createInitialInstallData } from '$lib/types';
  import { fetchSubconData, fetchCOICApproveStatusData } from '$lib/categoryapicall';
  import { createEventDispatcher } from 'svelte';
  import { fetchInstallData, updateInstallData } from './crud'
  import { Modal, Label, Input, Button, Select, Tabs, TabItem } from 'flowbite-svelte';
  import { z } from 'zod'
  import { InstallFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  export let installUpdateModal = false;
  export let siteId: string;
  export let search: () => Promise<void>;

  let subconSelectData: { value: string; name: string }[] = [];
  let coicapproveStatusData: { value: string; name: string }[] = [];

  let installData: InstallData = createInitialInstallData();
  let errors: ErrorsRecord = {}

  const crudSchema = InstallFormSchema.extend({
    id: InstallFormSchema.shape.id.optional(),
  })

  async function fetchAndSetSubconData() {
    try {
      const data = await fetchSubconData();
      subconSelectData = data
        .filter(subconcategory => subconcategory.type === 'Install')
        .map(subcon => ({ value: subcon.id, name: subcon.subcon}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      subconSelectData = [];
      return [];
    }
  }
  $: fetchAndSetSubconData();

  async function fetchAndSetcoicapproveStatusData() {
    try {
      const data = await fetchCOICApproveStatusData();
      coicapproveStatusData = data
        .map(coicapproveState => ({ value: coicapproveState.coicapprovestatus, name: coicapproveState.coicapprovestatus}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      coicapproveStatusData = [];
      return [];
    }
  }
  $: fetchAndSetcoicapproveStatusData();

  $: if (siteId) {
    (async () => {
      try {
        const data = await fetchInstallData(siteId);
        installData = data;
      } catch (error) {
        console.error('Failed to fetch Install data:', error);
      }
    })();
    errors = {};
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    // siteData.cluster = selectedCluster ? selectedCluster.cluster_name : siteData.cluster;

    try {
      for (const [key, value] of Object.entries(installData)) {
        // "as"를 사용하여 타입을 명확하게 지정해줍니다.
        (installData as {[key: string]: any})[key] = value === '' ? null : value;
      }
      crudSchema.parse(installData);
      await updateInstallData(siteId, installData);
      installUpdateModal = false;
      errors = {};
      // dispatch('installUpdated');
      if (search) {
        await search();
      }
    } catch (error) {
      console.error('Failed to update install data:', error);
      if (error instanceof z.ZodError) {
      error.errors.forEach(({ path, message }) => {
        errors[path[0]] = message;
      });
      }
    }
  }
</script>


<Modal bind:open={installUpdateModal} size="sm" autoclose={false} class="w-full">
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center gap-2 mb-6">
      <h3 class="text-md font-medium text-gray-900 dark:text-white">Update Installation Information</h3>
      <p class="text-sm text-slate-500">({installData.sitebasicinfo})</p>
    </div>
    <Input class="py-1.5 px-3 w-full text-red-500" bind:value={installData.id} type="hidden" />

    <!-- Form Contents -->
      <Tabs style="underline"
        defaultClass="flex flex-wrap"
        contentClass="px-4 bg-gray-50 rounded-lg dark:bg-gray-800 mb-6"
      >
        <!-- Base & PNOC Teb -->
        <TabItem open defaultClass="inline-block text-sm text-center disabled:cursor-not-allowed">
          <div slot="title" class="flex items-center gap-1">
            <Icon icon="fluent:book-default-28-regular" />
            Base & PNOC
          </div>
          <div class="flex flex-col">
            <div class="grid grid-cols-3 items-center justify-center py-6 gap-6">
              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Site ID
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="sitebasicinfo" 
                placeholder="Site ID" 
                bind:value={installData.sitebasicinfo} type="text" disabled
              />
              {#if errors.sitebasicinfo}<span class="text-rose-600 text-xs col-span-3"> !{errors.sitebasicinfo}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Sub-contractor
                </span>
              </Label>
              <Select
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                items={subconSelectData} bind:value={installData.subcon} />
              {#if errors.subcon}<span class="text-rose-600 text-xs col-span-3"> !{errors.subcon}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  PNOC HO Trigger date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="pnochotriggerdate" 
                placeholder="PNOC HO Trigger date" 
                bind:value={installData.pnochotriggerdate} type="date"
                />
              {#if errors.pnochotriggerdate}<span class="text-rose-600 text-xs col-span-3"> !{errors.pnochotriggerdate}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  PNOC HO Complete date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="pnochocompletedate" 
                placeholder="PNOC HO Complete date" 
                bind:value={installData.pnochocompletedate} type="date"
              />
              {#if errors.pnochocompletedate}<span class="text-rose-600 text-xs col-span-3"> !{errors.pnochocompletedate}</span>{/if}
            </div>
          </div>
        </TabItem>

        <TabItem defaultClass="inline-block text-sm text-center disabled:cursor-not-allowed">
          <div slot="title" class="flex items-center gap-1">
            <Icon icon="ion:construct-outline" />
            Install ~ OnAir
          </div>
          <div class="flex flex-col">
            <div class="grid grid-cols-3 items-center justify-center py-6 gap-6">
              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Install Start Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="startdate" 
                placeholder="Install Start Date" 
                bind:value={installData.startdate} type="date"
              />
              {#if errors.startdate}<span class="text-rose-600 text-xs col-span-3"> !{errors.startdate}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Install Complete Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="completedate" 
                placeholder="Install Complete Date" 
                bind:value={installData.completedate} type="date"
              />
              {#if errors.completedate}<span class="text-rose-600 text-xs col-span-3"> !{errors.completedate}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Integration Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="integrationdate" 
                placeholder="Integration Date" 
                bind:value={installData.integrationdate} type="date"
              />
              {#if errors.integrationdate}<span class="text-rose-600 text-xs col-span-3"> !{errors.integrationdate}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Integration TurnOn Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="integrationondate" 
                placeholder="Integration TurnOn Date" 
                bind:value={installData.integrationondate} type="date"
              />
              {#if errors.integrationondate}<span class="text-rose-600 text-xs col-span-3"> !{errors.integrationondate}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  OnAir Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="oaairdate" 
                placeholder="OnAir Date" 
                bind:value={installData.oaairdate} type="date"
              />
              {#if errors.oaairdate}<span class="text-rose-600 text-xs col-span-3"> !{errors.oaairdate}</span>{/if}
            </div>
          </div>
        </TabItem>

        <TabItem defaultClass="inline-block text-sm text-center disabled:cursor-not-allowed">
          <div slot="title" class="flex items-center gap-1">
            <Icon icon="ph:certificate" />
            COI&C
          </div>

          <div class="flex flex-col">
            <div class="grid grid-cols-3 items-center justify-center py-6 gap-6">
              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  COI Submit Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="coisubmitdate" 
                placeholder="COI Submit Date" 
                bind:value={installData.coisubmitdate} type="date"
              />
              {#if errors.coisubmitdate}<span class="text-rose-600 text-xs col-span-3"> !{errors.coisubmitdate}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  COI Approve Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="coiapprovedate" 
                placeholder="COI Approve Date" 
                bind:value={installData.coiapprovedate} type="date"
              />
              {#if errors.coiapprovedate}<span class="text-rose-600 text-xs col-span-3"> !{errors.coiapprovedate}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  COI&C Submit Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="coicsubmitdate" 
                placeholder="COI&C Submit Date" 
                bind:value={installData.coicsubmitdate} type="date"
              />
              {#if errors.coicsubmitdate}<span class="text-rose-600 text-xs col-span-3"> !{errors.coicsubmitdate}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  COI&C Approve Status
                </span>
              </Label>
              <Select
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                items={coicapproveStatusData} bind:value={installData.coicapprovestatus} />
              {#if errors.coicapprovestatus}<span class="text-rose-600 text-xs col-span-3"> !{errors.coicapprovestatus}</span>{/if}
              
            </div>
          </div>
        </TabItem>
      </Tabs>

    <div class="flex gap-4">
      <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update Install info</Button>
      <Button color='red' on:click={() => {installUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>
</Modal>