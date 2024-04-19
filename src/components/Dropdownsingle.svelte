<script lang="ts">
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';

  export let items: { value: string; label: string; }[] = [];
  export let buttonText: string = 'Select';

  let isOpen: boolean = false;
  let selectedValue: string = '';
  let dropdownElement: HTMLElement;

  function toggleDropdown(): void {
    isOpen = !isOpen;
  }

  function selectItem(itemValue: string): void {
    selectedValue = itemValue;
    isOpen = false
  }

  function handleClickOutside(event: MouseEvent): void {
    if (!dropdownElement.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  // onMount(() => {
  //   window.addEventListener('click', handleClickOutside);
  // });

  // onDestroy(() => {
  //   window.removeEventListener('click', handleClickOutside);
  // });
</script>

<div class="relative w-fit" bind:this={dropdownElement}>
  <button class="px-5 py-1 rounded-md bg-slate-700/50 text-sm text-slate-400 font-semibold" on:click={toggleDropdown}>
    {buttonText}
  </button>
  
  {#if isOpen}
    <div class="dropdownsingle absolute top-9 left-0 flex flex-col items-center justify-center rounded-md bg-slate-950 w-full">
      {#each items as item}
        <button class="text-xs text-slate-400 py-[4px;] items-center justify-center rounded-sm hover:bg-slate-700 w-full" 
          on:click={() => selectItem(item.value)}>
          {item.label}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropdownsingle {
    z-index: 1000;
  }
</style>