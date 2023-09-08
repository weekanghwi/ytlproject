export async function fetchSSVData(id: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/ssv/${id}/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const ssvData = await response.json();
  return ssvData;
}

export async function createSSVData(data: any) {
  const response = await fetch('http://10.24.8.120:8000/api/ssv/', {
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

export async function updateSSVData(id: string, updatedData: any) {
  const response = await fetch(`http://10.24.8.120:8000/api/ssv/${id}/`, {
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

export async function deleteSSVData(id: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/ssv/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}