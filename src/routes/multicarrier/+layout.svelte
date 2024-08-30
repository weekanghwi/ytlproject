<script lang="ts">
  import { onMount } from 'svelte';
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownItem, SidebarDropdownWrapper } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';
</script>

<div class="flex h-screen pe-4 gap-1">
  <div class="fixed top-[80px] bottom-0 w-[257px] bg-gray-800/40 m-2 rounded-md overflow-y-auto overflow-x-hidden">
    <a href="/multicarrier">
      <div class="flex items-center pt-4 ps-4 gap-1 mb-2">
        <div class="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center">
          <Icon icon="gala:layer" class="text-md font-semibold text-slate-900 text-center"/>
        </div>
        <p class="text-slate-200 text-md font-semibold">MULTI CARRIER PROJECT</p>
      </div>
    </a>

    <Sidebar class="w-[256px]">
      <SidebarWrapper divClass="overflow-y-auto py-4 px-3">
        <SidebarGroup>
          <SidebarItem label="Target Site List" href="/statistic2/availability" aClass="flex items-center p-1 text-sm text-slate-400 rounded-lg hover:bg-gray-700">
            <svelte:fragment slot="icon">
              <Icon icon="solar:bill-list-linear" class="text-md text-slate-400"/>
            </svelte:fragment>
          </SidebarItem>

          <SidebarDropdownWrapper label="Delivery"
            btnClass="flex items-center p-1 w-full text-sm text-slate-400 rounded-lg transition duration-75 group hover:bg-gray-700 ">
            <svelte:fragment slot="icon">
              <Icon icon="carbon:delivery-add" class="text-md font-bold text-slate-400"/>
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


          <SidebarDropdownWrapper label="Installation"
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

        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </div>

  <div class="flex-1 ml-[257px]">
    <slot />
  </div>
</div>