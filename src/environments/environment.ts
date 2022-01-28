// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: 'local',
  /************************** ADMINISTRATION *****************************/
  translateApiUrl: 'http://213.136.74.202:8000/admin/translates/v1',
  languageApiUrl: 'http://213.136.74.202:8001/admin/languages/v1',
  refDataApiUrl: 'http://213.136.74.202:8002/admin/refdatas/v1',
  refTypeApiUrl: 'http://213.136.74.202:8003/admin/reftypes/v1',
  applicationApiUrl: 'http://213.136.74.202:8004/admin/applications/v1',
  moduleApiUrl: 'http://213.136.74.202:8005/admin/modules/v1',
  dataListsUrl: 'http://213.136.74.202:8006/admin/datalists/v1',
  licenceApiUrl: 'http://213.136.74.202:8009/admin/licences/v1',
  licenceFeaturesApiUrl: 'http://213.136.74.202:8012/admin/licencefeatures/v1',
  taxApiUrl: 'http://213.136.74.202:8007/admin/taxes/v1',
  paymentTermsApiUrl: 'http://213.136.74.202:8008/admin/paymentterms/v1',
  loadAuthStarterDataApiUrl: 'http://213.136.74.202:8200/admin/loadauthstarterdata/v1',
  featuresApiUrl: 'http://213.136.74.202:8021/admin/features/v1',

  /************************** SERVICIMA **********************************/
  contractApiUrl: 'http://213.136.74.202:8060/servicima/contracts/v1',
  contractExtensionApiUrl: 'http://213.136.74.202:8061/servicima/contractextensions/v1',
  contractProjectApiUrl: 'http://213.136.74.202:8095/servicima/contractproject/v1',

  contractorApiUrl: 'http://213.136.74.202:8062/servicima/contractors/v1',
  contractorContactApiUrl: 'http://213.136.74.202:8063/servicima/contractorcontacts/v1',
  companyTaxApiUrl: 'http://213.136.74.202:8064/servicima/companytaxes/v1',
  collaboratorApiUrl: 'http://213.136.74.202:8032/auth/collaborators/v1',
  companyLicenceApiUrl: 'http://213.136.74.202:8036/auth/companylicences/v1',
  companyLicenceUrl: 'http://213.136.74.202:8036/auth/companylicences/v1',
  companyPaymentTermsApiUrl: 'http://213.136.74.202:8065/servicima/companypaymentterms/v1',
  companyRoleFeaturesApiUrl: 'http://213.136.74.202:8037/auth/companyrolefeatures/v1',
  companyTimesheetSettingApiUrl: 'http://213.136.74.202:8080/servicima/companytimesheetsetting/v1',
  resumeApiUrl: 'http://213.136.74.202:8068/servicima/resume/v1',
  resumeCertifDiplomaApiUrl: 'http://213.136.74.202:8074/servicima/resumecertificationdiploma/v1',
  resumeFunctionalSkillsApiUrl: 'http://213.136.74.202:8072/servicima/resumefunctionalskills/v1',
  resumeLanguageApiUrl: 'http://213.136.74.202:8069/servicima/resumelanguage/v1',
  resumeProfessionalExperienceApiUrl: 'http://213.136.74.202:8075/servicima/resumeprofessionalexperience/v1',
  resumeProjectApiUrl: 'http://213.136.74.202:8076/servicima/resumeproject/v1',
  resumeProjectDetailsApiUrl: 'http://213.136.74.202:8077/servicima/resumeprojectdetails/v1',
  resumeProjectDetailsSectionApiUrl: 'http://213.136.74.202:8078/servicima/resumeprojectdetailssection/v1',
  resumeSectionApiUrl: 'http://213.136.74.202:8071/servicima/resumesection/v1',
  resumeTechnicalSkillsApiUrl: 'http://213.136.74.202:8073/servicima/resumetechnicalskills/v1',
  resumeInterventionApiUrl: 'http://213.136.74.202:8070/servicima/resumeintervention/v1',
  resumeCertificationApiUrl: 'http://213.136.74.202:8109/servicima/resumecertification/v1',
  resumeDataApiUrl: 'http://213.136.74.202:8123/servicima/resumedata/v1',
  docxTemplateApiUrl: 'http://213.136.74.202:8094/generate',
  candidateApiUrl: 'http://213.136.74.202:8031/auth/candidates/v1',
  resumeMailingHistoryApiUrl: 'http://213.136.74.202:8125/servicima/mailinghistory/v1',
  bankingApiUrl: 'http://213.136.74.202:8083/servicima/hrbanking/v1',
  childApiUrl: 'http://213.136.74.202:8089/servicima/hrchild/v1',
  emergencyContactApiUrl: 'http://213.136.74.202:8087/servicima/hremergencycontact/v1',
  equipmentApiUrl: 'http://213.136.74.202:8084/servicima/hrequipment/v1',
  evaluationApiUrl: 'http://213.136.74.202:8085/servicima/hrevaluation/v1',
  evaluationGoalApiUrl: 'http://213.136.74.202:8086/servicima/hrevaluationgoals/v1',
  identityDocumentApiUrl: 'http://213.136.74.202:8088/servicima/hridentitydocument/v1',
  payslipApiUrl: 'http://213.136.74.202:8090/servicima/hrpayslip/v1',
  hrContractApiUrl: 'http://213.136.74.202:8092/servicima/hrcontract/v1',
  hrContractExtension: 'http://213.136.74.202:8093/servicima/hrcontractextension/v1',
  hrPreviousContractApiUrl: 'http://213.136.74.202:8113/servicima/hrcontractprevious/v1',
  workCertificateApiUrl: 'http://213.136.74.202:8104/servicima/hrworkcertificate/v1',
  workCertificateUrl: 'http://213.136.74.202:8104/servicima/hrworkcertificate/v1',
  payslipAssociateApiUrl: 'http://213.136.74.202:8112/servicima/payslipassociate/v1',
  invoiceGenerateApiUrl: 'http://213.136.74.202:3000',
  invoiceLineApiUrl: 'http://213.136.74.202:8105/servicima/invoiceline/v1',
  invoiceHeaderApiUrl: 'http://213.136.74.202:8106/servicima/invoiceheader/v1',
  invoicePaymentApiUrl: 'http://213.136.74.202:8107/servicima/invoicepayment/v1',
  invoiceAttachmentApiUrl: 'http://213.136.74.202:9005/servicima/invoiceattachment/v1',
  companyBankingInfoApiUrl: 'http://213.136.74.202:8108/servicima/companybankinginfo/v1',
  timesheetApiUrl: 'http://213.136.74.202:8079/servicima/timesheet/v1',
  timesheetHolidayApiUrl: 'http://213.136.74.202:8110/servicima/timesheetholiday/v1',
  projectCollaboratorApiUrl: 'http://213.136.74.202:8096/servicima/projectcollaborator/v1',
  linkedInOauthApiUrl: 'http://213.136.74.202:8126/servicima/shareonsocialnetwork/v1',
  servicmaUrl: 'http://localhost:4200',
  /************************* AUTHENTICATION ******************************/
  credentialsApiUrl: 'http://213.136.74.202:8030/auth/credentials/v1',
  userRoleApiUrl: 'http://213.136.74.202:8034/auth/userroles/v1',
  companyApiUrl: 'http://213.136.74.202:8035/auth/companies/v1',
  userApiUrl: 'http://213.136.74.202:8038/auth/users/v1',
  userGatewayApiUrl: 'http://213.136.74.202:8201/auth/v1',
  redirectionHomeUrl: '/',

  /************************* UPLOAD FILE ******************************/
  uploadFileApiUrl: 'http://213.136.74.202:8067',
  /************************* GENERATE CERTIFICATION ******************************/
  pdfFileApiUrl: 'http://213.136.74.202:8104/servicima/hrworkcertificate/pdf/v1',
  /************************* UPLOAD RESUME FILE ************************/
  uploadResumeFileApiUrl: 'http://213.136.74.202:8121/servicima/resumelist/v1',
  /*************************** OTHERS ************************************/
  zipCodeApiUrl: 'https://vicopo.selfbuild.fr/cherche',
  applicationCode: 'SERVICIMA',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
