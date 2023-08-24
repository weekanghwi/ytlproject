export async function load({ url, fetch }) {
    const params = new URLSearchParams(url.searchParams);
    params.set('limit', params.get('limit') || '5')
    params.set('offset', params.get('offset') || '0');
    params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
    params.set('contracttype', params.get('contracttype') || '');
    params.set('regions', params.get('regions') || '');

    params.set('onair_date', params.get('onair_date') || '');
    params.set('ssv_start_date', params.get('ssv_start_date') || '');
    params.set('ssv_complete_date', params.get('ssv_complete_date') || '');
    params.set('ssv_submit_date', params.get('ssv_submit_date') || '');
    params.set('bs_receive_date', params.get('bs_receive_date') || '');
    params.set('bs_submit_date', params.get('bs_submit_date') || '');
    params.set('bs_approval_date', params.get('bs_approval_date') || '');
    params.set('ic_submit_date', params.get('ic_submit_date') || '');
    params.set('subcon', params.get('subcon') || '');
  
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