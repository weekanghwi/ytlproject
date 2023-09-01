<script lang="ts">
  import { Drawer, Button, CloseButton } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
  import { sineIn } from 'svelte/easing'
  import UpdateInstallModal from '../crud/UpdateInstallModal.svelte';

  export let selectedRellist:any = {};
  export let installdetaildrawer = true;
  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  }

  let siteId = '';
  let installUpdateModal = false;
</script>

<Drawer width="w-96" placement="right" transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={installdetaildrawer} id="dodetaildrawer">
  <div class="flex items-center w-">
    <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-slate-500 dark:text-slate-400">
      <Icon icon="ion:construct-outline" class="me-2"/>Install Information
    </h5>
    <CloseButton on:click={() => (installdetaildrawer = true)} class="mb-4 dark:text-white" />
  </div>

  <!-- Install description -->
  <div class="flex flex-col gap-1 mb-6">
    <div class="flex flex-col mb-3 items-center justify-center">
      <p class="text-lg text-slate-500 dark:text-slate-400">
        {selectedRellist.install.sitebasicinfo}
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        {selectedRellist.sitebasicinfo.sitename}
      </p>
    </div>
    <div class="flex items-center justify-center gap-2">
      {#if selectedRellist.sitebasicinfo.contracttype.startsWith('Confirm')}
      <div class="text-xs text-slate-500 dark:text-slate-900 rounded-sm py-0.5 px-3 bg-lime-400 w-fit">
        {selectedRellist.sitebasicinfo.contracttype}
      </div>
      {:else}
      <div class="flex items-center">
        <span class="text-xs text-slate-500 dark:text-slate-900 rounded-sm py-0.5 px-3 bg-rose-400 w-fit">
          {selectedRellist.sitebasicinfo.contracttype}
        </span>
      </div>
      {/if}
      <div class="flex items-center">
        <span class="text-xs text-slate-500 dark:text-slate-200 rounded-sm py-0.5 px-3 bg-slate-600 w-fit">
          {selectedRellist.sitebasicinfo.region}
        </span>
      </div>
      {#if selectedRellist.do.doissuedate}
      <div class="flex items-center">
        <span class="text-xs text-slate-500 dark:text-slate-900 rounded-sm py-0.5 px-3 bg-lime-400 w-fit">
          Delivered
        </span>
      </div>
      {:else}
      <div class="flex items-center">
        <span class="text-xs text-slate-500 dark:text-slate-900 rounded-sm py-0.5 px-3 bg-rose-400 w-fit">
          No DO
        </span>
      </div>
      {/if}
    </div>
  </div>

  <!-- Install contents -->
  <div class="flex flex-col">

    <!-- installation -->
    <div class="flex flex-col p-3 mb-3 border border-slate-700 rounded-xl">
      <div class="flex items-center justify-start mb-2">
        <Icon icon="ion:construct-outline" class="me-2 text-slate-300"/>
        <p class="text-lg text-slate-300">Installation</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">Start Date</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.startdate}</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">Complete Date</p>
        {#if selectedRellist.install.completedate}
          <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.completedate}</p>
        {:else}
          <p class="text-sm text-rose-400">Pending</p>
        {/if}
      </div>
      {#if selectedRellist.install.startdate && !selectedRellist.install.completedate}
      <div class="flex flex-col">
        <p class="text-xs text-rose-400">Pending Install Complete</p>
      </div>
      {/if}
    </div>

    <!-- integration & onair -->
    <div class="flex flex-col p-3 mb-3 border border-slate-700 rounded-xl">
      <div class="flex items-center justify-start mb-2">
        <Icon icon="streamline:interface-setting-slider-horizontal-square-adjust-controls-fader-horizontal-settings-slider-square" class="me-2 text-slate-300"/>
        <p class="text-lg text-slate-300">Integration & OnAir</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">Integration Date</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.integrationdate}</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">TurnOn Date</p>
        {#if selectedRellist.install.integrationondate}
          <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.integrationondate}</p>
        {:else}
          <p class="text-sm text-slate-500 dark:text-slate-400">Pending</p>
        {/if}
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">OnAir Date</p>
        {#if selectedRellist.install.oaairdate}
          <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.oaairdate}</p>
        {:else}
          <p class="text-sm text-slate-500 dark:text-rose-400">Pending</p>
        {/if}
      </div>
      {#if selectedRellist.install.integrationondate && !selectedRellist.install.oaairdate}
      <div class="flex flex-col">
        <p class="text-xs text-rose-400">Pending OnAir</p>
      </div>
      {/if}
    </div>

    <!-- coi & pnoc ho -->
    {#if selectedRellist.sitebasicinfo.contracttype.startsWith('Confirm') || selectedRellist.sitebasicinfo.contracttype.startsWith('Reuse-Replace')}
      <div class="flex flex-col p-3 mb-3 border border-slate-700 rounded-xl">
        <div class="flex items-center justify-start mb-2">
          <Icon icon="solar:passport-outline" class="me-2 text-slate-300"/>
          <p class="text-lg text-slate-300">COI&C and PNOC Handover</p>
        </div>

        <!-- COI -->
        {#if selectedRellist.install.oaairdate && selectedRellist.install.coisubmitdate}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">COI Submit Date</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.coisubmitdate}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">COI Approval Date</p>
            {#if selectedRellist.install.coiapprovedate}
              <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.coiapprovedate}</p>
            {:else}
              <p class="text-sm text-rose-400">Pending</p>
            {/if}
          </div>
          {#if selectedRellist.install.coisubmitdate && !selectedRellist.install.coiapprovedate}
            <div class="flex flex-col">
              <p class="text-xs text-rose-400">Pending COI Approve</p>
            </div>
          {/if}
        {:else if selectedRellist.install.oaairdate && !selectedRellist.install.coisubmitdate}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-rose-400">Pending COI submit to YTLC</p>
          </div>
        {/if}

        <!-- COI&C -->
        {#if selectedRellist.install.oaairdate && selectedRellist.install.coicsubmitdate}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">COI&C Submit Date</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.coicsubmitdate}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">COI&C Approval Status</p>
            {#if selectedRellist.install.coicapprovestatus}
              <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.coicapprovestatus}</p>
            {:else}
              <p class="text-sm text-rose-400">Pending</p>
            {/if}
          </div>
          {#if selectedRellist.install.coicsubmitdate && !selectedRellist.install.coicapprovestatus}
            <div class="flex flex-col">
              <p class="text-xs text-rose-400">Pending COI&C Approve</p>
            </div>
          {/if}
        {:else if selectedRellist.install.oaairdate && !selectedRellist.install.coicsubmitdate}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-rose-400">Pending COI&C submit to YTLC</p>
          </div>
        {/if}

        <!-- PNOC -->
        {#if selectedRellist.install.oaairdate && selectedRellist.install.pnochotriggerdate}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">PNOC HO Trigger date</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.pnochotriggerdate}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">PNOC HO Complete date</p>
            {#if selectedRellist.install.pnochocompletedate}
              <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.install.pnochocompletedate}</p>
            {:else}
              <p class="text-sm text-rose-400">Pending HO</p>
            {/if}
          </div>
        {:else if selectedRellist.install.oaairdate && !selectedRellist.install.pnochotriggerdate}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-rose-400">Pending PNOC HO Trigger</p>
          </div>
        {/if}

      </div>
    {:else}
      <div class="flex flex-col items-center justify-center mb-3">
        <Icon icon="mdi:book-cancel-outline" class="text-8xl text-rose-400" />
        <p class="text-xs text-slate-500 dark:text-slate-400">Thie site meterial is not confirm category</p>
      </div>
    {/if}
  </div>
  
  <div class="grid grid-cols-2 gap-4">
    <Button color="blue"
      on:click={() => {siteId = selectedRellist.install.id; installUpdateModal = true }}>
      Update Install
    </Button>
    <Button on:click={() => (installdetaildrawer = true)} class="px-4"><Icon icon="ph:x" class="me-1" /> Close</Button>
  </div>
</Drawer>

<!-- Modal -->
<UpdateInstallModal 
bind:installUpdateModal={installUpdateModal} {siteId} 
/>