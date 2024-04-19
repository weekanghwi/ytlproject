export async function load({ url, fetch }) {
  async function geteCallDropGBRStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/calldropgbr/'),
    ];

    const [CallDropGBRData] = await Promise.all(requests);
    if (CallDropGBRData.ok) {
      const CallDropGBR = await CallDropGBRData.json();
      return {
        CallDropGBR,
        // totalPages: Math.ceil(statisticcluster.count / Number(params.get('limit'))),
      }
    } else {
      return {
        status: CallDropGBRData.status,
        error: new Error('Failed to load')
      }
    }
  }
  return {
    CallDropGBRStatisticData: geteCallDropGBRStatisticdata()
  }
}