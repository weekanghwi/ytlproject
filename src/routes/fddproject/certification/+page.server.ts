export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('contracttype', params.get('contracttype') || '');
  params.set('regions', params.get('regions') || '');

  params.set('pac_submit_date', params.get('pac_submit_date') || '');
  params.set('fac_submit_date', params.get('fac_submit_date') || '');
  params.set('pac_status', params.get('pac_status') || '');
  params.set('fac_status', params.get('fac_status') || '');

  async function getReldataList(){
    const res = await fetch(`http://10.24.8.115:8000/api/v2/totalrelated/?${params.toString()}`)
    if (res.ok) {
      const data = await res.json()
      return {
        data,
        totalPages: Math.ceil(data.count / Number(params.get('limit')))
      }
    } else {
      return {
        status: res.status,
        error: new Error('Failed to load')
      }
    }
  }

  return {
    reldata: getReldataList(),
  }
}