export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('contracttype', params.get('contracttype') || '');
  params.set('regions', params.get('regions') || '');
  params.set('install_start', params.get('install_start') || '');
  params.set('install_complete', params.get('install_complete') || '');
  params.set('integration_date', params.get('integration_date') || '');
  params.set('integration_turnon', params.get('integration_turnon') || '');
  params.set('onair_date', params.get('onair_date') || '');
  params.set('coi_submit_date', params.get('coi_submit_date') || '');
  params.set('coi_approval_date', params.get('coi_approval_date') || '');
  params.set('coic_submit_date', params.get('coic_submit_date') || '');
  params.set('coic_approval_status', params.get('coic_approval_status') || '');
  params.set('pnoc_ho_trigger_date', params.get('pnoc_ho_trigger_date') || '');
  params.set('pnoc_ho_complete_date', params.get('pnoc_ho_complete_date') || '');

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