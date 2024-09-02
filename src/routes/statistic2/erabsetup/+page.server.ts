export async function load({ url, fetch }) {
  async function geteRABsetupStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/erabsetup/'),
    ];

    const [eRABsetupData] = await Promise.all(requests);
    if (eRABsetupData.ok) {
      const eRABsetup = await eRABsetupData.json();
      return {
        eRABsetup,
        // totalPages: Math.ceil(statisticcluster.count / Number(params.get('limit'))),
      }
    } else {
      return {
        status: eRABsetupData.status,
        error: new Error('Failed to load')
      }
    }
  }

  const eRABStatisticData = await geteRABsetupStatisticdata();


  return {
    eRABStatisticData,
  }
}