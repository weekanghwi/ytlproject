<script lang="ts">
  import { Drawer, Button, CloseButton, Timeline, TimelineItem, TimelineItemVertical } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
  import { sineIn } from 'svelte/easing'
  // import UpdateInstallModal from '../crud/UpdateInstallModal.svelte';

  export let selectedRellist:any = {};
  export let ssvdetaildrawer = true;
  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  }

  let siteId = '';
  let ssvUpdateModal = false;

  $: dodate = selectedRellist.doinfo?.do_number; // reactive statement
  $: codsubmitdate = selectedRellist.doinfo?.cod_submit_to_ytl_date; // reactive statement
  $: codapprovaldate = selectedRellist.doinfo?.cod_approval_date; // reactive statement

  $: spanClass = `flex absolute left-1 justify-center items-center w-4 h-4 ${
    dodate
        ? 'bg-lime-400 rounded-full ring-8 ring-lime-500' // 둘 다 참일 때
      : '' // 그 외의 경우
  }`; // reactive statement
</script>

<Drawer width="w-96" placement="right" transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={ssvdetaildrawer} id="dodetaildrawer">
  <div class="flex items-center">
    <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-slate-500 dark:text-slate-400">
      <Icon icon="ri:taxi-wifi-line" class="me-2 text-2xl"/>SSV Information
    </h5>
    <CloseButton on:click={() => (ssvdetaildrawer = true)} class="mb-4 dark:text-white" />
  </div>

  <!-- SSV Description -->
  <div class="flex flex-col gap-1 mb-6">
    <div class="flex flex-col mb-3 items-center justify-center">
      <p class="text-lg text-slate-500 dark:text-slate-400">
        {selectedRellist.ssvsection.sitebasicinfo}
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        {selectedRellist.sitebasicinfo.site_name}
      </p>
    </div>
    <div class="flex items-center justify-center gap-2">
      {#if selectedRellist.sitebasicinfo.contracttype.startsWith('Confirm')}
      <div class="text-xs text-slate-900 dark:text-slate-900 rounded-sm py-0.5 px-3 bg-lime-400 w-fit">
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
        <span class="text-xs text-slate-200 dark:text-slate-200 rounded-sm py-0.5 px-3 bg-slate-600 w-fit">
          {selectedRellist.sitebasicinfo.regions}
        </span>
      </div>
      <div class="flex items-center">
        <span class="text-xs text-slate-200 dark:text-slate-200 rounded-sm py-0.5 px-3 bg-slate-600 w-fit">
          {#if selectedRellist.ssvsection.subcon}
            {selectedRellist.ssvsection.subcon}
          {:else}
            Subcon
          {/if}
        </span>
      </div>
      {#if selectedRellist.installtillonair.onair_date}
      <div class="flex items-center">
        <span class="text-xs text-slate-900 dark:text-slate-900 rounded-sm py-0.5 px-3 bg-lime-400 w-fit">
          OnAir
        </span>
      </div>
      {:else}
      <div class="flex items-center">
        <span class="text-xs text-slate-500 dark:text-slate-900 rounded-sm py-0.5 px-3 bg-rose-400 w-fit">
          N OnAir
        </span>
      </div>
      {/if}
    </div>
  </div>

  <!-- SSV Information -->
  <div class="flex flex-col mb-4">
    {#if !selectedRellist.sitebasicinfo.contracttype.startsWith('Confirm') && !selectedRellist.sitebasicinfo.contracttype.startsWith('Reuse-Replace')}
    <div class="flex">
      <p class="text-slate-400 text-xs">This site no need to check SSV information because this site is not confirm meterial or Reuse-Replace site. SSV scope is YTLC</p>
    </div>
    {:else if selectedRellist.installtillonair.onair_date && !selectedRellist.ssvsection.ssv_start_date}
      <!-- Pending -->
      <div class="flex flex-col mb-2 gap-2">
        <p class="text-slate-400 text-xs flex items-center gap-2">
          OnAir Date: 
          <span class="rounded-full bg-slate-600 text-xs text-white py-0.5 px-2">
            {selectedRellist.installtillonair.onair_date}
          </p>
        <div class="flex items-center gap-2">
          <p class="text-xs text-rose-400">Pending to start SSV</p>
          <p class="text-xs text-slate-900 rounded-full bg-rose-400 py-0.5 px-2">{selectedRellist.ssvsection.ssvdelaycategory}</p>
        </div>
        <p class="text-slate-400 text-xs">{selectedRellist.ssvsection.bs_delay_detail}</p>
      </div>
    {:else}
      <!-- SSV Activity -->
      <div class="flex flex-col border border-slate-200 dark:border-slate-700 p-4 pt-6 rounded-xl mb-4">
        <p class="text-slate-400 mb-4 px-2 rounded-full">SSV Activity</p>
        <div class="grid grid-cols-3 items-center">
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssvsection.ssv_start_date ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-600'}">
              <Icon icon="codicon:debug-start" class="text-lg"/>
            </p>
            <p class="text-slate-400 text-xs">SSV Start</p>
            <p class="text-slate-400 text-xs">{selectedRellist.ssvsection.ssv_start_date}</p>
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssvsection.ssv_complete_date ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-600'}">
              <Icon icon="ci:stop" class="text-lg" />
            </p>
            <p class="text-slate-400 text-xs">SSV Complete</p>
            <p class="text-slate-400 text-xs">{selectedRellist.ssvsection.ssv_complete_date}</p>
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssvsection.ssv_submit_date ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-600'}">
              <Icon icon="iconoir:submit-document" class="text-lg" />
            </p>
            <p class="text-slate-400 text-xs">SSV Submit</p>
            <p class="text-slate-400 text-xs">{selectedRellist.ssvsection.ssv_submit_date}</p>
          </div>
        </div>        
      </div>

      <!-- BS Report -->
      <div class="flex flex-col border border-slate-200 dark:border-slate-700 p-4 pt-6 rounded-xl mb-4">
        <p class="text-slate-400 mb-4 px-2 rounded-full">BS Report Status</p>
        <div class="grid grid-cols-3 items-center mb-2">
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssvsection.bs_receive_date ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-400'}">
              <Icon icon="mdi:email-receive-outline" class="text-lg" />
            </p>
            <p class="text-slate-400 text-xs">BS Receive</p>
            {#if selectedRellist.ssvsection.bs_receive_date}
            <p class="text-slate-400 text-xs">{selectedRellist.ssvsection.bs_receive_date}</p>
            {:else}
            <p class="text-rose-400 text-xs">Pending</p>
            {/if}
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssvsection.bs_submit_date ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-400'}">
              <Icon icon="iconoir:submit-document" class="text-lg" />
            </p>
            <p class="text-slate-400 text-xs">BS Submit</p>
            {#if selectedRellist.ssvsection.bs_submit_date}
            <p class="text-slate-400 text-xs">{selectedRellist.ssvsection.bs_submit_date}</p>
            {:else}
            <p class="text-rose-400 text-xs">Pending</p>
            {/if}
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssvsection.bs_approval_date ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-400'}">
              <Icon icon="material-symbols:order-approve-outline-rounded" class="text-lg" />
            </p>
            <p class="text-slate-400 text-xs">BS Approve</p>
            {#if selectedRellist.ssvsection.bs_approval_date}
            <p class="text-slate-400 text-xs">{selectedRellist.ssvsection.bs_approval_date}</p>
            {:else}
            <p class="text-rose-400 text-xs">Pending</p>
            {/if}
          </div>
        </div> 
        {#if selectedRellist.ssvsection.ssv_submit_date && !selectedRellist.ssvsection.bs_submit_date}
        <div class="flex flex-col items-center justify-center">
          <p class="text-slate-400 text-xs">Pending BS Report Submit due to</p>
          <p class="text-rose-400 text-xs">{selectedRellist.ssvsection.bssubmitdelaycategory}</p>
        </div>
        {/if}
        {#if selectedRellist.ssvsection.bs_submit_date && !selectedRellist.ssvsection.bs_approval_date}
        <div class="flex flex-col items-center justify-center">
          <p class="text-slate-400 text-xs">Pending BS Report Approve due to</p>
          <p class="text-rose-400 text-xs">{selectedRellist.ssvsection.bsapprovaldelaycategory}</p>
        </div>
        {/if}
        
      </div>

      <!-- I&C Submit status-->
      {#if selectedRellist.ssvsection.ic_submit_date}
      <div class="flex items-center border border-slate-200 dark:border-slate-700 p-4 pt-6 rounded-xl mb-4 gap-2">
        <Icon icon="iconoir:submit-document" class="text-2xl text-lime-400" />
        <p class="text-slate-400 text-sm">I&C Report submit:</p>
        <p class="text-slate-400 text-sm me-auto">{selectedRellist.ssvsection.ic_submit_date}</p>
        <Icon icon="material-symbols:check-circle-outline" class="me-1 text-lime-400"/>
      </div>
      {:else if selectedRellist.ssvsection.bs_approval_date && !selectedRellist.ssvsection.ic_submit_date}
      <div class="flex items-center border border-slate-200 dark:border-slate-700 p-4 pt-6 rounded-xl mb-4 gap-2">
        <Icon icon="iconoir:submit-document" class="text-2xl text-rose-400" />
        <p class="text-slate-400 text-sm me-auto">Pending I&C Report submit</p>
        <Icon icon="nonicons:not-found-16" class="me-1 text-rose-400"/>
      </div>
      {/if}
    {/if}
  </div>

  <div class="grid grid-cols-2 gap-4">
    <Button color="blue"
      on:click={() => {siteId = selectedRellist.ssvsection.id; ssvUpdateModal = true }}>
      Update SSV
    </Button>
    <Button on:click={() => (ssvdetaildrawer = true)} class="px-4"><Icon icon="ph:x" class="me-1" /> Close</Button>
  </div>

</Drawer>