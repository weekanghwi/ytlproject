export async function load({ url, fetch }) {
  async function getRRCsetupStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/rrcsetup/'),
    ];

    const [RRCsetupData] = await Promise.all(requests);
    if (RRCsetupData.ok) {
      const RRCsetup = await RRCsetupData.json();
      return {
        RRCsetup,
        // totalPages: Math.ceil(statisticcluster.count / Number(params.get('limit'))),
      }
    } else {
      return {
        status: RRCsetupData.status,
        error: new Error('Failed to load')
      }
    }
  }

  const RRCStatisticData = await getRRCsetupStatisticdata();

  return {
    RRCStatisticData,
  }
}