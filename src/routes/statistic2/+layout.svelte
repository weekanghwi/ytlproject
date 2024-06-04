<script lang="ts">
  import { onMount } from 'svelte';
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownItem, SidebarDropdownWrapper } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';

  let lsmstatisticData: any = null;

  onMount(async () => {
    const lsmstatistic = await fetch('http://10.24.8.120:8000/api/lsmstatistic/');
    if (lsmstatistic.ok) {
      lsmstatisticData = await lsmstatistic.json();
    } else {
      return {
        status: lsmstatistic.status,
        error: new Error('Failed to load')
      }
    }
  })


</script>

<div class="flex h-screen pe-4 gap-1">
  <div class="fixed top-[80px] bottom-0 w-[257px] bg-gray-800/40 m-2 rounded-md overflow-y-auto overflow-x-hidden">
    <a href="/statistic2">
      <div class="flex items-center justify-center pt-4 gap-2 mb-6">
        <div class="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center">
          <Icon icon="wpf:statistics" class="text-md font-semibold text-slate-900 text-center"/>
        </div>
        <p class="text-slate-50 text-xl font-semibold">STATISTIC KPI</p>
      </div>
    </a>

    <Sidebar class="w-[256px]">
      <SidebarWrapper divClass="overflow-y-auto py-4 px-3">
        <SidebarGroup>
          <SidebarItem label="Cell Availability" href="/statistic2/availability" aClass="flex items-center p-1 text-sm text-slate-400 rounded-lg hover:bg-gray-700">
            <svelte:fragment slot="icon">
              <Icon icon="pajamas:status" class="text-md text-slate-400"/>
            </svelte:fragment>
          </SidebarItem>

          <SidebarDropdownWrapper label="Setup"
            btnClass="flex items-center p-1 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-700 ">
            <svelte:fragment slot="icon">
              <Icon icon="uil:setting" class="text-md font-bold text-slate-400"/>
            </svelte:fragment>
            <svelte:fragment slot="arrowup">
              <Icon icon="mingcute:up-line" />
            </svelte:fragment>
            <svelte:fragment slot="arrowdown">
              <Icon icon="mingcute:down-line" />
            </svelte:fragment>
            <SidebarDropdownItem label="Attach Setup" href="/statistic2/attachsetup" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900"/>
            <SidebarDropdownItem label="RRC Setup" href="/statistic2/rrcsetup" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900"/>
            <SidebarDropdownItem label="eRAB Setup" href="/statistic2/erabsetup" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900"/>
            <SidebarDropdownItem label="VoLTE Setup" href="/statistic2/voltesetup" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900"/>
          </SidebarDropdownWrapper>

          <SidebarDropdownWrapper label="Drop" 
            btnClass="flex items-center p-1 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-700 ">
            <svelte:fragment slot="icon">
              <Icon icon="material-symbols:signal-disconnected" class="text-md font-bold text-slate-400"/>
            </svelte:fragment>
            <svelte:fragment slot="arrowup">
              <Icon icon="mingcute:up-line" />
            </svelte:fragment>
            <svelte:fragment slot="arrowdown">
              <Icon icon="mingcute:down-line" />
            </svelte:fragment>
            <SidebarDropdownItem label="Call Drop (Data)" href="/statistic2/calldroptngbr" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
            <SidebarDropdownItem label="Call Drop (VoLTE)" href="/statistic2/calldropgbr" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
          </SidebarDropdownWrapper>

          <SidebarDropdownWrapper label="HOSR"
            btnClass="flex items-center p-1 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-700 ">
            <svelte:fragment slot="icon">
              <Icon icon="vaadin:connect-o" class="text-md font-bold text-slate-400"/>
            </svelte:fragment>
            <svelte:fragment slot="arrowup">
              <Icon icon="mingcute:up-line" />
            </svelte:fragment>
            <svelte:fragment slot="arrowdown">
              <Icon icon="mingcute:down-line" />
            </svelte:fragment>
            <SidebarDropdownItem label="Intra Frequency" href="/statistic2/intraho" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
            <SidebarDropdownItem label="Inter Frequency" href="/statistic2/interho" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
            <SidebarDropdownItem label="X2 Out" href="/statistic2/x2hoout" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
            <SidebarDropdownItem label="X2 In" href="/statistic2/x2hoin" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
            <SidebarDropdownItem label="S1 Out" href="/statistic2/s1hoout" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
            <SidebarDropdownItem label="S1 In" href="/statistic2/s1hoin" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
          </SidebarDropdownWrapper>

          <SidebarDropdownWrapper label="BLER"
            btnClass="flex items-center p-1 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-700 ">
            <svelte:fragment slot="icon">
              <Icon icon="material-symbols-light:error-med-outline" class="text-md font-bold text-slate-400"/>
            </svelte:fragment>
            <svelte:fragment slot="arrowup">
              <Icon icon="mingcute:up-line" />
            </svelte:fragment>
            <svelte:fragment slot="arrowdown">
              <Icon icon="mingcute:down-line" />
            </svelte:fragment>
            <SidebarDropdownItem label="DL BLER" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
            <SidebarDropdownItem label="UL BLER" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
          </SidebarDropdownWrapper>

          <SidebarDropdownWrapper label="FILTER SAME PCI SITE"
            btnClass="flex items-center p-1 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-700 ">
            <svelte:fragment slot="icon">
              <Icon icon="lets-icons:filter-big-alt" class="text-md font-bold text-slate-400"/>
            </svelte:fragment>
            <svelte:fragment slot="arrowup">
              <Icon icon="mingcute:up-line" />
            </svelte:fragment>
            <svelte:fragment slot="arrowdown">
              <Icon icon="mingcute:down-line" />
            </svelte:fragment>
            <SidebarDropdownItem label="SAME PCI" href="/statistic2/filtersamepci" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
            <SidebarDropdownItem label="UL BLER" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
          </SidebarDropdownWrapper>

        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>

    <!-- <div class="flex flex-col rounded-xl bg-slate-700/20 m-2 py-4 px-2 mt-auto">
      <div class="flex items-center gap-2 mb-4">
        <div class="h-8 w-8 rounded-full bg-slate-950 flex items-center justify-center">
          <Icon icon="icon-park-outline:whole-site-accelerator" class="text-lg text-slate-100" />
        </div>
        <p class="text-sm text-slate-300 font-semibold">Site Count</p>
      </div>
      {#if lsmstatisticData}
      <div class="flex gap-2 items-center justify-around mb-4">
        <div class="flex items-center gap-2 rounded-lg border border-lime-400 p-2">
          <Icon icon="clarity:bundle-line" class="text-4xl text-slate-400"/>
          <div class="flex flex-col">
            <p class="text-xs text-slate-400">Site</p>
            <h1 class="text-lg text-slate-500 font-semibold">{lsmstatisticData.unique_site_count}</h1>
          </div>
        </div>
        <div class="flex items-center gap-2 rounded-lg border border-indigo-700 p-2">
          <Icon icon="uil:cell" class="text-4xl text-slate-400"/>
          <div class="flex flex-col">
            <p class="text-xs text-slate-400">Cell</p>
            <h1 class="text-lg text-slate-500 font-semibold">{lsmstatisticData.cell_count}</h1>
          </div>
        </div>
      </div>

      <div class="flex gap-8 justify-center">
        <div class="flex flex-col gap-1">
          <p class="text-sm text-slate-400 font-semibold">REGIONS</p>
          {#each lsmstatisticData.sitecount_byregion.region as regions}
          <p class="text-sm text-slate-400">{regions}</p>
          {/each}
        </div>
        <div class="flex flex-col gap-1 items-center">
          <p class="text-sm text-slate-400 font-semibold">SITES</p>
          {#each lsmstatisticData.sitecount_byregion.count as counts}
          <p class="text-xs text-slate-950 font-semibold px-1 py-[2px] bg-lime-400 rounded-md w-full text-center">{counts}</p>
          {/each}
        </div>
        <div class="flex flex-col gap-1 items-end">
          <p class="text-sm text-slate-400 font-semibold">CELLS</p>
          {#each lsmstatisticData.cellcount_byregion.count as counts}
          <p class="text-xs text-slate-950 font-semibold px-1 py-[2px] bg-indigo-700 rounded-md w-full text-center">{counts}</p>
          {/each}
        </div>

      </div>
      {:else}
        <p class="text-sm text-indigo-400">Loading Data ...</p>
      {/if}
    </div> -->
  </div>

  <div class="flex-1 ml-[257px]">
    <slot />
  </div>
</div>

