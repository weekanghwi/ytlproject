export async function fetchInstallData(id: string) {
  const response = await fetch(`http://10.24.8.115:8000/api/v2/install/${id}/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const InstallData = await response.json();
  return InstallData;
}

export async function createInstallData(data: any) {
  const response = await fetch('http://10.24.8.115:8000/api/v2/install/', {
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

export async function updateInstallData(id: string, updatedData: any) {
  const response = await fetch(`http://10.24.8.115:8000/api/v2/install/${id}/`, {
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

export async function deleteInstallData(id: string) {
  const response = await fetch(`http://10.24.8.115:8000/api/v2/install/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}