<script lang="ts">
  import { Drawer, Button, CloseButton } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
  import { sineIn } from 'svelte/easing'
  import UpdateoptModal from '../crud/UpdateoptModal.svelte';

  export let selectedRellist:any = {};
  export let optdetaildrawer = true;
  export let search: () => Promise<void>;
  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  }

  let siteId = '';
  let optUpdateModal = false;

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
    Site Not OnAir Yet
  {:else if selectedRellist.optimization.optstartdate == null}
    Pending optimization start
  {:else if selectedRellist.optimization.optcompletedate}
    <div class="grid grid-cols-3 p-4 rounded-lg border border-slate-700 mb-4">
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
        {#if selectedRellist.optimization.optapprovedate}
          <p class="text-lime-400">
            {selectedRellist.optimization.opttype} Approved on {selectedRellist.optimization.optapprovedate}
          </p>
        {/if}
      </div>
    {:else}
      <div class="flex items-center text-slate-400 gap-2 mb-4">
        <Icon icon="material-symbols:rate-review-outline" class="text-2xl" />
        <p class="text-slate-400 text-sm">Report Review history</p>
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