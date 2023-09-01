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
  cellidentity: number;
  sitebasicinfo: number;
  antennatype: string;
  sitestatus: string;
  sectorid: number;
  enbid: string;
  portnumber: number;
  siteconfig: string;
  sectorconfig: number;
  channelcard: string;
  antennaheight: number;
  azimuth: number;
  mtilt: number;
  etilt: number;
  earfcndl: number;
  earfcnul: number;
  pci: number;
  rsi: number;
  tac: number;
  pss: number;
  sss: number;
  txattn: number;
  update_status: string;
}

export function createInitialphySiteData(): PhysicalSiteData {
  return {
    cellidentity: 0,
    sitebasicinfo: 0,
    antennatype: '',
    sitestatus: '',
    sectorid: 0,
    enbid: '',
    portnumber: 0,
    siteconfig: '',
    sectorconfig: 0,
    channelcard: '',
    antennaheight: 0,
    azimuth: 0,
    mtilt: 0,
    etilt: 0,
    earfcndl: 0,
    earfcnul: 0,
    pci: 0,
    rsi: 0,
    tac: 0,
    pss: 0,
    sss: 0,
    txattn: 0,
    update_status: '',
  }
}

export interface doData {
  id: number;
  sitebasicinfo: string;
  doissuedate: string;
  codsubmitdate: string;
  codapprovedate: string;
  create_at: string;
  update_at: string;
}

export function createInitialdoData(): doData {
  return {
    id: 0,
    sitebasicinfo: '',
    doissuedate: '',
    codsubmitdate: '',
    codapprovedate: '',
    create_at: '',
    update_at: '',
  }
}

export interface InstallData {
  id: number,
  sitebasicinfo: string,
  subcon: string,
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
  subcon: '',
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