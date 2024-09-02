export async function load({ url, fetch }) {
  async function geteCallDropnGBRStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/calldropngbr/'),
    ];

    const [CallDropnGBRData] = await Promise.all(requests);
    if (CallDropnGBRData.ok) {
      const CallDropnGBR = await CallDropnGBRData.json();
      return {
        CallDropnGBR,
        // totalPages: Math.ceil(statisticcluster.count / Number(params.get('limit'))),
      }
    } else {
      return {
        status: CallDropnGBRData.status,
        error: new Error('Failed to load')
      }
    }
  }

  const CallDropnGBRStatisticData = await geteCallDropnGBRStatisticdata()
  
  return {
    CallDropnGBRStatisticData,
  }
}