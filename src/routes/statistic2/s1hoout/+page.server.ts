export async function load({ url, fetch }) {
  async function gets1OutHOStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/s1outho/'),
    ];

    const [s1OutHOData] = await Promise.all(requests);
    if (s1OutHOData.ok) {
      const s1OutHO = await s1OutHOData.json();
      return {
        s1OutHO,
      }
    } else {
      return {
        status: s1OutHOData.status,
        error: new Error('Failed to load')
      }
    }
  }

  const s1OutHOStatisticData = await gets1OutHOStatisticdata()


  return {
    s1OutHOStatisticData,
  }
}