<script>
	import '../app.postcss';
	import { DarkMode } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder, Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownItem, SidebarDropdownWrapper } from 'flowbite-svelte'
	import Icon from '@iconify/svelte';


	let spanClass = 'flex-1 ml-3 whitespace-nowrap';
	let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl p-2';

</script>

<div class="flex flex-col">
  <Navbar
    navClass="px-2 sm:px-4 py-2.5 w-full z-20 border-b"
    let:hidden
    let:toggle
  >
    <NavBrand href="/">
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">YTL Project</span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
		<div class="flex">
			<NavUl {hidden}>
				<NavLi href="/" class="font-semibold" active={false}>Home</NavLi>
				<NavLi href="/tddproject" class="font-semibold">TDD Project</NavLi>
				<NavLi href="/fddproject" class="font-semibold">FDD Project</NavLi>
				<NavLi href="/swapproject" class="font-semibold">Swap Project</NavLi>
				<NavLi href="/sitelist" class="font-semibold">Site List</NavLi>
			</NavUl>
			<DarkMode {btnClass} />
		</div>
  </Navbar>
	
	<slot />
</div>

