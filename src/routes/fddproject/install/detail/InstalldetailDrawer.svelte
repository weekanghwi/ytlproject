<script lang="ts">
  import { Drawer, Button, CloseButton, Timeline, TimelineItem, TimelineItemVertical } from 'flowbite-svelte';
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
        {selectedRellist.installtillonair.sitebasicinfo}
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        {selectedRellist.sitebasicinfo.site_name}
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
          {selectedRellist.sitebasicinfo.regions}
        </span>
      </div>
      <div class="flex items-center">
        <span class="text-xs text-slate-500 dark:text-slate-200 rounded-sm py-0.5 px-3 bg-slate-600 w-fit">
          {#if selectedRellist.installtillonair.subcon}
            {selectedRellist.installtillonair.subcon}
          {:else}
            No Subcon
          {/if}
        </span>
      </div>
      {#if selectedRellist.doinfo.do_number}
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
        <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.install_start}</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">Complete Date</p>
        {#if selectedRellist.installtillonair.install_complete}
          <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.install_complete}</p>
        {:else}
          <p class="text-sm text-rose-400">{selectedRellist.installtillonair.installdelay}</p>
        {/if}
      </div>
      {#if selectedRellist.installtillonair.install_start && !selectedRellist.installtillonair.install_complete}
      <div class="flex flex-col">
        <p class="text-xs text-rose-400">{selectedRellist.installtillonair.installdelay_detail}</p>
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
        <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.integration_date}</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">TurnOn Date</p>
        {#if selectedRellist.installtillonair.integration_turnon}
          <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.integration_turnon}</p>
        {:else}
          <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.integratedelay}</p>
        {/if}
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">OnAir Date</p>
        {#if selectedRellist.installtillonair.onair_date}
          <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.onair_date}</p>
        {:else}
          <p class="text-sm text-slate-500 dark:text-rose-400">{selectedRellist.installtillonair.onairdelay}</p>
        {/if}
      </div>
      {#if selectedRellist.installtillonair.integration_turnon && !selectedRellist.installtillonair.onair_date}
      <div class="flex flex-col">
        <p class="text-xs text-rose-400">{selectedRellist.installtillonair.onairdelay_detail}</p>
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
        {#if selectedRellist.installtillonair.onair_date && selectedRellist.installtillonair.coi_submit_date}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">COI Submit Date</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.coi_submit_date}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">COI Approval Date</p>
            {#if selectedRellist.installtillonair.coi_approval_date}
              <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.coi_approval_date}</p>
            {:else}
              <p class="text-sm text-rose-400">{selectedRellist.installtillonair.coidelay}</p>
            {/if}
          </div>
          {#if selectedRellist.installtillonair.coi_submit_date && !selectedRellist.installtillonair.coi_approval_date}
            <div class="flex flex-col">
              <p class="text-xs text-rose-400">{selectedRellist.installtillonair.coidelay_detail}</p>
            </div>
          {/if}
        {:else if selectedRellist.installtillonair.onair_date && !selectedRellist.installtillonair.coi_submit_date}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-rose-400">Pending COI submit to YTLC</p>
          </div>
        {/if}

        <!-- COI&C -->
        {#if selectedRellist.installtillonair.onair_date && selectedRellist.installtillonair.coic_submit_date}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">COI&C Submit Date</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.coic_submit_date}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">COI&C Approval Date</p>
            {#if selectedRellist.installtillonair.coic_approval_status}
              <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.coic_approval_status}</p>
            {:else}
              <p class="text-sm text-rose-400">{selectedRellist.installtillonair.coicdelay}</p>
            {/if}
          </div>
          {#if selectedRellist.installtillonair.coic_submit_date && !selectedRellist.installtillonair.coic_approval_status}
            <div class="flex flex-col">
              <p class="text-xs text-rose-400">{selectedRellist.installtillonair.coicdelay_detail}</p>
            </div>
          {/if}
        {:else if selectedRellist.installtillonair.onair_date && !selectedRellist.installtillonair.coic_submit_date}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-rose-400">Pending COI&C submit to YTLC</p>
          </div>
        {/if}

        <!-- PNOC -->
        {#if selectedRellist.installtillonair.onair_date && selectedRellist.installtillonair.pnoc_ho_trigger_date && selectedRellist.installtillonair.pnoc_ho_trigger_date !== "1976-01-01"}
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">PNOC HO Trigger date</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.pnoc_ho_trigger_date}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-500 dark:text-slate-400">PNOC HO Complete date</p>
            {#if selectedRellist.installtillonair.pnoc_ho_complete_date}
              <p class="text-sm text-slate-500 dark:text-slate-400">{selectedRellist.installtillonair.pnoc_ho_complete_date}</p>
            {:else}
              <p class="text-sm text-rose-400">Pending HO</p>
            {/if}
          </div>
        {:else if selectedRellist.installtillonair.onair_date && !selectedRellist.installtillonair.pnoc_ho_trigger_date || selectedRellist.installtillonair.pnoc_ho_trigger_date === "1976-01-01"}
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
      on:click={() => {siteId = selectedRellist.installtillonair.id; installUpdateModal = true }}>
      Update Install
    </Button>
    <Button on:click={() => (installdetaildrawer = true)} class="px-4"><Icon icon="ph:x" class="me-1" /> Close</Button>
  </div>
</Drawer>

<!-- Modal -->
<UpdateInstallModal 
bind:installUpdateModal={installUpdateModal} {siteId} 
/>