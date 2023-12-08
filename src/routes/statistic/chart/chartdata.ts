export async function fetchStatisticChartData() {
  const response = await fetch(`http://10.24.8.120:8000/api/statisticapi/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const StatisticChartData = await response.json();
  return StatisticChartData;
}