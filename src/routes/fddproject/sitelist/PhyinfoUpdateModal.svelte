<script lang="ts">
  import { Button, Fileupload, Modal } from "flowbite-svelte";

  export let phyinfoUpdateModal = false;

  let file: File | null = null;

  function handleFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    file = target.files ? target.files[0] : null;
  }

  async function handlePhyinfoUpload(): Promise<void> {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://10.24.8.120:8000/api/sitephyinfo_update/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.success);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  }

</script>

<Modal bind:open={phyinfoUpdateModal} size="sm">
  <form class="flex flex-col space-y-6" on:submit|preventDefault={handlePhyinfoUpload}>
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">Site Physical Information Update</h3>
    <Fileupload bind:file on:change={handleFileChange} />
    
    <Button type="submit" class="w-full">Update Physical Information</Button>
  </form>
</Modal>