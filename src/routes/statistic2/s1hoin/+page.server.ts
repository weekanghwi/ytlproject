export async function load({ url, fetch }) {
  async function gets1InHOStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/s1inho/'),
    ];

    const [s1InHOData] = await Promise.all(requests);
    if (s1InHOData.ok) {
      const s1InHO = await s1InHOData.json();
      return {
        s1InHO,
      }
    } else {
      return {
        status: s1InHOData.status,
        error: new Error('Failed to load')
      }
    }
  }
  return {
    s1InHOStatisticData: gets1InHOStatisticdata()
  }
}