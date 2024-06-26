import { writable } from "svelte/store";

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export const user = writable<User | null>(null);

export async function fetchUserInfo() {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    console.error('Token is not found')
    return;
  }

  const response = await fetch('http://10.24.8.120:8000/api/userinfo/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
  });

  if (response.ok) {
    const userData: User = await response.json();
    user.set(userData)
  } else {
    console.error('Failed to fetch user info');
  }
}