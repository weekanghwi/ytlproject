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
      <Icon icon="clarity:data-cluster-line" class="text-2xl me-2"/>Optimization Detail Information
    </h5>
    <CloseButton on:click={() => (certidetaildrawer = true)} class="mb-4 dark:text-white" />
  </div>

  <div class="grid grid-cols-2 gap-4">
    <Button color="blue"
      on:click={() => {siteId = selectedRellist.optimization.id; certificationUpdateModal = true }}>
      Update OPT
    </Button>
    <Button on:click={() => (certidetaildrawer = true)} class="px-4"><Icon icon="ph:x" class="me-1" /> Close</Button>
  </div>

</Drawer>

<!-- Modal -->
<UpdatecertModal 
  bind:certificationUpdateModal={certificationUpdateModal} {siteId} {search}
/>