<script lang="ts">
  import { Drawer, Button, CloseButton, Timeline, TimelineItem, TimelineItemVertical } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
  import { sineIn } from 'svelte/easing'
  import UpdateDoModal from '../crud/UpdateDOModal.svelte';
  import UpdateMaterialModal from '../crud/UpdateMaterialModal.svelte';

  export let selectedRellist:any = {};
  export let dodetaildrawer = true;
  export let search: () => Promise<void>;
  let siteId = '';
  let doUpdateModal = false
  let materialUpdateModal = false
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
  </div>

  <div class="flex items-center mb-6">
    <p class="text-slate-400 text-xs font-bold me-2">Site Category</p>
    <p class="rounded-md py-0.5 px-2 text-xs text-slate-800"
      class:bg-lime-400={selectedRellist.sitebasicinfo.contracttype.startsWith('Confirm')}
      class:bg-rose-400={!selectedRellist.sitebasicinfo.contracttype.startsWith('Confirm')}
    >
      {selectedRellist.sitebasicinfo.contracttype}
    </p>
  </div>

  <hr class="mb-3 border border-slate-700/80">

  {#if selectedRellist.sitebasicinfo.contracttype.startsWith('Confirm') || selectedRellist.sitebasicinfo.contracttype === 'Reuse_Replace'}
    {#if !selectedRellist.do.doissuedate}
      <p class="text-rose-400 text-sm me-2 mb-6">Pending Delivery</p>
    {:else}
      <div class="grid grid-cols-3 text-sm me-2 mb-6  py-4">
        <div class="flex flex-col items-center justify-center gap-2">
          <p class="rounded-full h-6 w-6 bg-lime-100 flex items-center justify-center ring-4 ring-lime-500">
            <Icon icon="carbon:delivery-add" />
          </p>
          <p class="text-xs text-slate-400">DO Issue</p>
          <p class="text-xs text-slate-400">{selectedRellist.do.doissuedate}</p>
        </div>

        <div class="flex flex-col items-center justify-center gap-2">
          <p class="rounded-full h-6 w-6 bg-lime-100 flex items-center justify-center ring-4 ring-lime-500">
            <Icon icon="carbon:directory-domain" />
          </p>
          <p class="text-xs text-slate-400">DU Materail</p>
          <p class="text-xs text-slate-400">
            {#if selectedRellist.material.dumaterial === 'Samsung-Material'}
              Samsung
            {:else if selectedRellist.material.dumaterial === 'Reuse-Material'}
              Re-Use
            {:else if !selectedRellist.material.dumaterial}
              <p class="text-rose-400">Pending Update</p>
            {/if}
            </p>
        </div>

        <div class="flex flex-col items-center justify-center gap-2">
          <p class="rounded-full h-6 w-6 bg-lime-100 flex items-center justify-center ring-4 ring-lime-500">
            <Icon icon="fluent:branch-16-regular" />
          </p>
          <p class="text-xs text-slate-400">DU Materail</p>
          <p class="text-xs text-slate-400">
            {#if selectedRellist.material.rumaterial === 'Samsung-Material'}
              Samsung
            {:else if selectedRellist.material.rumaterial === 'Reuse-Material'}
              Re-Use
            {:else if !selectedRellist.material.rumaterial}
              <p class="text-rose-400">Pending Update</p>
            {/if}
            </p>
        </div>

        <div class="flex col-span-3 justify-center mt-6">
          <button 
            class="col-span-3 py-2 px-3 bg-lime-400 text-slate-900 text-xs font-bold rounded-lg hover:bg-lime-500 focus:ring-4 focus:ring-lime-600"
            on:click={() => {siteId = selectedRellist.material.id; materialUpdateModal = true}}>
            Update Material
          </button>
        </div>
        
      </div>
    {/if}

    <hr class="mb-6 border border-slate-700/80">

    {#if !selectedRellist.do.codsubmitdate}
      <p class="text-rose-400 text-sm me-2 mb-6">Pending COD Submit</p>
    {:else}
      <div class="grid grid-cols-2 items-center justify-center mb-6">
        <div class="flex flex-col items-center justify-center gap-2">
          <p class="rounded-full h-6 w-6 bg-lime-100 flex items-center justify-center ring-4 ring-lime-500">
            <Icon icon="iconoir:submit-document" />
          </p>
          <p class="text-xs text-slate-400">COD Submit Date</p>
          <p class="text-xs text-slate-400">
            {selectedRellist.do.codsubmitdate}
            </p>
        </div>

        <div class="flex flex-col items-center justify-center gap-2">
          <p class="rounded-full h-6 w-6  flex items-center justify-center ring-4 {selectedRellist.do.codapprovedate ? 'bg-lime-100 ring-lime-500' : 'bg-rose-100 ring-rose-500'} ">
            <Icon icon="material-symbols:order-approve-outline" />
          </p>
          <p class="text-xs text-slate-400">COD Approve Date</p>
          <p class="text-xs text-slate-400">
            {#if selectedRellist.do.codapprovedate}
            {selectedRellist.do.codapprovedate}
            {:else}
            Pending COD Approve
            {/if}
            </p>
        </div>
      </div>
    {/if}

  {/if}

  <!-- DO Detail content -->
  
  <div class="grid grid-cols-2 gap-4">
    <Button color="blue"
      on:click={() => {
        siteId = selectedRellist.do.id; 
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

<UpdateMaterialModal
  bind:materialUpdateModal={materialUpdateModal} {siteId} {search}
/>
