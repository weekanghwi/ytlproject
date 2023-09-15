export interface ErrorsRecord {
  [key: string]: string;
}

export interface SiteData {
  id: number;
  siteid: string;
  sitename: string;
  cluster: string;
  contracttype: string;
  siteconfig: string;
  antennatype: string;
  region: string;
  state: string;
  lat: number;
  lon: number;
  remark: string;
}

export function createInitialSiteData(): SiteData {
  return {
    id: 0,
    siteid: '',
    sitename: '',
    cluster: '',
    contracttype: '',
    siteconfig: '',
    antennatype: '',
    region: '',
    state: '',
    lat: 0,
    lon: 0,
    remark: '',
  }
}

export interface PhysicalSiteData {
  id: number;
  sitebasicinfo: string;
  antennatype: string;
  uid: string;
  secid: number;
  portnum: number;
  band: number;
  antennaheight: number;
  azimuth: number;
  mtilt: number;
  etilt: number;
}

export function createInitialphySiteData(): PhysicalSiteData {
  return {
    id: 0,
    sitebasicinfo: '',
    antennatype: '',
    uid: '',
    secid: 0,
    portnum: 0,
    band: 0,
    antennaheight: 0,
    azimuth: 0,
    mtilt: 0,
    etilt: 0,
  }
}

export interface doData {
  id: number;
  sitebasicinfo: string | null;
  doissuedate: string | null;
  codsubmitdate: string | null;
  codapprovedate: string | null;
  create_at: string | null;
  update_at: string | null;
}

export function createInitialdoData(): doData {
  return {
    id: 0,
    sitebasicinfo: '',
    doissuedate: null,
    codsubmitdate: null,
    codapprovedate: null,
    create_at: '',
    update_at: '',
  }
}

export interface InstallData {
  id: number,
  sitebasicinfo: string,
  startdate: string,
  completedate: string,
  integrationdate: string,
  integrationondate: string,
  oaairdate: string,
  coisubmitdate: string,
  coiapprovedate: string,
  coicsubmitdate: string,
  coicapprovestatus: string,
  pnochotriggerdate: string,
  pnochocompletedate: string,
  modify_date: string,
}

export function createInitialInstallData(): InstallData {
  return {
  id: 0,
  sitebasicinfo: '',
  startdate: '',
  completedate: '',
  integrationdate: '',
  integrationondate: '',
  oaairdate: '',
  coisubmitdate: '',
  coiapprovedate: '',
  coicsubmitdate: '',
  coicapprovestatus: '',
  pnochotriggerdate: '',
  pnochocompletedate: '',
  modify_date: '',
  }
}

export interface SSVData {
  id: number,
  sitebasicinfo: string,
  ssvstartdate: string,
  ssvcompletedate: string,
  ssvsubmitdate: string,
  bsreceivedate: string,
  bssubmitdate: string,
  bsapprovedate: string,
  ssvsubcon: string,
}

export function createInitialSSVData(): SSVData {
  return {
    id: 0,
  sitebasicinfo: '',
  ssvstartdate: '',
  ssvcompletedate: '',
  ssvsubmitdate: '',
  bsreceivedate: '',
  bssubmitdate: '',
  bsapprovedate: '',
  ssvsubcon: '',
  }
}

export interface OPTData {
  id: number,
  sitebasicinfo: string,
  optstartdate: string,
  optcompletedate: string,
  optsubmitdate: string,
  optapprovedate: string,
  opttype: string,
  optsubcon: string,
}

export function createInitialOPTData(): OPTData {
  return {
    id: 0,
  sitebasicinfo: '',
  optstartdate: '',
  optcompletedate: '',
  optsubmitdate: '',
  optapprovedate: '',
  opttype: '',
  optsubcon: '',
  }
}

export interface CertiData {
  id: number,
  sitebasicinfo: string,
  pacsubmitdate: string,
  facsubmitdate: string,
  pacapprovestatus: string,
  facapprovestatus: string,
}

export function createInitialCertiData(): CertiData {
  return {
  id: 0,
  sitebasicinfo: '',
  pacsubmitdate: '',
  facsubmitdate: '',
  pacapprovestatus: '',
  facapprovestatus: '',
  }
}