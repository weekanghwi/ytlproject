 export async function load({ fetch }) {
  async function getStatisticData() {
    const response = await fetch('http://10.24.8.120:8000/api/statisticweekly/');
    
    if (response.ok) {
      const data = await response.json();
      return {
        data,
      }
    } else {
      return {
        status: response.status,
        error: new Error('Failed to load')
      }
    }
  }

  return {
    statisticData: getStatisticData()
  }
 }