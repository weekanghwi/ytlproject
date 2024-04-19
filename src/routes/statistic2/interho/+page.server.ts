export async function load({ url, fetch }) {
  async function getInterFreqHOStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/interho/'),
    ];

    const [InterFreqHOData] = await Promise.all(requests);
    if (InterFreqHOData.ok) {
      const InterFreqHO = await InterFreqHOData.json();
      return {
        InterFreqHO,
      }
    } else {
      return {
        status: InterFreqHOData.status,
        error: new Error('Failed to load')
      }
    }
  }
  return {
    InterFreqHOStatisticData: getInterFreqHOStatisticdata()
  }
}