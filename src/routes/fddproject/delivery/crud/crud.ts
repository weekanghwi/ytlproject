export async function fetchDOData(id: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/do/${id}/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const doData = await response.json();
  return doData;
}

export async function createDOData(data: any) {
  const response = await fetch('http://10.24.8.120:8000/api/do/', {
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

export async function updateDOData(id: string, updatedData: any) {
  const response = await fetch(`http://10.24.8.120:8000/api/do/${id}/`, {
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

export async function deleteDOData(id: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/do/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}