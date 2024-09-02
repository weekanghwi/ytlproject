export async function load({ url, fetch }) {
  const params = new URLSearchParams(url.searchParams);
  params.set('limit', params.get('limit') || '5')
  params.set('offset', params.get('offset') || '0');
  params.set('sitebasicinfo', params.get('sitebasicinfo') || '');
  params.set('band', params.get('band') || '');
  params.set('region', params.get('region') || '');
  params.set('year', params.get('year') || '');
  params.set('weeknum', params.get('weeknum') || '');
  params.set('cell_availability', params.get('cell_availability') || '');
  params.set('attach_setup_success_rate', params.get('attach_setup_success_rate') || '');
  params.set('rrc_setup_success_rate', params.get('rrc_setup_success_rate') || '');
  params.set('erab_setup_success_rate_ngbr', params.get('erab_setup_success_rate_ngbr') || '');
  params.set('volte_setup_success_rate_gbr', params.get('volte_setup_success_rate_gbr') || '');
  params.set('call_drop_rate_erab_ngbr', params.get('call_drop_rate_erab_ngbr') || '');
  params.set('volte_call_drop_rate_erab_gbr', params.get('volte_call_drop_rate_erab_gbr') || '');
  params.set('hosr_intra_frequency', params.get('hosr_intra_frequency') || '');
  params.set('hosr_inter_frequency', params.get('hosr_inter_frequency') || '');
  params.set('x2_handover_out_success_rate', params.get('x2_handover_out_success_rate') || '');
  params.set('x2_handover_in_success_rate', params.get('x2_handover_in_success_rate') || '');
  params.set('s1_handover_out_success_rate', params.get('s1_handover_out_success_rate') || '');
  params.set('s1_handover_in_success_rate', params.get('s1_handover_in_success_rate') || '');
  params.set('dl_bler', params.get('dl_bler') || '');
  params.set('ul_bler', params.get('ul_bler') || '');

  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  let firstSaturday = new Date(startOfYear.setDate(startOfYear.getDate() + (7 - startOfYear.getDay())));

  const pastDays = Math.ceil((currentDate.getTime() - firstSaturday.getTime()) / 86400000);
  const currentWeek = Math.ceil(pastDays / 7) + 1

  const weekNum = currentWeek - 1;
  const weekNumParam = `23Week ${weekNum}`;
  params.set('weeknum', weekNumParam)

  const startOfWeek = new Date(firstSaturday);
  startOfWeek.setDate(firstSaturday.getDate() + (weekNum - 2) * 7);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  async function getStatisticData(){
    const res = await fetch(`http://10.24.8.120:8000/api/statistic/?${params.toString()}`)
    const res2 = await fetch('http://10.24.8.120:8000/api/lsmstatistic/')
    const res3 = await fetch(`http://10.24.8.120:8000/api/statisticcalculated/?weeknum=${weekNumParam}&category=All`)
    if (res.ok) {
      const data = await res.json()
      const lsmStatistic = await res2.json()
      const statisticCalculated = await res3.json()
      return {
        data,
        lsmStatistic,
        statisticCalculated,
        totalPages: Math.ceil(data.count / Number(params.get('limit'))),
        startOfWeek,
        endOfWeek,
        weekNum
      }
    } else {
      return {
        status: res.status,
        error: new Error('Failed to load')
      }
    }
  }

  const statisticData = await getStatisticData();
  
  return {
    statisticData,
  }
}