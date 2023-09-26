<script lang="ts">
  import { Drawer, Button, CloseButton, Table, TableBody, TableBodyCell, TableHead, TableHeadCell, TableBodyRow } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
  import { sineIn } from 'svelte/easing'
  import UpdateoptModal from '../crud/UpdateoptModal.svelte';
  import CreateoptReviewModal from '../crud/CreateoptReviewModal.svelte';
  import UpdateoptReviewModal from '../crud/UpdateoptReviewModal.svelte';

  export let selectedRellist:any = {};
  export let optdetaildrawer = true;
  export let search: () => Promise<void>;
  export let optReviewData:any = []
  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  }

  let siteId = '';
  let reviewId = '';
  let optUpdateModal = false;
  let createOPTReviewModal = false;
  let updateOPTReviewModal = false;

  async function refreshData() {
    if (search) {
      await search();
    }
  }
</script>

<Drawer width="w-96" placement="right" transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={optdetaildrawer} id="dodetaildrawer">
  <div class="flex items-center">
    <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-slate-500 dark:text-slate-400">
      <Icon icon="clarity:data-cluster-line" class="text-2xl me-2"/>Optimization Detail Information
    </h5>
    <CloseButton on:click={() => (optdetaildrawer = true)} class="mb-4 dark:text-white" />
  </div>
  <!-- Optimization basic information-->
  <div class="flex flex-col items-center justify-center mb-4">
    <h2 class="text-slate-400">{selectedRellist.optimization.sitebasicinfo}</h2>
    <p class="text-xs text-slate-400 mb-1">{selectedRellist.sitebasicinfo.sitename}</p>
    <div class="flex items-center justify-center gap-2">
      <p class="rounded-sm py-0.5 px-2 text-xs bg-lime-400">{selectedRellist.optimization.opttype}</p>
      <p class="rounded-sm py-0.5 px-2 text-xs {selectedRellist.optimization.optsubcon === null ? 'bg-rose-400' : 'bg-lime-400'}">
        {#if selectedRellist.optimization.optsubcon === null}
          Not Assign subcon
        {:else}
          {selectedRellist.optimization.optsubcon}
        {/if}
      </p>
      <p class="rounded-sm py-0.5 px-2 text-xs {selectedRellist.ssv.ssvcompletedate === null ? 'bg-rose-400' : 'bg-lime-400'} ">
        {#if selectedRellist.install.oaairdate === null && selectedRellist.ssv.ssvcompletedate === null}
          Not Onair
        {:else if selectedRellist.install.oaairdate && selectedRellist.ssv.ssvcompletedate === null}
          Pending SSV
        {:else if selectedRellist.install.oaairdate && selectedRellist.ssv.ssvcompletedate}
          SSV Complete
        {/if}
      </p>
    </div>
  </div>

  <!-- Optimization act information -->
  {#if selectedRellist.install.oaairdate === null}
    <p class="text-rose-400 mb-4">Site Not OnAir Yet</p>
  {:else if selectedRellist.optimization.optstartdate == null}
  <p class="text-rose-400 mb-4">Pending optimization start</p>
  {:else if selectedRellist.optimization.optstartdate}
    <div class="grid grid-cols-3 p-4 rounded-lg border border-slate-700 mb-6">
      <div class="flex flex-col items-center justify-center">
        <p class="rounded-full h-8 w-8 flex items-center justify-center mb-4  text-lime-400 ring-4 ring-lime-400">
          <Icon icon="codicon:debug-start" class="text-lg"/>
        </p>
        <p class="text-slate-400 text-xs">OPT Start</p>
        <p class="text-slate-400 text-xs">{selectedRellist.optimization.optstartdate}</p>
      </div>

      <div class="flex flex-col items-center justify-center">
        <p class="rounded-full h-8 w-8 flex items-center justify-center mb-4 {selectedRellist.optimization.optcompletedate ? 'text-lime-400 ring-4 ring-lime-400' : 'text-rose-400 ring-4 ring-rose-400'}  ">
          <Icon icon="ci:stop" class="text-lg" />
        </p>
        <p class="text-slate-400 text-xs">OPT Complete</p>
        <p class="{selectedRellist.optimization.optcompletedate ? 'text-slate-400' : 'text-rose-400'} text-xs">
          {#if selectedRellist.optimization.optcompletedate === null}
            Pending
          {:else}
            {selectedRellist.optimization.optcompletedate}
          {/if}
        </p>
      </div>

      <div class="flex flex-col items-center justify-center">
        <p class="rounded-full h-8 w-8 flex items-center justify-center mb-4 {selectedRellist.optimization.optsubmitdate ? 'text-lime-400 ring-4 ring-lime-400' : 'text-rose-400 ring-4 ring-rose-400'}  ">
          <Icon icon="iconoir:submit-document" class="text-lg" />
        </p>
        <p class="text-slate-400 text-xs">Report Submit</p>
        <p class="{selectedRellist.optimization.optsubmitdate ? 'text-slate-400' : 'text-rose-400'} text-xs">
          {#if selectedRellist.optimization.optsubmitdate === null}
            Pending
          {:else}
            {selectedRellist.optimization.optsubmitdate}
          {/if}
        </p>
      </div>
    </div>
    {#if selectedRellist.optimization.optapprovedate}
      <div class="flex items-center justify-center mb-4">
        <p class="text-lime-400">
          {selectedRellist.optimization.opttype} Approved on {selectedRellist.optimization.optapprovedate}
        </p>
      </div>
    {:else}
      <div class="flex items-center text-slate-400 gap-2 mb-4">
        <Icon icon="material-symbols:rate-review-outline" class="text-2xl" />
        <p class="text-slate-400 text-sm me-auto">Report Review history</p>
        <Button 
          color="purple"
          size="xs"
          on:click={() => {siteId = selectedRellist.optimization.id; createOPTReviewModal = true }}>
          Create Review Data
        </Button>
      </div>

      <!-- Review History -->
      {#if optReviewData.length > 0}
      <div class="flex items-center justify-center mb-6 gap-2">
        <p class="text-xs text-slate-900 rounded-sm bg-lime-400 py-0.5 px-1">
          PIC: {optReviewData[optReviewData.length - 1].pic}
        </p>
        <p class="text-xs text-slate-900 rounded-sm bg-lime-400 py-0.5 px-1">
          Status: {optReviewData[optReviewData.length - 1].reviewstatus}
        </p>
        <p class="text-xs text-slate-900 rounded-sm bg-lime-400 py-0.5 px-1">
          Date: {optReviewData[optReviewData.length - 1].reviewdate}
        </p>
      </div>
      {/if}
      <div class="felx items-center mb-4">
        {#if Array.isArray(optReviewData)}
          {#each optReviewData as review}
          <div class="flex items-center border-b border-slate-600 pb-1 mb-1">
            <p class="text-xs text-slate-400 mb-1 uncate w-[250px] inline-block">{review.reviewdate}: {review.reviewdetail}</p>
            <button 
              class="rounded-sm bg-slate-400 text-xs ms-auto py-0.5 px-1"
              on:click={() => {reviewId = review.id; updateOPTReviewModal = true}}>
              {review.reviewstatus}
            </button>
          </div>
          {/each}
        {:else}
        <p class="text-rose-400 text-xs">No Review data available</p>
        {/if}
      </div>

    {/if}
  {/if}

  <div class="grid grid-cols-2 gap-4">
    <Button color="blue"
      on:click={() => {siteId = selectedRellist.optimization.id; optUpdateModal = true }}>
      Update OPT
    </Button>
    <Button on:click={() => (optdetaildrawer = true)} class="px-4"><Icon icon="ph:x" class="me-1" /> Close</Button>
  </div>

</Drawer>

<!-- Modal -->
<UpdateoptModal 
  bind:optUpdateModal={optUpdateModal} {siteId} {search}
/>

<CreateoptReviewModal
  bind:createOPTReviewModal={createOPTReviewModal} {siteId} {search}
/>

<UpdateoptReviewModal
  bind:updateOPTReviewModal={updateOPTReviewModal} {reviewId} {search}
/>