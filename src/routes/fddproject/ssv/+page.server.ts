export async function load({ url, fetch }) {
    const params = new URLSearchParams(url.searchParams);
    params.set('limit', params.get('limit') || '5')
    params.set('offset', params.get('offset') || '0');
    params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
    params.set('contracttype', params.get('contracttype') || '');
    params.set('region', params.get('region') || '');

    params.set('oaairdate', params.get('oaairdate') || '');
    params.set('ssvstartdate', params.get('ssvstartdate') || '');
    params.set('ssvcompletedate', params.get('ssvcompletedate') || '');
    params.set('ssvsubmitdate', params.get('ssvsubmitdate') || '');
    params.set('bsreceivedate', params.get('bsreceivedate') || '');
    params.set('bssubmitdate', params.get('bssubmitdate') || '');
    params.set('bsapprovedate', params.get('bsapprovedate') || '');
    params.set('icsubmitdate', params.get('icsubmitdate') || '');
    params.set('ssvsubcon', params.get('ssvsubcon') || '');
  
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
    
    const reldata = await getReldataList();

    return {
      reldata,
    }
  }