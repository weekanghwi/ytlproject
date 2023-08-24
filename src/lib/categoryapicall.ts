export async function fetchClusterData(query: string) {
  const response = await fetch(`http://10.24.8.115:8000/api/v2/cluster/?cluster_name=${query}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const clusterData = data.results;
  return clusterData;
}

export async function fetchRegionData() {
  const response = await fetch('http://10.24.8.115:8000/api/v2/region/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const regionData = data.results;
  return regionData;
}

export async function fetchStateData(query: string) {
  const response = await fetch(`http://10.24.8.115:8000/api/v2/state/?regions=${query}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const stateData = data.results;
  return stateData;
}

export async function fetchContractTypeData() {
  const response = await fetch('http://10.24.8.115:8000/api/v2/contracttype/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const contractTypeData = data.results;
  return contractTypeData;
}

export async function fetchOptCategoryData() {
  const response = await fetch('http://10.24.8.115:8000/api/v2/optcategory/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const optCategoryData = data.results;
  return optCategoryData;
}

export async function fetchAntennaTypeData() {
  const response = await fetch('http://10.24.8.115:8000/api/v2/antennatype/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const antennaTypeData = data.results;
  return antennaTypeData;
}

export async function fetchSubconData() {
  const response = await fetch('http://10.24.8.115:8000/api/v2/subcon/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const subconData = data.results;
  return subconData;
}

export async function fetchInstalldelayData() {
  const response = await fetch('http://10.24.8.115:8000/api/v2/installdelay/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const installdelayData = data.results;
  return installdelayData;
}

export async function fetchIntegratedelayData() {
  const response = await fetch('http://10.24.8.115:8000/api/v2/integratedelay/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const integratedelayData = data.results;
  return integratedelayData;
}

export async function fetchOnairdelayData() {
  const response = await fetch('http://10.24.8.115:8000/api/v2/onairdelay/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const onairdelayData = data.results;
  return onairdelayData;
}

export async function fetchCOIdelayData() {
  const response = await fetch('http://10.24.8.115:8000/api/v2/coidelay/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const coidelayData = data.results;
  return coidelayData;
}

export async function fetchCOICdelayData() {
  const response = await fetch('http://10.24.8.115:8000/api/v2/coicdelay/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const coicdelayData = data.results;
  return coicdelayData;
}