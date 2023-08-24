export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('do_number', params.get('do_number') || '');
  params.set('contracttype', params.get('contracttype') || '');
  params.set('do_issue_date', params.get('do_issue_date') || '');
  params.set('cod_submit_to_ytl_date', params.get('cod_submit_to_ytl_date') || '');
  params.set('cod_approval_date', params.get('cod_approval_date') || '');

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
    reldata: getReldataList()
  }
}