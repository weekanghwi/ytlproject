export interface ErrorsRecord {
  [key: string]: string;
}

export interface SiteData {
  id: number;
  site_id: string;
  site_name: string;
  cluster: string;
  contracttype: string;
  optcategory: string;
  antennatype: string;
  regions: string;
  state: string;
  lat: number;
  lon: number;
  wimax_id: string;
  candidateid: string;
  school_code: string;
  remark: string;
}

export function createInitialSiteData(): SiteData {
  return {
    id: 0,
    site_id: '',
    site_name: '',
    cluster: '',
    contracttype: '',
    optcategory: '',
    antennatype: '',
    regions: '',
    state: '',
    lat: 0,
    lon: 0,
    wimax_id: '',
    candidateid: '',
    school_code: '',
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
  do_number: number;
  do_issue_date: string;
  do_delay_detail: string;
  cod_submit_to_ytl_date: string;
  cod_approval_date: string;
  cod_delay_detail: string;
  create_at: string;
  update_at: string;
  do_delay: number;
  cod_delay: number;
}

export function createInitialdoData(): doData {
  return {
    id: 0,
    sitebasicinfo: '',
    do_number: 0,
    do_issue_date: '',
    do_delay_detail: '',
    cod_submit_to_ytl_date: '',
    cod_approval_date: '',
    cod_delay_detail: '',
    create_at: '',
    update_at: '',
    do_delay: 0,
    cod_delay: 0,
  }
}

export interface InstallData {
  id: number,
  sitebasicinfo: string,
  installdelay: string,
  integratedelay: string,
  onairdelay: string,
  coidelay: string,
  coicdelay: string,
  subcon: string,
  install_start: string,
  install_complete: string,
  installdelay_detail: string,
  integration_date: string,
  integration_turnon: string,
  integratedelay_detail: string,
  onair_date: string,
  onairdelay_detail: string,
  coi_submit_date: string,
  coi_approval_date: string,
  coidelay_detail: string,
  coic_submit_date: string,
  coic_approval_status: string,
  coicdelay_detail: string,
  pnoc_ho_trigger_date: string,
  pnoc_ho_complete_date: string,
  modify_date: string,
}

export function createInitialInstallData(): InstallData {
  return {
    id: 0,
  sitebasicinfo: '',
  installdelay: '',
  integratedelay: '',
  onairdelay: '',
  coidelay: '',
  coicdelay: '',
  subcon: '',
  install_start: '',
  install_complete: '',
  installdelay_detail: '',
  integration_date: '',
  integration_turnon: '',
  integratedelay_detail: '',
  onair_date: '',
  onairdelay_detail: '',
  coi_submit_date: '',
  coi_approval_date: '',
  coidelay_detail: '',
  coic_submit_date: '',
  coic_approval_status: '',
  coicdelay_detail: '',
  pnoc_ho_trigger_date: '',
  pnoc_ho_complete_date: '',
  modify_date: '',
  }
}