<script lang="ts">
  import { goto } from '$app/navigation';
  import { isLoggedIn, userId, Isstaff } from '../../../store/store'

  let username: string = '';
  let password: string = '';

  async function login() {
    const res = await fetch('http://10.24.8.120:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.username);
      localStorage.setItem('isstaff', data.is_staff)
      isLoggedIn.set(true);
      userId.set(data.username);
      Isstaff.set(data.is_staff);
      goto('/sitelist')
      console.log('Logged in successfully');
    } else {
      console.log('Login failed');
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
  }
</script>


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
        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" on:click={login}>Login</button>
      </div>
    </form>

  </div>
</div>