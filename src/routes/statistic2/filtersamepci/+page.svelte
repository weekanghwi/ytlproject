<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
	import { Dropdown, DropdownItem, Search, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import PaginationComponent from '../../../components/PaginationComponent.svelte';

  export let data;

  let paginationurl = 'statistic2/filtersamepci'
  let sitebasicinfo = '';
  let distance = '';
  let region = '';
  let earfcnul = '';

  let limit = Number($page.url.searchParams.get('limit')) || 5;
  $: totalPages = (Number(data?.SamePCIData?.totalPages) || 0);
  $: activePage = (Number($page.url.searchParams.get('offset')) || 0) / limit;

  async function search() {
    let params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', '0');
    params.set('sitebasicinfo', sitebasicinfo);
    params.set('distance', distance);
    params.set('region', region);
    params.set('earfcnul', earfcnul);
    goto(`/${paginationurl}/?${params.toString()}`);
  }

  function resetFilters() {
    sitebasicinfo = '';
    distance = '';
    region = '';
    earfcnul = '';
    search();
  }

  function checkForEnter(event) {
    if (event.keyCode === 13) {
      search();
    }
  }

  function selecteEARFCNUL(selectedBand: string) {
    earfcnul = selectedBand;
    earfcnuldropdownOpen = false;
    search();
  };

  let earfcnuldropdownOpen = false;

  function selectRegion(selectedRegion: string) {
    region = selectedRegion;
    regiondropdownOpen = false;
    search();
  };

  let regiondropdownOpen = false;

</script>

<div class="p-4">
  <!-- TITLE -->
  <h1 class="text-white mb-4">LIST OF PCI COLLISION SITES WITHIN 10km RADIUS</h1>

  <!-- SAME PCI LIST TABLE -->
  <div class="flex flex-col">

    <!-- FILTERS -->
    <div class="flex items-center gap-2 z-50 mb-2">
      <div class="w-2/8">
        <Search size="lg" class="flex items-center rounded-md py-1 bg-slate-900 border-none text-white" color="custom" placeholder="Search Site ID..." bind:value={sitebasicinfo} on:keypress="{checkForEnter}">
        </Search>
      </div>

      <div class="w-2/8">
        <Search size="lg" class="flex items-center rounded-md py-1 bg-slate-900 border-none text-white" color="custom" placeholder="Distance" bind:value={distance} on:keypress="{checkForEnter}">
        </Search>
      </div>

      <button class="rounded-md bg-slate-900 px-6 py-2 text-white text-xs">Center Frequency</button>
      <Dropdown headerClass="py-1 rounded-t-sm" footerClass="py-1 rounded-b-sm" bind:open={earfcnuldropdownOpen} class="z-50">
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-800" on:click={() => selecteEARFCNUL('24245')}>800MHz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-600" on:click={() => selecteEARFCNUL('38100')}>2.6GHz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('38700')}>2305Hz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('38750')}>2310Hz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('38800')}>2315Hz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('38850')}>2320Hz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('38900')}>2325Hz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('38950')}>2330Hz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('39000')}>2335Hz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('38050')}>2340Hz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('39100')}>2345Hz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('39150')}>2350Hz</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selecteEARFCNUL('39200')}>2355Hz</DropdownItem>
      </Dropdown>

      <button class="rounded-md bg-slate-900 px-6 py-2 text-white text-xs">Region</button>
      <Dropdown headerClass="py-1 rounded-t-sm" footerClass="py-1 rounded-b-sm" bind:open={regiondropdownOpen} class="z-50">
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-800" on:click={() => selectRegion('Central')}>Central</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-600" on:click={() => selectRegion('Northern')}>Northern</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selectRegion('Southern')}>Southern</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selectRegion('Eastern')}>Eastern</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selectRegion('Sabah')}>Sabah</DropdownItem>
        <DropdownItem defaultClass="text-xs py-1 px-4 hover:bg-sky-400" on:click={() => selectRegion('Sarawak')}>Sarawak</DropdownItem>
      </Dropdown>
    </div>

    <!-- TABLE -->
    <Table shadow={true} hoverable={true}>
      <TableHead>
        <TableHeadCell padding="px-6 py-2">SITE</TableHeadCell>
        <TableHeadCell padding="px-6 py-2">EARFCN</TableHeadCell>
        <TableHeadCell padding="px-6 py-2">REGION</TableHeadCell>
        <TableHeadCell padding="px-6 py-2">PCI</TableHeadCell>
        <TableHeadCell padding="px-6 py-2">NBR SITE</TableHeadCell>
        <TableHeadCell padding="px-6 py-2">DISTANCE</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.SamePCIData.SamePCI.results as item}
        <TableBodyRow>
          <TableBodyCell tdClass="px-6 py-3 whitespace-nowrap text-xs">{item.site.sitebasicinfo}</TableBodyCell>
          <TableBodyCell tdClass="px-6 py-3 whitespace-nowrap text-xs">{item.site.earfcnul}</TableBodyCell>
          <TableBodyCell tdClass="px-6 py-3 whitespace-nowrap text-xs">{item.site.region}</TableBodyCell>
          <TableBodyCell tdClass="px-6 py-3 whitespace-nowrap text-xs">{item.site.pci}</TableBodyCell>
          <TableBodyCell tdClass="px-6 py-3 whitespace-nowrap text-xs">{item.nearby_sites[0].site.sitebasicinfo}</TableBodyCell>
          <TableBodyCell tdClass="px-6 py-3 whitespace-nowrap text-xs">{(item.nearby_sites[0].distance).toFixed(2)}</TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
    
  </div>
  <PaginationComponent bind:totalPages={totalPages} bind:activePage={activePage} bind:limit={limit} bind:paginationurl={paginationurl} filterParams={{sitebasicinfo, distance, region, earfcnul}} />
</div>