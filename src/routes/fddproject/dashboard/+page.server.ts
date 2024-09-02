export async function load({ fetch }) {
  async function getDashboardData(){
    const res = await fetch(`http://10.24.8.120:8000/api/weeklyreport/`)
    if (res.ok) {
      const data = await res.json()
      return {
        data,
      }
    } else {
      return {
        status: res.status,
        error: new Error('Failed to load')
      }
    }
  }

  const dashboardData = await getDashboardData();

  return {
    dashboardData,
  }
}