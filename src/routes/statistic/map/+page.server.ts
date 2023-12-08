export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  const fields = params.get('fields') || '';
  const band = params.get('band') || '';
  const region = params.get('region') || '';

  const fullFieldname = `${fields}_by_region`;
  let StaitsticFailCount: any;
  let cellCountbyBand: any;
  
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('fields', fields || fields);
  params.set('band', band || band);
  params.set('region', region || region)

  async function getStatisticpagedData(){
    const res = await fetch(`http://10.24.8.120:8000/api/statisticpaged/?${params.toString()}`);
    const statisticFail = await fetch('http://10.24.8.120:8000/api/statisticapi/');
    const res2 = await fetch('http://10.24.8.120:8000/api/statisticsummary/');
    
    if (res.ok) {
      const data = await res.json()
      const failCellcount = await statisticFail.json()
      const summary = await res2.json()

      const Failcount = failCellcount[fullFieldname]?.band?.[band];
      const StatisticSummary = summary.total_statistic_cell_by_band.band?.[band];
      
      if (Failcount) {
        const regionIndex = Failcount.region.indexOf(region);
        StaitsticFailCount = Failcount.count_fail[regionIndex]
      }
      if (StatisticSummary) {
        const regionIndex = StatisticSummary.region.indexOf(region);
        cellCountbyBand = StatisticSummary.count[regionIndex]
      }
      return {
        data,
        StaitsticFailCount,
        cellCountbyBand,
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
    statisticpagedData: getStatisticpagedData()
  }
}