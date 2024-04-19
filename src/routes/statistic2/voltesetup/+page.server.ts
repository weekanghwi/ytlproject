export async function load({ url, fetch }) {
  async function getVoLTEsetupStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/voltesetup/'),
    ];

    const [setupData] = await Promise.all(requests);
    if (setupData.ok) {
      const VoLTEsetup = await setupData.json();
      return {
        VoLTEsetup,
        // totalPages: Math.ceil(statisticcluster.count / Number(params.get('limit'))),
      }
    } else {
      return {
        status: setupData.status,
        error: new Error('Failed to load')
      }
    }
  }
  return {
    VoLTEStatisticData: getVoLTEsetupStatisticdata()
  }
}