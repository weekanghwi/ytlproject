
export async function fetchphysiteData(physiteinfoid: string) {
  const res = await fetch(`http://10.24.8.120:8000/api/sitephyinfo/?uid=${physiteinfoid}`)

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  const physiteData = await res.json()
  return physiteData
}

export async function fetchsiteData(siteId: string) {
  const res = await fetch(`http://10.24.8.120:8000/api/sitebasicinfo/?siteid=${siteId}`)
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  const BasesiteDta = await res.json()
  return BasesiteDta
}

export async function createphySiteData(createData: any) {
  const response = await fetch('http://10.24.8.120:8000/api/sitephyinfo/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function updatephySiteData(cellidentify: string, updatedData: any) {
  const response = await fetch(`http://10.24.8.120:8000/api/sitephyinfo/${cellidentify}/`, {
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

export async function deletephySiteData(cellidentify: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/sitephyinfo/${cellidentify}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}