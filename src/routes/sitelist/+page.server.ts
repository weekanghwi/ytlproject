export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('q', params.get('q') || '');
  params.set('cluster', params.get('cluster') || '');
  params.set('regions', params.get('region') || '');
  params.set('state', params.get('state') || '');
  params.set('contracttype', params.get('contracttype') || '');
  params.set('siteconfig', params.get('siteconfig') || '');
  params.set('btsmanager_count', params.get('btsmanager_count') || '');
  params.set('antennatypes', params.get('antennatypes') || '')

  async function getSitelist(){
    const res = await fetch(`http://10.24.8.120:8000/api/sitebasicinfo/?${params.toString()}`)
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
    sitelists: getSitelist()
  }
}
