<script lang="ts">
  import { fetchphysiteData, updatephySiteData } from './crudphy'
  import { type PhysicalSiteData, type ErrorsRecord, createInitialphySiteData } from '$lib/types';
  import { PhysicalSiteFormSchema } from '$lib/schemas';
  import { createEventDispatcher, onMount } from 'svelte';
  import { z } from 'zod'
	import { Button, Label, Input, Modal, TabItem, Tabs, NumberInput } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';

  export let physiteinfoUpdateModal = false;
  export let _cellidentity: string;

  let physiteData: PhysicalSiteData = createInitialphySiteData();
  let errors: ErrorsRecord = {}
  let previousIdentity: string;
  let statestatus_choices = {}
  let siteconfig_choices = {}
  let antennatype_choices:any = []
  let channelcard_choices = {}

  const dispatch = createEventDispatcher();

  const crudSchema = PhysicalSiteFormSchema.extend({
    id: PhysicalSiteFormSchema.shape.cellidentity.optional(),
  })

  onMount(async () => {
    const res = await fetch('http://10.24.8.115:8000/api/v2/physiteall_choices/');
    const resantennatype = await fetch('http://10.24.8.115:8000/api/v2/antennatype/');
    const data = await res.json();
    const dataantennatype = await resantennatype.json();
    statestatus_choices = data.sitestatus_choices
    siteconfig_choices = data.siteconfig_choices
    antennatype_choices = dataantennatype.results
    channelcard_choices = data.channelcard_choices
  });

  $: if (_cellidentity && _cellidentity !== previousIdentity) {
    (async () => {
      try {
        const data = await fetchphysiteData(_cellidentity);
        physiteData = data;
      } catch (error) {
        console.error('Failed to fetch physical site data:', error);
      }
      previousIdentity = _cellidentity;

    })();
    errors = {};
  }

  $: {
    if (physiteData.pci !== undefined && physiteData.pci !== null) {
      physiteData.pss = physiteData.pci % 3;
      physiteData.sss = Math.floor(physiteData.pci / 3);
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    try {
      crudSchema.parse(physiteData);
      await updatephySiteData(_cellidentity, physiteData);
      physiteinfoUpdateModal = false;
      errors = {};
      // siteData = createInitialSiteData();
      dispatch('physiteUpdated');
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


<Modal bind:open={physiteinfoUpdateModal} size="md" autoclose={false} class="w-full">
  <form class="flex flex-col w-full" action="#" on:submit|preventDefault={handleSubmit}>
    <p class="text-white text-lg mb-6">Physical Site ({physiteData.enbid}) Info Update</p>

    <Tabs style="underline" contentClass="py-1 mb-4">
      <!-- sitebasicinfo hidden input -->
      <Input type="hidden" name="sitebasicinfo" bind:value={physiteData.sitebasicinfo} />

      <!-- Basesiteinfo Teb -->
      <TabItem open>
        <div slot="title" class="flex items-center gap-1">
          <Icon icon="healthicons:default-outline" class="text-xl"/>
          <span>Basic Info</span>
        </div>

        <!-- Basesiteinfo Form Data -->
        <div class="flex items-center gap-4 mt-2">
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              eNBID
            </span>
            <Input 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="enbid" 
              placeholder="eNBID" 
              bind:value={physiteData.enbid} />
            {#if errors.enbid}<span class="text-rose-600 text-xs">{errors.enbid}</span>{/if}
          </Label>

          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              Cell Identity
            </span>
            <Input 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="cellidentity" 
              placeholder="Cell Identity" 
              bind:value={physiteData.cellidentity} />
            {#if errors.cellidentity}<span class="text-rose-600 text-xs">{errors.cellidentity}</span>{/if}
          </Label>
        </div>

        <div class="flex items-center gap-4 mt-2">
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              OnAir Status
            </span>
            <select 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="sitestatus" 
              placeholder="OnAir Status" 
              bind:value={physiteData.sitestatus}>
                {#each Object.entries(statestatus_choices) as [key, value] (key)}
                  <option class="bg-slate-800" value={key}>{value}</option>
                {/each}
            </select>
            {#if errors.sitestatus}<span class="text-rose-600 text-xs">{errors.sitestatus}</span>{/if}
          </Label>

          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              Site Config
            </span>
            <select 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="siteconfig" 
              placeholder="Site Config" 
              bind:value={physiteData.siteconfig}>
                {#each Object.entries(siteconfig_choices) as [key, value] (key)}
                  <option class="bg-slate-800" value={key}>{value}</option>
                {/each}
            </select>
            {#if errors.siteconfig}<span class="text-rose-600 text-xs">{errors.siteconfig}</span>{/if}
          </Label>
        </div>

        <div class="flex items-center gap-4 mt-2">
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              Number of Sec 
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="sectorconfig" 
              placeholder="Number of Sec" 
              step="any"
              bind:value={physiteData.sectorconfig} />
              {#if errors.sectorconfig}<span class="text-rose-600 text-xs">{errors.sectorconfig}</span>{/if}
          </Label>

          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              Port Nubmer
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="portnumber" 
              placeholder="Port Nubmer" 
              step="any"
              bind:value={physiteData.portnumber} />
              {#if errors.portnumber}<span class="text-rose-600 text-xs">{errors.portnumber}</span>{/if}
          </Label>

          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              Sector ID 
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="sectorid" 
              placeholder="Sector ID" 
              step="any"
              bind:value={physiteData.sectorid} />
              {#if errors.sectorid}<span class="text-rose-600 text-xs">{errors.sectorid}</span>{/if}
          </Label>
        </div>

        
      </TabItem>

      <!-- Physical siteinfo Teb -->
      <TabItem>
        <div slot="title" class="flex items-center gap-1">
          <Icon icon="ic:sharp-cell-tower" class="text-xl"/>
          <span>Physical Info</span>
        </div>

        <!-- Physical info Form Data -->
        <div class="flex items-center gap-4 mt-2">
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              Antenna Type 
            </span>
            <select 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="antennatype" 
              placeholder="OnAir Status" 
              bind:value={physiteData.antennatype}>
                {#each antennatype_choices as type}
                  <option class="bg-slate-800 border-none" value={type.antennatype}>{type.antennatype}</option>
                {/each}
            </select>
            {#if errors.antennatype}<span class="text-rose-600 text-xs">{errors.antennatype}</span>{/if}
          </Label>
        </div>

        <div class="flex items-center gap-4 mt-2">
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              Antenna Height 
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="antennaheight" 
              placeholder="Antenna Height" 
              step="any"
              bind:value={physiteData.antennaheight} />
            {#if errors.antennaheight}<span class="text-rose-600 text-xs">{errors.antennaheight}</span>{/if}
          </Label>
        </div>

        <div class="flex items-center gap-4 mt-2">
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              Azimuth
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="azimuth" 
              placeholder="Azimuth" 
              step="any"
              bind:value={physiteData.azimuth} />
            {#if errors.azimuth}<span class="text-rose-600 text-xs">{errors.azimuth}</span>{/if}
          </Label>

          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              M-Tilt
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="mtilt" 
              placeholder="M-Tilt" 
              step="any"
              bind:value={physiteData.mtilt} />
            {#if errors.mtilt}<span class="text-rose-600 text-xs">{errors.mtilt}</span>{/if}
          </Label>

          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              E-Tilt
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="etilt" 
              placeholder="E-Tilt" 
              step="any"
              bind:value={physiteData.etilt} />
            {#if errors.etilt}<span class="text-rose-600 text-xs">{errors.etilt}</span>{/if}
          </Label>
        </div>

        
      </TabItem>

      <!-- LSM siteinfo Teb -->
      <TabItem>
        <div slot="title" class="flex items-center gap-1">
          <Icon icon="uil:server" class="text-xl"/>
          <span>LSM Info</span>
        </div>

        <!-- Physical info Form Data -->
        <div class="flex items-center gap-4 mt-2">
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              Channel Card type 
            </span>
            <select 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="channelcard" 
              placeholder="Channel Card type" 
              bind:value={physiteData.channelcard}>
                {#each Object.entries(channelcard_choices) as [key, value] (key)}
                  <option class="bg-slate-800" value={key}>{value}</option>
                {/each}
            </select>
            {#if errors.channelcard}<span class="text-rose-600 text-xs">{errors.channelcard}</span>{/if}
          </Label>
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              EARFCN DL 
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="earfcndl" 
              placeholder="EARFCN DL" 
              step="any"
              bind:value={physiteData.earfcndl} />
            {#if errors.earfcndl}<span class="text-rose-600 text-xs">{errors.earfcndl}</span>{/if}
          </Label>
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              EARFCN UL 
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="earfcnul" 
              placeholder="EARFCN UL" 
              step="any"
              bind:value={physiteData.earfcnul} />
            {#if errors.earfcnul}<span class="text-rose-600 text-xs">{errors.earfcnul}</span>{/if}
          </Label>
        </div>

        <div class="flex items-center gap-4 mt-2">
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              PCI 
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="pci" 
              placeholder="PCI" 
              step="any"
              bind:value={physiteData.pci} />
            {#if errors.pci}<span class="text-rose-600 text-xs">{errors.pci}</span>{/if}
          </Label>
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              PSS 
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="pss" 
              placeholder="PSS" 
              step="any"
              disabled readonly
              bind:value={physiteData.pss} />
            {#if errors.pss}<span class="text-rose-600 text-xs">{errors.pss}</span>{/if}
          </Label>
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              SSS 
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="sss" 
              placeholder="SSS" 
              step="any"
              disabled readonly
              bind:value={physiteData.sss} />
            {#if errors.sss}<span class="text-rose-600 text-xs">{errors.sss}</span>{/if}
          </Label>         
        </div>

        <div class="flex items-center gap-4 mt-2">
          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              TX-Attn
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="txattn" 
              placeholder="TX-Attn" 
              step="any"
              bind:value={physiteData.txattn} />
            {#if errors.txattn}<span class="text-rose-600 text-xs">{errors.txattn}</span>{/if}
          </Label>

          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              RSI
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="rsr" 
              placeholder="RSI" 
              step="any"
              bind:value={physiteData.rsi} />
            {#if errors.rsi}<span class="text-rose-600 text-xs">{errors.rsi}</span>{/if}
          </Label>

          <Label class="flex flex-col space-y-2 w-full py-4">
            <span class="text-slate-800 dark:text-slate-400">
              TAC
            </span>
            <NumberInput 
              class="text-sm py-2 px-2 rounded bg-slate-50 dark:bg-slate-700/40 border border-slate-50 dark:border-slate-800" 
              name="tac" 
              placeholder="TAC" 
              step="any"
              bind:value={physiteData.tac} />
            {#if errors.tac}<span class="text-rose-600 text-xs">{errors.tac}</span>{/if}
          </Label>
        </div>
      </TabItem>

    </Tabs>

    <div class="flex items-center gap-3">
      <Button color="green" type="submit" class="w-fit py-1.5 px-3">Update</Button>
      <Button color='red' on:click={() => {physiteinfoUpdateModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
    </div>
  </form>

</Modal>
