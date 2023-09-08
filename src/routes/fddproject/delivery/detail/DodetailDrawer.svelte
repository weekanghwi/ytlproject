<script lang="ts">
  import { Drawer, Button, CloseButton, Timeline, TimelineItem, TimelineItemVertical } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
  import { sineIn } from 'svelte/easing'
  import UpdateDoModal from '../crud/UpdateDOModal.svelte';

  export let selectedRellist:any = {};
  export let dodetaildrawer = true;
  export let search: () => Promise<void>;
  let siteId = '';
  let doUpdateModal = false
  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  }

  async function refreshData() {
    if (search) {
      await search();
    }
  }

  // style condition
  $: dodate = selectedRellist.do?.doissuedate; // reactive statement
  $: codsubmitdate = selectedRellist.do?.codsubmitdate; // reactive statement
  $: codapprovaldate = selectedRellist.do?.codapprovedate; // reactive statement

  $: spanClass = `flex absolute left-1 justify-center items-center w-4 h-4 ${
    dodate
        ? 'bg-lime-400 rounded-full ring-8 ring-lime-500' // 둘 다 참일 때
      : '' // 그 외의 경우
  }`; // reactive statement

  $: spanClassSubmit = `flex absolute left-1 justify-center items-center w-4 h-4 ${
    dodate
      ? codsubmitdate
        ? 'bg-lime-400 rounded-full ring-8 ring-lime-500' // 둘 다 참일 때
        : 'bg-rose-400 rounded-full ring-8 ring-rose-500' // dodate만 참일 때
      : '' // 그 외의 경우
  }`; // reactive statement

  $: spanClassApproval = `flex absolute left-1 justify-center items-center w-4 h-4 ${
    codsubmitdate
      ? codapprovaldate
        ? 'bg-lime-400 rounded-full ring-8 ring-lime-500' // 둘 다 참일 때
        : 'bg-rose-400 rounded-full ring-8 ring-rose-500' // dodate만 참일 때
      : '' // 그 외의 경우
  }`; // reactive statement
</script>


<Drawer placement="right" transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={dodetaildrawer} id="dodetaildrawer">
  <div class="flex items-center">
    <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-slate-500 dark:text-slate-400">
      <Icon icon="carbon:delivery-add" class="me-2"/>DO information
    </h5>
    <CloseButton on:click={() => (dodetaildrawer = true)} class="mb-4 dark:text-white" />
  </div>

  <!-- DO description -->
  <div class="flex flex-col gap-1 mb-6">
    <p class="text-sm text-slate-500 dark:text-slate-400">
      {selectedRellist.sitebasicinfo.siteid} DO Detail Information
    </p>
    {#if selectedRellist.do.doissuedate}
      <p class="text-sm text-slate-500 dark:text-slate-400">
        DO Status: <span class="text-lime-500">Complete Delivery</span>
      </p>
    {:else}
      <p class="text-sm text-slate-500 dark:text-slate-400">
        DO Status: <span class="text-rose-500">No DO ({selectedRellist.sitebasicinfo.contracttype})</span>
      </p>
    {/if}
  </div>

  <!-- DO Detail content -->
  <div class="flex flex-col ps-4 mb-4">
    <p class="mb-6 text-sm text-slate-500 dark:text-slate-400">
    {#if selectedRellist.do.doissuedate}
    <Timeline order="vertical">
      <!-- DO Issue -->
      <TimelineItemVertical
        title="DO Issue date"
        date="{selectedRellist.do.doissuedate}"
        h3Class="flex items-center mb-1 text-sm font-semibold text-slate-900 dark:text-slate-300"
      >
        <svelte:fragment slot="icon">
          <span class={spanClass}>
            <Icon icon="charm:git-request" class="w-3 h-3 text-slate-800" />
          </span>
        </svelte:fragment>
      </TimelineItemVertical>

      <!-- COD Submit -->
      <TimelineItemVertical
        title="COD Submit date" 
        date="{selectedRellist.do.codsubmitdate ? selectedRellist.do.codsubmitdate : 'Pending COD submit to YTLC'}"
        h3Class="flex items-center mb-1 text-sm font-semibold text-slate-900 dark:text-slate-300"
        timeClass = "block mb-2 text-sm font-normal leading-none {selectedRellist.do.codsubmitdate ? 'text-lime-400' : 'text-rose-400'}"     
      >
        <svelte:fragment slot="icon">
          <span class={spanClassSubmit}>
            <Icon icon="fe:document" class="w-3 h-3 text-slate-800" />
          </span>
        </svelte:fragment>
        {#if selectedRellist.do.doissuedate && !selectedRellist.do.codsubmitdate}
        <p class="mb-4 text-base font-normal text-slate-500 dark:text-slate-400">
          Pending COD Submit
        </p>
        {/if}
      </TimelineItemVertical>

      <!-- COD Approval -->
      {#if selectedRellist.do.codsubmitdate}
      <TimelineItemVertical
        title="COD Approve date" 
        date="{selectedRellist.do.codapprovedate ? selectedRellist.do.codapprovedate : 'Pending COD approval'}"
        h3Class="flex items-center mb-1 text-sm font-semibold text-slate-900 dark:text-slate-300"
        timeClass = "block mb-2 text-sm font-normal leading-none {selectedRellist.do.codapprovedate ? 'text-lime-400' : 'text-rose-400'}"            
      >
        <svelte:fragment slot="icon">
          <span class={spanClassApproval}>
            <Icon icon="material-symbols:order-approve-outline" class="w-3 h-3 text-slate-800" />
          </span>
        </svelte:fragment>
        {#if selectedRellist.do.codsubmitdate && !selectedRellist.do.codapprovedate}
        <p class="mb-4 text-base font-normal text-slate-500 dark:text-slate-400">
          Pending COD Approved
        </p>
        {/if}
      </TimelineItemVertical>
      {/if}
    </Timeline>
    {:else}
      <div class="flex items-center justify-center mt-6">
        <Icon icon="streamline:computer-desktop-delete-device-remove-display-computer-deny-desktop-fail-failure" class="text-7xl text-rose-300"/>
      </div>
    {/if}
  </div>
  
  <div class="grid grid-cols-2 gap-4">
    <Button color="blue"
      on:click={() => {
        siteId = selectedRellist.ssv.id; 
        doUpdateModal = true 
    }}>
      Update DO
    </Button>
    <Button on:click={() => (dodetaildrawer = true)} class="px-4"><Icon icon="ph:x" class="me-1" /> Close</Button>
  </div>
</Drawer>

<UpdateDoModal
  bind:doUpdateModal={doUpdateModal} {siteId} {search}
/>

