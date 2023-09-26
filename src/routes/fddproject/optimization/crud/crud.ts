export async function fetchOPTData(id: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/optimization/${id}/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const optData = await response.json();
  return optData;
}

export async function fetchOPTReviewData(sitebasicinfo: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/optreview/?sitebasicinfo=${sitebasicinfo}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const optreviewData = data.results
  return optreviewData;
}

export async function fetchOPTReviewDataone(id: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/optreview/${id}/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const optreviewDataone = await response.json();
  return optreviewDataone
}

export async function updateOPTData(id: string, updatedData: any) {
  const response = await fetch(`http://10.24.8.120:8000/api/optimization/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } 

  return response.json();
}



export async function createOPTReviewData(data: any) {
  const response = await fetch('http://10.24.8.120:8000/api/optreview/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function updateOPTReviewData(id: string, updatedData: any) {
  const response = await fetch(`http://10.24.8.120:8000/api/optreview/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json();
}