export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('contracttype', params.get('contracttype') || '');
  params.set('region', params.get('region') || '');
  params.set('doissuedate', params.get('doissuedate') || '');
  params.set('startdate', params.get('startdate') || '');
  params.set('completedate', params.get('completedate') || '');
  params.set('integrationdate', params.get('integrationdate') || '');
  params.set('integrationondate', params.get('integrationondate') || '');
  params.set('oaairdate', params.get('oaairdate') || '');
  params.set('coisubmitdate', params.get('coisubmitdate') || '');
  params.set('coiapprovedate', params.get('coiapprovedate') || '');
  params.set('coicsubmitdate', params.get('coicsubmitdate') || '');
  params.set('coicapprovestatus', params.get('coicapprovestatus') || '');
  params.set('pnochotriggerdate', params.get('pnochotriggerdate') || '');
  params.set('pnochocompletedate', params.get('pnochocompletedate') || '');

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
    reldata,
  }
}