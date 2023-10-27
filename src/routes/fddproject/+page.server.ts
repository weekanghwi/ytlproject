export async function load({ fetch }) {
  async function LSMstatistic(){
    const res = await fetch(`http://10.24.8.120:8000/api/lsmstatistic/`)
    if (res.ok) {
      const data = await res.json()
      return {
        data,
      }
    } else {
      return {
        status: res.status,
        error: new Error('Failed to load LSM statistic')
      }
    }
  }

  async function Weeklystatistic() {
    const res = await fetch('http://10.24.8.120:8000/api/weeklyreport/')
    if (res.ok) {
      const data = await res.json()
      return {
        data,
      }
    } else {
      return {
        status: res.status,
        error: new Error('Failed to load Weekly statistic')
      }
    }
  }

  const [lsmStatistic, weeklyStatistic] = await Promise.all([LSMstatistic(), Weeklystatistic()])

  return {
    lsmStatistic,
    weeklyStatistic
  }
}