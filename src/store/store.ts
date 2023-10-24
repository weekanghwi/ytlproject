import { writable } from 'svelte/store';

export const isLoggedIn = writable<boolean>(false);
export const userId = writable<string | null>(null);
export const Isstaff = writable<string | null>(null);

// initial value only for client
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('token');
  const storedUserId = localStorage.getItem('userId');
  const storeIsstaff = localStorage.getItem('is_staff');
  
  if (storedToken) {
    isLoggedIn.set(true)
  }
  
  if (storedUserId) {
    userId.set(storedUserId)
  }

  if (storeIsstaff) {
    Isstaff.set(storeIsstaff)
  }
}

interface BTSManagerData {
  lat: number;
  lon: number;
  pci: number;
}

export const btsManagerDataStore = writable<BTSManagerData[]>([]);