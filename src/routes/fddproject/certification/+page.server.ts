export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('contracttype', params.get('contracttype') || '');
  params.set('region', params.get('region') || '');

  params.set('pacsubmitdate', params.get('pacsubmitdate') || '');
  params.set('facsubmitdate', params.get('facsubmitdate') || '');
  params.set('pacapprovestatus', params.get('pacapprovestatus') || '');
  params.set('facapprovestatus', params.get('facapprovestatus') || '');

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

  const reldata = await getReldataList();

  return {
    reldata
  }
}