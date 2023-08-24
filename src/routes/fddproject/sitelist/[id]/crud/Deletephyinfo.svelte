<script lang="ts">
	import { Button, Modal } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import { deletephySiteData } from './crudphy'

  const dispatch = createEventDispatcher();
  export let physiteinfoDeleteModal = false;
  export let _cellidentity: string;



  async function handleDelete() {
    try {
      await deletephySiteData(_cellidentity);
      physiteinfoDeleteModal = false;
      dispatch('sitephyinfoDeleted');
    } catch (error) {
      console.log('Failed to delete site data: ', error);
    }
  }

</script>

<Modal bind:open={physiteinfoDeleteModal} size="md" autoclose={false} class="w-full">
  <h2 class="text-2xl font-bold text-rose-500">Delete Site</h2>
  <p class="text-rose-500">Are you sure you want to delete this site physical infomation ?</p>
  <div class="flex gap-4">
    <Button color="red" type="submit" class="w-fit py-1.5 px-3" on:click={handleDelete}>Delete</Button>
    <Button color='blue' on:click={() => {physiteinfoDeleteModal = false}} class="w-fit py-1.5 px-3">Cancel</Button>
  </div>
</Modal>
