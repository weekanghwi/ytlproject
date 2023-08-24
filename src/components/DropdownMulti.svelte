<script lang="ts">
  import { Checkbox } from "flowbite-svelte";
  import Icon from '@iconify/svelte';

  interface Option {
    value: string;
    label: string;
  }

  export let options: string[] = [];
  export let selectedOptions: string[] = [];
  export let placeholder = 'Select Options';
  export let onOptionChange: () => void;

  let showDropdownmenu = false;

  function toggleOption(option: string) {
    if (selectedOptions.includes(option)) {
      selectedOptions = selectedOptions.filter((item) => item !== option);
    } else {
      selectedOptions = [...selectedOptions, option];
    }

    if (onOptionChange) {
      onOptionChange();
    }
  }

  function toggleMenu() {
    showDropdownmenu = !showDropdownmenu;
  }

  function handleClick(event: MouseEvent) {
    if (!event.target.closest('.dropdown')) {
      showDropdownmenu = false;
    }
  }
</script>

<svelte:window on:click={handleClick} />
<div class="dropdown relative flex ">
  <button 
    class="min-w-full whitespace-nowrap dropdown-toggle flex items-center focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-gray-400 rounded-md border border-gray-600 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-3 text-sm {selectedOptions.length > 0 ? 'ring-2 ring-orange-500 dark:text-orange-500' : ''}" 
    aria-haspopup="true" 
    on:click={toggleMenu}
  >
  <Icon icon="mi:filter" class="me-2 " />{placeholder}
  </button>
  {#if showDropdownmenu}
  <div class="dropdown-menu bg-gray-500 rounded-md text-sm py-2 px-3 inline-block flex-col items-start mt-2 absolute z-50 top-9 left-0 max-w-[300px]" role="menu">
    {#each options as option}
    <li class="flex items-center">
      <Checkbox checked={selectedOptions.includes(option)} on:change={() => toggleOption(option)}>
        <span class="text-gray-300 text-sm py-[1px] whitespace-nowrap">{option}</span>
      </Checkbox>
      
    </li>
    {/each}
  </div>
  {/if}
</div>