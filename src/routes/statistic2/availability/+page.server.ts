export async function load({ url, fetch }) {
  async function getCellAvailStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/cellavail/'),
    ];

    const [CellAvailData] = await Promise.all(requests);
    if (CellAvailData.ok) {
      const CellAvail = await CellAvailData.json();
      return {
        CellAvail,
      }
    } else {
      return {
        status: CellAvailData.status,
        error: new Error('Failed to load')
      }
    }
  }
  return {
    CellAvailStatisticData: getCellAvailStatisticdata()
  }
}