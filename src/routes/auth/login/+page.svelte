<script lang="ts">
  import { goto } from '$app/navigation';
  import { fetchUserInfo } from '../../../store/auth';
  import toast, { Toaster } from 'svelte-french-toast'

  let username: string = '';
  let password: string = '';
  
  async function login() {
    const response = await fetch('http://10.24.8.120:8000/api/login_/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('jwt_token', data.access);
      await fetchUserInfo();
      toast.success('Login success')
      setTimeout(() => {
        goto('/sitelist');
      }, 2000);
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.error || 'Login failed';
      toast.error(errorMessage);
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    await login();
  }

</script>

<Toaster />

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-slate-400">Sign in to your account</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" on:submit={handleSubmit}>
      <div>
        <label for="username" class="block text-sm font-medium leading-6 text-slate-300">User ID</label>
        <div class="mt-2">
          <input id="username" name="username" type="text" autocomplete="username" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" bind:value={username}>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium leading-6 text-slate-300">Password</label>
        </div>
        <div class="mt-2">
          <input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" bind:value={password}>
        </div>
      </div>

      <div>
        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>
      </div>
    </form>

  </div>
</div>