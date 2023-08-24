<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { deleteSiteData } from "./crud";
	import { Button, Modal } from "flowbite-svelte";

  const dispatch = createEventDispatcher();
  export let siteDeleteModal = false;
  export let siteId: string;

  async function handleDelete() {
    try {
      await deleteSiteData(siteId);
      siteDeleteModal = false;
      dispatch('siteDeleted');
    } catch (error) {
      console.log('Failed to delete site data: ', error);
    }
  }
</script>

<Modal bind:open={siteDeleteModal} size="md" autoclose={false} class="w-full">
  <h2 class="text-2xl font-bold text-rose-500">Delete Site</h2>
  <p class="text-rose-500">Are you sure you want to delete this site?</p>
  <div class="flex gap-4">
    <Button color="red" type="submit" class="w-fit py-1.5 px-3" on:click={handleDelete}>Delete</Button>
    <Button color='blue' on:click={() => {siteDeleteModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
  </div>
</Modal>