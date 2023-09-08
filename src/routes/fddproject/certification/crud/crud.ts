export async function fetchCertiData(id: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/certification/${id}/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const certiData = await response.json();
  return certiData;
}

export async function updateCertiData(id: string, updatedData: any) {
  const response = await fetch(`http://10.24.8.120:8000/api/certification/${id}/`, {
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