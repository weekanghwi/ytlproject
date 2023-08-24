export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('contracttype', params.get('contracttype') || '');
  params.set('regions', params.get('regions') || '');

  params.set('ssv_complete_date', params.get('ssv_complete_date') || '');
  params.set('opt_start_date', params.get('opt_start_date') || '');
  params.set('opt_complete_date', params.get('opt_complete_date') || '');
  params.set('opt_submit_date', params.get('opt_submit_date') || '');
  params.set('opt_approval_date', params.get('opt_approval_date') || '');
  params.set('optsubcon', params.get('optsubcon') || '');
  params.set('optcategory', params.get('optcategory') || '');
  params.set('onair_date', 'Not Null');

  async function getReldataList(){
    const res = await fetch(`http://10.24.8.115:8000/api/v2/totalrelated/?${params.toString()}`)
    const ressubcon = await fetch('http://10.24.8.115:8000/api/v2/subcon/')
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