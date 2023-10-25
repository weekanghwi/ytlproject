<script lang="ts">
	import '../app.postcss';
	import { Button, DarkMode } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Tooltip } from 'flowbite-svelte'
	import Icon from '@iconify/svelte';
	import { isLoggedIn, userId, Isstaff } from '../store/store'
	import { goto } from '$app/navigation';


	let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl p-2';

	async function logout_() {
		try {
			const response = await fetch('http://10.24.8.120:8000/api/logout/', {
				method: 'POST',
				headers: {
					'Authorization': `Token ${localStorage.getItem('token')}`
				}
			});

			if (response.ok) {
				localStorage.removeItem('token');
				localStorage.removeItem('userId');
				isLoggedIn.set(false);
				goto('/');
			} else {
				console.error('Error during logout');
			}
		} catch (error) {
			console.error('Network error during logout:', error)
		}
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
					{#if $isLoggedIn && $Isstaff}
					<NavLi href="/" class="font-semibold" active={false}>Home</NavLi>
					<NavLi href="/fddproject" class="font-semibold">FDD Project</NavLi>
					<NavLi href="/sitelist" class="font-semibold">YTL LTE Site List</NavLi>
					{:else}
					<NavLi href="/" class="font-semibold" active={false}>Home</NavLi>
					<NavLi href="/sitelist" class="font-semibold">YTL LTE Site List</NavLi>
					{/if}
					{#if $isLoggedIn}
						<div class="flex items-center justify-center gap-1 ms-16">
							<span class="text-slate-900 h-6 w-6 bg-lime-400 rounded-full text-center">{$userId?.slice(0, 2)}</span>
							<Tooltip>{$userId}</Tooltip>
							{#if $Isstaff}
							<span class="text-slate-400"><Icon icon="eos-icons:admin-outlined" class="text-2xl text-lime-400"/></span>
							<Tooltip>Staff</Tooltip>
							{:else}
							<span class="text-slate-400"><Icon icon="carbon:user-admin" class="text-2xl text-indigo-400"/></span>
							<Tooltip>Normal</Tooltip>
							{/if}
							<Button class="ms-4" size="xs" color="red" on:click={logout_}>Logout</Button>
						</div>
					{:else}
						<div class="flex items-center gap-2 ms-16">
							<NavLi href="/auth/register" class="font-semibold">
								<Icon icon="eos-icons:system-re-registered" class="text-2xl"/>
							</NavLi>
							<Tooltip>Register</Tooltip>
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

