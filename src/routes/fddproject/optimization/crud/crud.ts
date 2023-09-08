export async function fetchOPTData(id: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/optimization/${id}/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const optData = await response.json();
  return optData;
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