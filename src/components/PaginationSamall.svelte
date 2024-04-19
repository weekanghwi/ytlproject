<script lang="ts">
  import { goto } from '$app/navigation';
  import { Pagination } from 'flowbite-svelte';

  export let totalPages = 0;
  export let activePage = 0;
  export let limit = 5;
  export let paginationurl = '';
  export let filterParams = {};


  type PageType = {
    name: string;
    href: string | null| undefined;
    active: boolean;
  }
  let pages: PageType[] = [];

  $: startPage = Math.max(0, activePage - 2);
  $: endPage = Math.min(totalPages - 1, activePage + 2);
  $: helper = {start: (activePage + 1) * 5, end: ((activePage + 1) * 5) + 5, total: totalPages}

  $: {
    pages = (activePage > 0 ? [{
      name: '1',
      href: createURL(0),
      active: false
    }, {
      name: '...',
      href: null,
      active: false
    }] : []).concat(Array.from({length: endPage - startPage + 1}, (_, i) => {
      let pageNum = startPage + i;
      return {
        name: (pageNum + 1).toString(),
        href: createURL(pageNum),
        active: pageNum === activePage,
      };
    }), activePage < totalPages - 1 ? [{
      name: '...',
      href: null,
      active: false
    }, {
      name: totalPages.toString(),
      href: createURL(totalPages - 1),
      active: false
    }] : []);
  }

  async function previous() {
    if (activePage > 0) {
      goto(createURL(activePage - 1));
    }
  }

  async function next() {
    if (activePage < totalPages - 1) {
      goto(createURL(activePage + 1));
    }
  }

  function createURL(pageNum: number){
    let params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', (pageNum * limit).toString());

    for (let key in filterParams) {
      if(filterParams[key]) params.set(key, filterParams[key]);
    }
    return `/${paginationurl}/?${params.toString()}`;
  }
</script>

<!-- Pagination -->
<div class="mt-3 flex items-center justify-between">
  <Pagination
    activeClass="text-xs text-blue-200 border border-gray-700/50 bg-blue-500 hover:text-blue-700"
    normalClass="text-xs text-gray-500 border border-gray-900/100 bg-gray-800/50 hover:text-blue-400 "
    {pages} on:previous={previous} on:next={next} />
</div>
