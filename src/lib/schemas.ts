import { z } from 'zod';

export const SiteFormSchema = z.object({
  id: z.number(),
  siteid: z.string().min(8).nonempty({message: 'Site ID is required'}),
  sitename: z.string().min(2).nonempty({message: 'Site Name is required'}),
  cluster: z.string().nullable(),
  contracttype: z.string().nullable(),
  siteconfig: z.string().nullable(),
  region: z.string().nullable(),
  state: z.string().nullable(),
  lat: z.number().nullable(),
  lon: z.number().nullable(),
})

export const PhysicalSiteFormSchema = z.object({
  id: z.number(),
  uid: z.string().nullable(),
  secid: z.number().nullable(),
  portnum: z.number().nullable(),
  band: z.number().nullable(),
  antennaheight: z.number().nullable(),
  azimuth: z.number().min(0).max(359).nullable(),
  mtilt: z.number().nullable(),
  sitebasicinfo: z.string().nullable(),
  antennatype: z.string().min(1).nullable(),
  modified_by: z.string().nullable(),
})

export const MaterialFormSchema = z.object({
  id: z.number(),
  sitebasicinfo: z.string().nullable(),
  dumaterial: z.string().nullable(),
  rumaterial: z.string().nullable(),
  remark: z.string().nullable(),
})

export const DoFormSchema = z.object({
  id: z.number(),
  sitebasicinfo: z.string().min(1).nullable(),
  doissuedate: z.string().nullable(),
  codsubmitdate: z.string().nullable(),
  codapprovedate: z.string().nullable(),
})

export const InstallFormSchema = z.object({
  id: z.number(),
  sitebasicinfo: z.string().nullable(),
  startdate: z.string().nullable(),
  completedate: z.string().nullable(),
  integrationdate: z.string().nullable(),
  integrationondate: z.string().nullable(),
  oaairdate: z.string().nullable(),
  coisubmitdate: z.string().nullable(),
  coiapprovedate: z.string().nullable(),
  coicsubmitdate: z.string().nullable(),
  coicapprovestatus: z.string().nullable(),
  pnochotriggerdate: z.string().nullable(),
  pnochocompletedate: z.string().nullable(),
})

export const SSVFormSchema = z.object({
  id: z.number(),
  sitebasicinfo: z.string().nullable(),
  ssvstartdate: z.string().nullable(),
  ssvcompletedate: z.string().nullable(),
  ssvsubmitdate: z.string().nullable(),
  bsreceivedate: z.string().nullable(),
  bssubmitdate: z.string().nullable(),
  bsapprovedate: z.string().nullable(),
  ssvsubcon: z.string().nullable(),
  ssvissuetype: z.string().nullable(),
  ssvissuedetail: z.string().nullable(),
})

export const OPTFormSchema = z.object({
  id: z.number(),
  sitebasicinfo: z.string().nullable(),
  optstartdate: z.string().nullable(),
  optcompletedate: z.string().nullable(),
  optsubmitdate: z.string().nullable(),
  optapprovedate: z.string().nullable(),
  opttype: z.string().nullable(),
  optsubcon: z.string().nullable(),
  optissuetype: z.string().nullable(),
  optissuedetail: z.string().nullable(),
})

export const OPTReviewFormSchema = z.object({
  id: z.number(),
  sitebasicinfo: z.string().nullable(),
  reviewdate: z.string().nullable(),
  reviewdetail: z.string().nullable(),
  pic: z.string().nullable(),
  reviewstatus: z.string().nullable(),
})

export const CertiFormSchema = z.object({
  id: z.number(),
  sitebasicinfo: z.string().nullable(),
  pacsubmitdate: z.string().nullable(),
  facsubmitdate: z.string().nullable(),
  pacapprovestatus: z.string().nullable(),
  facapprovestatus: z.string().nullable(),
})

export const TestresultSchema = z.object({
  id: z.number(),
  sitebasicinfo: z.string().nullable(),
  cycle: z.string().nullable(),
  testdata: z.custom<File | null>((val) => val instanceof File || val === null, {
    message: "testdata must be a File object or null"
  }).nullable()

})