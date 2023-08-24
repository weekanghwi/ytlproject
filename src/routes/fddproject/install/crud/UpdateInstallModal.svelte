<script lang="ts">
  import { type InstallData, type ErrorsRecord, createInitialInstallData } from '$lib/types';
  import { fetchSubconData, fetchInstalldelayData, fetchIntegratedelayData, fetchOnairdelayData, fetchCOIdelayData, fetchCOICdelayData } from '$lib/categoryapicall';
  import { createEventDispatcher } from 'svelte';
  import { fetchInstallData, updateInstallData } from './crud'
  import { Modal, Label, Input, Button, Select, Tabs, TabItem, Textarea } from 'flowbite-svelte';
  import { z } from 'zod'
  import { InstallFormSchema } from '$lib/schemas';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  export let installUpdateModal = false;
  export let siteId: string;
  let subconSelectData: { value: string; name: string }[] = [];
  let installdelaySelectData: { value: string; name: string }[] = [];
  let integratedelaySelectData: { value: string; name: string }[] = [];
  let onairdelaySelectData: { value: string; name: string }[] = [];
  let coidelaySelectData: { value: string; name: string }[] = [];
  let coicdelaySelectData: { value: string; name: string }[] = [];

  let installData: InstallData = createInitialInstallData();
  let errors: ErrorsRecord = {}

  const crudSchema = InstallFormSchema.extend({
    id: InstallFormSchema.shape.id.optional(),
  })

  async function fetchAndSetSubconData() {
    try {
      const data = await fetchSubconData();
      subconSelectData = data
        .filter(subconcategory => subconcategory.subcon_category === 'Installation')
        .map(subcon => ({ value: subcon.subcon_name, name: subcon.subcon_name}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      subconSelectData = [];
      return [];
    }
  }
  $: fetchAndSetSubconData();

  async function fetchAndSetInstalldelayData() {
    try {
      const data = await fetchInstalldelayData();
      installdelaySelectData = data
        .map(installdelay => ({ value: installdelay.install_delay, name: installdelay.install_delay}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      installdelaySelectData = [];
      return [];
    }
  }
  $: fetchAndSetInstalldelayData();

  async function fetchAndSetIntegratedelayData() {
    try {
      const data = await fetchIntegratedelayData();
      integratedelaySelectData = data
        .map(integratedelay => ({ value: integratedelay.integration_delay, name: integratedelay.integration_delay}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      integratedelaySelectData = [];
      return [];
    }
  }
  $: fetchAndSetIntegratedelayData();

  async function fetchAndSetOnairdelayData() {
    try {
      const data = await fetchOnairdelayData();
      onairdelaySelectData = data
        .map(onair_delay => ({ value: onair_delay.onair_delay, name: onair_delay.onair_delay}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      onairdelaySelectData = [];
      return [];
    }
  }
  $: fetchAndSetOnairdelayData();

  async function fetchAndSetCOIdelayData() {
    try {
      const data = await fetchCOIdelayData();
      coidelaySelectData = data
        .map(coi_delay => ({ value: coi_delay.coi_delay, name: coi_delay.coi_delay}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      coidelaySelectData = [];
      return [];
    }
  }
  $: fetchAndSetCOIdelayData();

  async function fetchAndSetCOICdelayData() {
    try {
      const data = await fetchCOICdelayData();
      coicdelaySelectData = data
        .map(coic_delay => ({ value: coic_delay.coic_delay, name: coic_delay.coic_delay}));
      return data;
    } catch (error) {
      console.error('Error:', error);
      coicdelaySelectData = [];
      return [];
    }
  }
  $: fetchAndSetCOICdelayData();

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
      crudSchema.parse(installData);
      await updateInstallData(siteId, installData);
      installUpdateModal = false;
      errors = {};
      dispatch('installUpdated');
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


<Modal bind:open={installUpdateModal} size="md" autoclose={false} class="w-full">
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
                name="pnoc_ho_trigger_date" 
                placeholder="PNOC HO Trigger date" 
                bind:value={installData.pnoc_ho_trigger_date} type="date"
                />
              {#if errors.pnoc_ho_trigger_date}<span class="text-rose-600 text-xs col-span-3"> !{errors.pnoc_ho_trigger_date}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  PNOC HO Complete date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="pnoc_ho_complete_date" 
                placeholder="PNOC HO Complete date" 
                bind:value={installData.pnoc_ho_complete_date} type="date"
              />
              {#if errors.pnoc_ho_complete_date}<span class="text-rose-600 text-xs col-span-3"> !{errors.pnoc_ho_complete_date}</span>{/if}
            </div>
          </div>
        </TabItem>

        <TabItem defaultClass="inline-block text-sm text-center disabled:cursor-not-allowed">
          <div slot="title" class="flex items-center gap-1">
            <Icon icon="ion:construct-outline" />
            Install
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
                name="install_start" 
                placeholder="Install Start Date" 
                bind:value={installData.install_start} type="date"
              />
              {#if errors.install_start}<span class="text-rose-600 text-xs col-span-3"> !{errors.install_start}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Install Complete Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="install_complete" 
                placeholder="Install Complete Date" 
                bind:value={installData.install_complete} type="date"
              />
              {#if errors.install_complete}<span class="text-rose-600 text-xs col-span-3"> !{errors.install_complete}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Install Delay
                </span>
              </Label>
              <Select
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                items={installdelaySelectData} bind:value={installData.installdelay} />
              {#if errors.installdelay}<span class="text-rose-600 text-xs col-span-3"> !{errors.installdelay}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Install Delay Detail
                </span>
              </Label>
              <Textarea 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="installdelay_detail" 
                placeholder="Install Delay Detail" 
                rows="1"
                bind:value={installData.installdelay_detail} type="date"
              />
              {#if errors.installdelay_detail}<span class="text-rose-600 text-xs col-span-3"> !{errors.installdelay_detail}</span>{/if}
            </div>
          </div>
        </TabItem>

        <TabItem defaultClass="inline-block text-sm text-center disabled:cursor-not-allowed">
          <div slot="title" class="flex items-center gap-1">
            <Icon icon="carbon:settings" />
            Integrate
          </div>
          
          <div class="flex flex-col">
            <div class="grid grid-cols-3 items-center justify-center py-6 gap-6">
              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Integration Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="integration_date" 
                placeholder="Integration Date" 
                bind:value={installData.integration_date} type="date"
              />
              {#if errors.integration_date}<span class="text-rose-600 text-xs col-span-3"> !{errors.integration_date}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Integration TurnOn Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="integration_turnon" 
                placeholder="Integration TurnOn Date" 
                bind:value={installData.integration_turnon} type="date"
              />
              {#if errors.integration_turnon}<span class="text-rose-600 text-xs col-span-3"> !{errors.integration_turnon}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Integration Delay
                </span>
              </Label>
              <Select
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                items={integratedelaySelectData} bind:value={installData.integratedelay} />
              {#if errors.integratedelay}<span class="text-rose-600 text-xs col-span-3"> !{errors.integratedelay}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  Integration Delay Detail
                </span>
              </Label>
              <Textarea 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="integratedelay_detail" 
                placeholder="Integration Delay Detail" 
                rows="1"
                bind:value={installData.integratedelay_detail} type="date"
              />
              {#if errors.integratedelay_detail}<span class="text-rose-600 text-xs col-span-3"> !{errors.integratedelay_detail}</span>{/if}
            </div>
          </div>
        </TabItem>

        <TabItem defaultClass="inline-block text-sm text-center disabled:cursor-not-allowed">
          <div slot="title" class="flex items-center gap-1">
            <Icon icon="ion:wifi" />
            OnAir
          </div>

          <div class="flex flex-col">
            <div class="grid grid-cols-3 items-center justify-center py-6 gap-6">
              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  OnAir Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="onair_date" 
                placeholder="OnAir Date" 
                bind:value={installData.onair_date} type="date"
              />
              {#if errors.onair_date}<span class="text-rose-600 text-xs col-span-3"> !{errors.onair_date}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  OnAir Delay
                </span>
              </Label>
              <Select
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                items={onairdelaySelectData} bind:value={installData.onairdelay} />
              {#if errors.onairdelay}<span class="text-rose-600 text-xs col-span-3"> !{errors.onairdelay}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  OnAir Delay Detail
                </span>
              </Label>
              <Textarea 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="onairdelay_detail" 
                placeholder="OnAir Delay Detail" 
                rows="4"
                bind:value={installData.onairdelay_detail} type="date"
              />
              {#if errors.onairdelay_detail}<span class="text-rose-600 text-xs col-span-3"> !{errors.onairdelay_detail}</span>{/if}
            </div>
          </div>
        </TabItem>

        <TabItem defaultClass="inline-block text-sm text-center disabled:cursor-not-allowed">
          <div slot="title" class="flex items-center gap-1">
            <Icon icon="ph:certificate" />
            COI
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
                name="coi_submit_date" 
                placeholder="COI Submit Date" 
                bind:value={installData.coi_submit_date} type="date"
              />
              {#if errors.coi_submit_date}<span class="text-rose-600 text-xs col-span-3"> !{errors.coi_submit_date}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  COI Approve Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="coi_approval_date" 
                placeholder="COI Approve Date" 
                bind:value={installData.coi_approval_date} type="date"
              />
              {#if errors.coi_approval_date}<span class="text-rose-600 text-xs col-span-3"> !{errors.coi_approval_date}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  COI Delay
                </span>
              </Label>
              <Select
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                items={coidelaySelectData} bind:value={installData.coidelay} />
              {#if errors.coidelay}<span class="text-rose-600 text-xs col-span-3"> !{errors.coidelay}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  COI Delay Detail
                </span>
              </Label>
              <Textarea 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="coidelay_detail" 
                placeholder="COI Delay Detail" 
                rows="1"
                bind:value={installData.coidelay_detail} type="date"
              />
              {#if errors.coidelay_detail}<span class="text-rose-600 text-xs col-span-3"> !{errors.coidelay_detail}</span>{/if}
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
                  COI&C Submit Date
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="coic_submit_date" 
                placeholder="COI&C Submit Date" 
                bind:value={installData.coic_submit_date} type="date"
              />
              {#if errors.coic_submit_date}<span class="text-rose-600 text-xs col-span-3"> !{errors.coic_submit_date}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  COI&C Approve Status
                </span>
              </Label>
              <Input 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="coic_approval_status" 
                placeholder="COI Approve Statue" 
                bind:value={installData.coic_approval_status} type="test"
              />
              {#if errors.coic_approval_status}<span class="text-rose-600 text-xs col-span-3"> !{errors.coic_approval_status}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  COI&C Delay
                </span>
              </Label>
              <Select
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                items={coicdelaySelectData} bind:value={installData.coicdelay} />
              {#if errors.coicdelay}<span class="text-rose-600 text-xs col-span-3"> !{errors.coicdelay}</span>{/if}

              <Label class="space-y-2">
                <span class="text-slate-800 dark:text-slate-400">
                  COI&C Delay Detail
                </span>
              </Label>
              <Textarea 
                class="py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 col-span-2" 
                name="coicdelay_detail" 
                placeholder="COI&C Delay Detail" 
                rows="1"
                bind:value={installData.coicdelay_detail} type="date"
              />
              {#if errors.coicdelay_detail}<span class="text-rose-600 text-xs col-span-3"> !{errors.coicdelay_detail}</span>{/if}
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