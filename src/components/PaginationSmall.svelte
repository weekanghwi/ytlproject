<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';

  export let totalPages: number;
  export let activePage: number;

  const dispatch = createEventDispatcher();

  function changePage(pageNum: number): void {
    // Ensure new page is within the valid range and not the current page
    if (pageNum !== activePage && pageNum >= 1 && pageNum <= totalPages) {
      dispatch('change', pageNum);
    }
  }

  $: pages = Array.from({length: Math.min(5, totalPages)}, (_, index) => ({
    name: Math.max(1, Math.min(totalPages - 4, activePage - 2)) + index,
    active: activePage === (Math.max(1, Math.min(totalPages - 4, activePage - 2)) + index)
  }));

  // $: pages = Array.from({length: Math.min(5, totalPages)}, (_, index) => {
  //   const startPage = Math.max(1, Math.min(totalPages - 4, activePage - 1));
  //   return {
  //     name: startPage + index,
  //     active: activePage === (startPage + index)
  //   };
  // });

  $: showStartEllipsis = activePage > 3 && totalPages > 5;
  $: showEndEllipsis = activePage < totalPages - 2 && totalPages > 5;
</script>

<style>
  .pagination-btn {
    @apply text-xs text-white py-[4px] px-3 w-full;
  }
  .active {
    @apply bg-blue-600 font-semibold rounded-sm;
  }
  .inactive {
    @apply text-slate-500;
  }
  .disabled {
    @apply text-slate-300;
  }
</style>

<div class="flex mt-4">
  <button
    class="pagination-btn disabled rounded-s-md"
    on:click={() => changePage(activePage - 1)}
    disabled={activePage === 1}
  >
    <Icon icon="ant-design:left-outlined" />
  </button>

  {#if totalPages > 0}
    <button
      class="pagination-btn hover:text-blue-600"
      class:active={activePage === 1}
      on:click={() => changePage(1)}
    >
      1
    </button>
  {/if}

  {#if showStartEllipsis}
    <span class="text-xs text-white">...</span>
  {/if}

  {#each pages as page}
    {#if page.name !== 1 && page.name !== totalPages}
      <button
        class="pagination-btn hover:text-blue-500"
        class:active={page.active}
        on:click={() => changePage(page.name)}
      >
        {page.name}
      </button>
    {/if}
  {/each}

  {#if showEndEllipsis}
    <span class="text-xs text-white">...</span>
  {/if}

  {#if totalPages > 1}
    <button
      class="pagination-btn hover:text-slate-600"
      class:active={activePage === totalPages}
      on:click={() => changePage(totalPages)}
    >
      {totalPages}
    </button>
  {/if}

  <button
    class="pagination-btn disabled rounded-e-md"
    on:click={() => changePage(activePage + 1)}
    disabled={activePage === totalPages || totalPages === 0}
  >
  <Icon icon="ant-design:right-outlined" />
  </button>
</div>
