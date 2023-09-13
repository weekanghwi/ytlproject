<script lang="ts">
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte'
  import Icon from '@iconify/svelte';

  let spanClass = 'flex-1 ml-3 whitespace-nowrap';
  let selectedMenu = '';
  function selectMenuHandler(menuLabel: string) {
    selectedMenu = menuLabel;
  }
</script>

<div class="flex gap-2 h-full">
  <!-- sitebar -->
  <div class="flex min-h-[calc(100vh-72.8px)] border-r border-gray-500/50">
    <Sidebar>
      <SidebarWrapper>
        <SidebarGroup>
          <SidebarItem label="Map" href="/fddproject/map" active={selectedMenu === 'Map'} on:click={() => selectMenuHandler('Map')}>
            <svelte:fragment slot="icon">
              <Icon icon="vscode-icons:file-type-map" class="text-xl" />
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Dashboard" href="/fddproject/dashboard" active={selectedMenu === 'Dashboard'} on:click={() => selectMenuHandler('Dashboard')}>
            <svelte:fragment slot="icon">
              <Icon icon="heroicons-outline:chart-pie" class="text-xl" />
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Site List" {spanClass} href="/fddproject/sitelist" active={selectedMenu === 'Site List'} on:click={() => selectMenuHandler('Site List')}>
            <svelte:fragment slot="icon">
              <Icon icon="line-md:list-3" class="text-xl"/>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Delivery" {spanClass} href="/fddproject/delivery" active={selectedMenu === 'Delivery'} on:click={() => selectMenuHandler('Delivery')}>
            <svelte:fragment slot="icon">
              <Icon icon="carbon:delivery-add" class="text-xl"/>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Installation" {spanClass} href="/fddproject/install" active={selectedMenu === 'Installation'} on:click={() => selectMenuHandler('Installation')}>
            <svelte:fragment slot="icon">
              <Icon icon="ion:construct-outline" class="text-xl"/>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="SSV Information" {spanClass} href="/fddproject/ssv" active={selectedMenu === 'SSV Information'} on:click={() => selectMenuHandler('SSV Information')}>
            <svelte:fragment slot="icon">
              <Icon icon="ri:taxi-wifi-line" class="text-xl"/>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Optimization" {spanClass} href="/fddproject/optimization" active={selectedMenu === 'Optimization'} on:click={() => selectMenuHandler('Optimization')}>
            <svelte:fragment slot="icon">
              <Icon icon="clarity:data-cluster-line" class="text-xl"/>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Certification" {spanClass} href="/fddproject/certification" active={selectedMenu === 'Certification'} on:click={() => selectMenuHandler('Certification')}>
            <svelte:fragment slot="icon">
              <Icon icon="tabler:certificate" class="text-xl"/>
            </svelte:fragment>
          </SidebarItem>

          <SidebarItem label="Report" {spanClass} href="/fddproject/report" active={selectedMenu === 'Report'} on:click={() => selectMenuHandler('Report')}>
            <svelte:fragment slot="icon">
              <Icon icon="carbon:report" class="text-xl"/>
            </svelte:fragment>
          </SidebarItem>

        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </div>
  <slot />
</div>