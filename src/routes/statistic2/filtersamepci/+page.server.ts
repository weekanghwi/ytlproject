export async function load({url, fetch}) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('distance', params.get('distance') || '');
  params.set('earfcnul', params.get('earfcnul') || '24245');
  params.set('region', params.get('region') || '')
  async function getSamePCIlist() {
    const res = await fetch(`http://10.24.8.120:8000/api/samepcifilter_sites/?${params.toString()}`)
    if (res.ok) {
      const SamePCI = await res.json();
      return {
        SamePCI,
        totalPages: Math.ceil(SamePCI.count / Number(params.get('limit'))),
      }
    } else {
      return {
        status: res.status,
        error: 'Failed to load'
      }
    }
  }
  return {
    SamePCIData: getSamePCIlist()
  }
}