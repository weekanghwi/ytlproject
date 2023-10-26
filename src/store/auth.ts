import { writable } from "svelte/store";

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export const user = writable<User | null>(null);