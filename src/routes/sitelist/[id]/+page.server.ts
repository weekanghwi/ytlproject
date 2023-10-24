
import { error } from '@sveltejs/kit';


export let _cellidentity = '';
export async function load({ fetch, params }) {
  const ressiteData = await fetch(`http://10.24.8.120:8000/api/sitebasicinfo/${params.id}`);
  const physiteData = await fetch(`http://10.24.8.120:8000/api/btsmanager/?siteid=${params.id}`)
  const resrelatedData = await fetch(`http://10.24.8.120:8000/api/alltable/?sitebasicinfo_id=${params.id}`)

  const sitedata = await ressiteData.json();
  const physicaldata = await physiteData.json();
  const relateddata = await resrelatedData.json();

  if (params.id && !sitedata.id) throw error(404, 'Site not found');

  return {
    sitedata,
    physicaldata,
    relateddata,
  }
}