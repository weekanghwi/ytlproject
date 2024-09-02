export async function load({ url, fetch }) {
  async function getx2InHOStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/x2inho/'),
    ];

    const [x2InHOData] = await Promise.all(requests);
    if (x2InHOData.ok) {
      const x2InHO = await x2InHOData.json();
      return {
        x2InHO,
      }
    } else {
      return {
        status: x2InHOData.status,
        error: new Error('Failed to load')
      }
    }
  }

  const x2InHOStatisticData = await getx2InHOStatisticdata()


  return {
    x2InHOStatisticData,
  }
}