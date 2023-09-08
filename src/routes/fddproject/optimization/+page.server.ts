export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('contracttype', params.get('contracttype') || '');
  params.set('region', params.get('region') || '');

  params.set('ssvcompletedate', params.get('ssvcompletedate') || '');
  params.set('optstartdate', params.get('optstartdate') || '');
  params.set('optcompletedate', params.get('optcompletedate') || '');
  params.set('optsubmitdate', params.get('optsubmitdate') || '');
  params.set('optapprovedate', params.get('optapprovedate') || '');
  params.set('optsubcon', params.get('optsubcon') || '');
  params.set('opttype', params.get('opttype') || '');

  async function getReldataList(){
    const res = await fetch(`http://10.24.8.120:8000/api/alltable/?${params.toString()}`)
    const ressubcon = await fetch('http://10.24.8.120:8000/api/subcon/')
    if (res.ok && ressubcon.ok) {
      const data = await res.json()
      const subcon = await ressubcon.json()
      return {
        data,
        subcon,
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