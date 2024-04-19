export async function load({ url, fetch }) {
  async function getIntraFreqHOStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/intraho/'),
    ];

    const [IntraFreqHOData] = await Promise.all(requests);
    if (IntraFreqHOData.ok) {
      const IntraFreqHO = await IntraFreqHOData.json();
      return {
        IntraFreqHO,
      }
    } else {
      return {
        status: IntraFreqHOData.status,
        error: new Error('Failed to load')
      }
    }
  }
  return {
    IntraFreqHOStatisticData: getIntraFreqHOStatisticdata()
  }
}