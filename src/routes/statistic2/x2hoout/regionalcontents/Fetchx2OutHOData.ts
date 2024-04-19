import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const trendDataStore: Writable<any> = writable(null);

export async function fetchTrendData(region?: string) {
  let url = 'http://10.24.8.120:8000/api/x2outho/'
  if (region) {
    url += `?region=${region}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  trendDataStore.set(data)
}
