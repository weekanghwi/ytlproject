<script lang="ts">
  import { Drawer, Button, CloseButton } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
  import { sineIn } from 'svelte/easing'
  import UpdatecertModal from '../crud/UpdatecertModal.svelte';

  export let selectedRellist:any = {};
  export let certidetaildrawer = true;
  export let search: () => Promise<void>;
  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  }

  let siteId = '';
  let certificationUpdateModal = false;

  async function refreshData() {
    if (search) {
      await search();
    }
  }
</script>

<Drawer width="w-96" placement="right" transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={certidetaildrawer} id="dodetaildrawer">
  <div class="flex items-center">
    <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-slate-500 dark:text-slate-400">
      <Icon icon="tabler:certificate" class="text-2xl me-2"/>Certification Detail Information
    </h5>
    <CloseButton on:click={() => (certidetaildrawer = true)} class="mb-4 dark:text-white" />
  </div>

  <!-- Certification form data -->
  <div class="flex flex-col items-center justify-center mb-4">
    <h3 class="text-slate-400">{selectedRellist.certification.sitebasicinfo}</h3>
    <p class="text-slate-400 text-xs">{selectedRellist.sitebasicinfo.sitename}</p>
    <div class="flex gap-2 items-center justify-center mb-4 mt-2">
      <p class="rounded-md border border-lime-400 text-lime-400 text-xs py-0.5 px-1">{selectedRellist.sitebasicinfo.region}</p>
      <p class="rounded-md border  text-xs py-0.5 px-1 {selectedRellist.sitebasicinfo.contracttype === 'Confirm' || selectedRellist.sitebasicinfo.contracttype === 'Reuse_Replace' ? 'text-lime-400 border-lime-400' : 'text-rose-400 border-rose-400'}">{selectedRellist.sitebasicinfo.contracttype}</p>
  </div>

  <div class="grid grid-cols-2 mb-4">
    {#if selectedRellist.sitebasicinfo.contracttype != 'Confirm' && selectedRellist.sitebasicinfo.contracttype != 'Reuse_Replace'}
      <div class="flex col-span-2 items-center justify-center">
        <Icon icon="ph:warning-bold" class="text-rose-400 me-2"/><p class="text-rose-400">This site is not target of PAC/FAC</p>
      </div>
    {:else if !selectedRellist.install.oaairdate}
      <div class="flex col-span-2 items-center justify-center">
        <Icon icon="ph:warning-bold" class="text-rose-400 me-2"/><p class="text-rose-400">Not Onair</p>
      </div>
    {:else if !selectedRellist.optimization.optstartdate}
      <div class="flex col-span-2 items-center justify-center">
        <Icon icon="ph:warning-bold" class="text-rose-400 me-2"/><p class="text-rose-400">Not Start optimization activity</p>
      </div>
    {:else if selectedRellist.optimization.optstartdate && !selectedRellist.optimization.optsubmitdate}
      <div class="flex col-span-2 items-center justify-center">
        <Icon icon="ph:warning-bold" class="text-rose-400 me-2"/><p class="text-rose-400">Not Complete optimization activity</p>
      </div>
    {:else if !selectedRellist.certification.pacsubmitdate}
      <div class="flex col-span-2 items-center justify-center">
        <Icon icon="ph:warning-bold" class="text-rose-400 me-2"/><p class="text-rose-400">Pending PAC/FAC Submit to YTLC</p>
      </div>
    {:else}
      <div class="flex flex-col">
        <p class="text-slate-400">PAC Submit date: </p>
        <p class="text-slate-400">PAC Submit date: </p>
      </div>
      <div class="flex flex-col items-end">
        <p class="text-slate-400">{selectedRellist.certification.pacsubmitdate}</p>
        <p class="text-slate-400">{selectedRellist.certification.facsubmitdate}</p>
      </div>
      {#if selectedRellist.certification.pacapprovestatus === 'Dato Approved'}
        <div class="flex flex-col mt-4">
          <p class="text-slate-400">PAC Approve Status: </p>
          <p class="text-slate-400">PAC Approve Status: </p>
        </div>
        <div class="flex flex-col mt-4 items-end">
          <p class="text-lime-400">{selectedRellist.certification.pacapprovestatus}</p>
          <p class="text-lime-400">{selectedRellist.certification.facapprovestatus}</p>
        </div>
      {:else}
        <div class="flex flex-col mt-4 items-center justify-center col-span-2">
          <p class="text-rose-400">Pending PAC/FAC Approved</p>
          <p class="text-rose-400">{selectedRellist.certification.pacapprovestatus}</p>
        </div>
      {/if}
    {/if}
  </div>

  <div class="grid grid-cols-2 gap-4">
    <Button color="blue"
      on:click={() => {siteId = selectedRellist.certification.id; certificationUpdateModal = true }}>
      Update Certi
    </Button>
    <Button on:click={() => (certidetaildrawer = true)} class="px-4"><Icon icon="ph:x" class="me-1" /> Close</Button>
  </div>

</Drawer>

<!-- Modal -->
<UpdatecertModal 
  bind:certificationUpdateModal={certificationUpdateModal} {siteId} {search}
/>