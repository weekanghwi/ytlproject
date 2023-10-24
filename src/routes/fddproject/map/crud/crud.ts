export async function createTestresultData(formData: FormData) {
  const response = await fetch('http://10.24.8.120:8000/api/testresult/', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}