export async function load({ url, fetch }) {
  async function getAttachStatisticdata () {
    const requests = [
      fetch('http://10.24.8.120:8000/api/attachsetup/'),
    ];

    const [AttachData] = await Promise.all(requests);
    if (AttachData.ok) {
      const Attach = await AttachData.json();
      return {
        Attach,
      }
    } else {
      return {
        status: AttachData.status,
        error: new Error('Failed to load')
      }
    }
  }

  const AttachStatisticData = await getAttachStatisticdata();


  return {
    AttachStatisticData,
  }
}