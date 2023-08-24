export async function fetchSiteData(id: string) {
  const response = await fetch(`http://10.24.8.115:8000/api/v2/siteinfo/${id}/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const siteData = await response.json();
  return siteData;
}

export async function createSiteData(data: any) {
  const response = await fetch('http://10.24.8.115:8000/api/v2/siteinfo/', {
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

export async function updateSiteData(id: string, updatedData: any) {
  const response = await fetch(`http://10.24.8.115:8000/api/v2/siteinfo/${id}/`, {
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

export async function deleteSiteData(id: string) {
  const response = await fetch(`http://10.24.8.115:8000/api/v2/siteinfo/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

