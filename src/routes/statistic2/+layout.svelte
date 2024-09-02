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

          <!-- HeatMap -->
          <SidebarDropdownWrapper label="HeatMap"
            btnClass="flex items-center p-1 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-700 ">
            <svelte:fragment slot="icon">
              <Icon icon="mdi:map-search" class="text-md font-bold text-slate-400"/>
            </svelte:fragment>
            <svelte:fragment slot="arrowup">
              <Icon icon="mingcute:up-line" />
            </svelte:fragment>
            <svelte:fragment slot="arrowdown">
              <Icon icon="mingcute:down-line" />
            </svelte:fragment>
            <SidebarDropdownItem label="PRB DL HeatMap" href="/statistic2/heatmapdlprb" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
            <SidebarDropdownItem label="Call Drop(nGBR)" aClass="flex items-center p-1 pl-7 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-100 hover:text-slate-900" />
          </SidebarDropdownWrapper>

        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </div>

  <div class="flex-1 ml-[257px]">
    <slot />
  </div>
</div>

