export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('contracttype', params.get('contracttype') || '');
  params.set('doissuedate', params.get('doissuedate') || '');
  params.set('codsubmitdate', params.get('codsubmitdate') || '');
  params.set('codapprovedate', params.get('codapprovedate') || '');

  async function getReldataList(){
    const res = await fetch(`http://10.24.8.120:8000/api/alltable/?${params.toString()}`)
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
    reldata: getReldataList()
  }
}