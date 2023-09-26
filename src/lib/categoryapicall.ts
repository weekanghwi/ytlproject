export async function fetchClusterData(query: string) {
  const response = await fetch(`http://10.24.8.120:8000/api/clusters/?cluster=${query}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const clusterData = data.results;
  return clusterData;
}

export async function fetchRegionData() {
  const response = await fetch('http://10.24.8.120:8000/api/region/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const regionData = data.results;
  return regionData;
}

export async function fetchStateData(query: string) {
  let url = 'http://10.24.8.120:8000/api/state/';
  if (query) {
    url += `?region=${query}`;
  }
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const stateData = data.results;
  return stateData;
}

export async function fetchContractTypeData() {
  const response = await fetch('http://10.24.8.120:8000/api/contracttype/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const contractTypeData = data.results;
  return contractTypeData;
}

export async function fetchSiteConfigData() {
  const response = await fetch('http://10.24.8.120:8000/api/siteconfig/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const siteConfigData = data.results;
  return siteConfigData;
}

export async function fetchAntennaTypeData() {
  const response = await fetch('http://10.24.8.120:8000/api/antennatype/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const antennaTypeData = data.results;
  return antennaTypeData;
}

export async function fetchSubconData() {
  const response = await fetch('http://10.24.8.120:8000/api/subcon/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const subconData = data.results;
  return subconData;
}

export async function fetchCOICApproveStatusData() {
  const response = await fetch('http://10.24.8.120:8000/api/coicapprovestatus');
  if (!response.ok){
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const coicapprovestatus = data.results;
  return coicapprovestatus;
}

export async function fetchSSVIssueData() {
  const response = await fetch('http://10.24.8.120:8000/api/ssvissue/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const ssvissue = data.results;
  return ssvissue
}

export async function fetchOPTTypeData() {
  const response = await fetch('http://10.24.8.120:8000/api/opttype/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json()
  const opttype = data.results;
  return opttype
}

export async function fetchOPTIssueData() {
  const response = await fetch('http://10.24.8.120:8000/api/optissue/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json()
  const optissue = data.results;
  return optissue
}

export async function fetchPACApproveStatusData() {
  const response = await fetch('http://10.24.8.120:8000/api/pacapprovestatus/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json()
  const pacapprovestatus = data.results;
  return pacapprovestatus
}

export async function fetchFACApproveStatusData() {
  const response = await fetch('http://10.24.8.120:8000/api/facapprovestatus/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json()
  const facapprovestatus = data.results;
  return facapprovestatus
}

export async function fetchBTSManagerData() {
  const response = await fetch('http://10.24.8.120:8000/api/btsmanager/')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json()
  const btsmanager = data.results;
  return btsmanager
}

export async function fetchPICData() {
  const response = await fetch('http://10.24.8.120:8000/api/pic/')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json()
  const pic = data.results;
  return pic
}

export async function fetchOPTReviewStatusData() {
  const response = await fetch('http://10.24.8.120:8000/api/optreviewstatus/')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json()
  const optreviewdata = data.results;
  return optreviewdata
}