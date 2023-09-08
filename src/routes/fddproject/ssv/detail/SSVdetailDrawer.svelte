<script lang="ts">
  import { Drawer, Button, CloseButton } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
  import { sineIn } from 'svelte/easing'
  import UpdatessvModal from '../crud/UpdatessvModal.svelte';

  export let selectedRellist:any = {};
  export let ssvdetaildrawer = true;
  export let search: () => Promise<void>;
  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  }

  let siteId = '';
  let ssvUpdateModal = false;

  async function refreshData() {
    if (search) {
      await search();
    }
  }
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
        {selectedRellist.ssv.sitebasicinfo}
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        {selectedRellist.sitebasicinfo.sitename}
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
          {selectedRellist.sitebasicinfo.region}
        </span>
      </div>
      <div class="flex items-center">
        <span class="text-xs text-slate-200 dark:text-slate-200 rounded-sm py-0.5 px-3 bg-slate-600 w-fit">
          {#if selectedRellist.ssv.ssvsubcon}
            {selectedRellist.ssv.ssvsubcon}
          {:else}
            Subcon
          {/if}
        </span>
      </div>
      {#if selectedRellist.install.oaairdate}
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
    {:else if !selectedRellist.do.doissuedate}
      <p class="text-slate-400">No request material deliver from YTLC</p>
    {:else if selectedRellist.do.doissuedate && !selectedRellist.install.oaairdate}
    <div class="flex flex-col">
      <p class="text-slate-400">Meterial deliveried but not onair yet</p>
      <p class="text-slate-400">Material deliveried date: {selectedRellist.do.doissuedate}</p>
    </div>
    {:else if selectedRellist.install.oaairdate && !selectedRellist.ssv.ssvstartdate}
      <!-- Pending -->
      <div class="flex flex-col mb-2 gap-2">
        <p class="text-slate-400 text-xs flex items-center gap-2">
          OnAir Date: 
          <span class="rounded-full bg-slate-600 text-xs text-white py-0.5 px-2">
            {selectedRellist.install.oaairdate}
          </p>
        <div class="flex items-center gap-2">
          <p class="text-xs text-rose-400">Pending to start SSV</p>
        </div>
      </div>
    {:else}
      <!-- SSV Activity -->
      <div class="flex flex-col border border-slate-200 dark:border-slate-700 p-4 pt-6 rounded-xl mb-4">
        <p class="text-slate-400 mb-4 px-2 rounded-full">SSV Activity</p>
        <div class="grid grid-cols-3 items-center">
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssv.ssvstartdate ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-600'}">
              <Icon icon="codicon:debug-start" class="text-lg"/>
            </p>
            <p class="text-slate-400 text-xs">SSV Start</p>
            <p class="text-slate-400 text-xs">{selectedRellist.ssv.ssvstartdate}</p>
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssv.ssvcompletedate ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-600'}">
              <Icon icon="ci:stop" class="text-lg" />
            </p>
            <p class="text-slate-400 text-xs">SSV Complete</p>
            <p class="text-slate-400 text-xs">{selectedRellist.ssv.ssvcompletedate}</p>
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssv.ssvsubmitdate ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-600'}">
              <Icon icon="iconoir:submit-document" class="text-lg" />
            </p>
            <p class="text-slate-400 text-xs">SSV Submit</p>
            <p class="text-slate-400 text-xs">{selectedRellist.ssv.ssvsubmitdate}</p>
          </div>
        </div>        
      </div>

      <!-- BS Report -->
      <div class="flex flex-col border border-slate-200 dark:border-slate-700 p-4 pt-6 rounded-xl mb-4">
        <p class="text-slate-400 mb-4 px-2 rounded-full">BS Report Status</p>
        <div class="grid grid-cols-3 items-center mb-2">
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssv.bsreceivedate ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-400'}">
              <Icon icon="mdi:email-receive-outline" class="text-lg" />
            </p>
            <p class="text-slate-400 text-xs">BS Receive</p>
            {#if selectedRellist.ssv.bsreceivedate}
            <p class="text-slate-400 text-xs">{selectedRellist.ssv.bsreceivedate}</p>
            {:else}
            <p class="text-rose-400 text-xs">Pending</p>
            {/if}
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssv.bssubmitdate ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-400'}">
              <Icon icon="iconoir:submit-document" class="text-lg" />
            </p>
            <p class="text-slate-400 text-xs">BS Submit</p>
            {#if selectedRellist.ssv.bssubmitdate}
            <p class="text-slate-400 text-xs">{selectedRellist.ssv.bssubmitdate}</p>
            {:else}
            <p class="text-rose-400 text-xs">Pending</p>
            {/if}
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="rounded-full h-8 w-8 bg-slate-600 text-xs flex items-center justify-center mb-2 {selectedRellist.ssv.bsapprovedate ? 'text-lime-400 ring-4 ring-lime-400' : 'text-slate-400'}">
              <Icon icon="material-symbols:order-approve-outline-rounded" class="text-lg" />
            </p>
            <p class="text-slate-400 text-xs">BS Approve</p>
            {#if selectedRellist.ssv.bsapprovedate}
            <p class="text-slate-400 text-xs">{selectedRellist.ssv.bsapprovedate}</p>
            {:else}
            <p class="text-rose-400 text-xs">Pending</p>
            {/if}
          </div>
        </div> 
        {#if selectedRellist.ssv.ssvsubmitdate && !selectedRellist.ssv.bssubmitdate}
        <div class="flex flex-col items-center justify-center">
          <p class="text-slate-400 text-xs">Pending BS Report Submit to YTLC</p>
        </div>
        {/if}
        {#if selectedRellist.ssv.bssubmitdate && !selectedRellist.ssv.bsapprovedate}
        <div class="flex flex-col items-center justify-center">
          <p class="text-slate-400 text-xs">Pending BS Report Approve</p>
        </div>
        {/if}
        
      </div>

      <!-- I&C Submit status-->
      {#if selectedRellist.ssv.ic_submit_date}
      <div class="flex items-center border border-slate-200 dark:border-slate-700 p-4 pt-6 rounded-xl mb-4 gap-2">
        <Icon icon="iconoir:submit-document" class="text-2xl text-lime-400" />
        <p class="text-slate-400 text-sm">I&C Report submit:</p>
        <p class="text-slate-400 text-sm me-auto">{selectedRellist.ssv.ic_submit_date}</p>
        <Icon icon="material-symbols:check-circle-outline" class="me-1 text-lime-400"/>
      </div>
      {:else if selectedRellist.ssv.bsapprovedate && !selectedRellist.ssv.ic_submit_date}
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
      on:click={() => {siteId = selectedRellist.ssv.id; ssvUpdateModal = true }}>
      Update SSV
    </Button>
    <Button on:click={() => (ssvdetaildrawer = true)} class="px-4"><Icon icon="ph:x" class="me-1" /> Close</Button>
  </div>

</Drawer>

<!-- Modal -->
<UpdatessvModal 
  bind:ssvUpdateModal={ssvUpdateModal} {siteId} {search}
/>