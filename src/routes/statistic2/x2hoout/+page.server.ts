export async function load({ url, fetch }) {
  async function getx2OutHOStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/x2outho/'),
    ];

    const [x2OutHOData] = await Promise.all(requests);
    if (x2OutHOData.ok) {
      const x2OutHO = await x2OutHOData.json();
      return {
        x2OutHO,
      }
    } else {
      return {
        status: x2OutHOData.status,
        error: new Error('Failed to load')
      }
    }
  }

  const x2OutHOStatisticData = await getx2OutHOStatisticdata()

  return {
    x2OutHOStatisticData,
  }
}