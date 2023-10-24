<script lang="ts">
	import '../app.postcss';
	import { Button, DarkMode } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { isLoggedIn, userId, Isstaff } from '../store/store'


	let spanClass = 'flex-1 ml-3 whitespace-nowrap';
	let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl p-2';

	function logout() {
    localStorage.removeItem('token');
		localStorage.removeItem('userId');
		isLoggedIn.set(false);
    console.log('Logged out');
  }

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
		<div class="flex items-center">
			<NavUl {hidden}>
				<div class="flex items-center gap-6">
					{#if $isLoggedIn && $Isstaff === true}
					<NavLi href="/" class="font-semibold" active={false}>Home</NavLi>
					<NavLi href="/fddproject" class="font-semibold">FDD Project</NavLi>
					<NavLi href="/sitelist" class="font-semibold">YTL LTE Site List</NavLi>
					{:else}
					<NavLi href="/" class="font-semibold" active={false}>Home</NavLi>
					<NavLi href="/sitelist" class="font-semibold">YTL LTE Site List</NavLi>
					{/if}
					{#if $isLoggedIn}
						<div class="flex items-center gap-2 ms-16">
							<span class="text-slate-400">{$userId} {$Isstaff}</span>
							<Button class="py-0.5 px-2" size="xs" color="red" on:click={logout}>Logout</Button>
						</div>
					{:else}
						<div class="flex items-center gap-2 ms-16">
							<NavLi href="/auth/register" class="font-semibold">Register</NavLi>
							<NavLi href="/auth/login" class="font-semibold">Login</NavLi>
						</div>
					{/if}

				</div>
			</NavUl>
			<DarkMode {btnClass} />
		</div>
  </Navbar>
	
	<slot />
</div>

