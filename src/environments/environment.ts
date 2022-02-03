// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: 'local',
   /************************** ADMINISTRATION *****************************/
  translateApiUrl: 'http://213.136.74.202/translates',
  languageApiUrl: 'http://213.136.74.202/languages',
  refDataApiUrl: 'http://213.136.74.202/refdatas',
  refTypeApiUrl: 'http://213.136.74.202/reftypes',
  applicationApiUrl: 'http://213.136.74.202/applications',
  moduleApiUrl: 'http://213.136.74.202/modules',
  dataListsUrl: 'http://213.136.74.202/datalists/',
  licenceApiUrl: 'http://213.136.74.202/licences/',
  licenceFeaturesApiUrl: 'http://213.136.74.202/licencefeatures',
  taxApiUrl: 'http://213.136.74.202/taxes',
  paymentTermsApiUrl: 'http://213.136.74.202/paymentterms',
  loadAuthStarterDataApiUrl: 'http://213.136.74.202/loadauthstarterdata',
  featuresApiUrl: 'http://213.136.74.202/features',

  /************************** SERVICIMA **********************************/
  contractApiUrl: 'http://213.136.74.202:8060/servicima/contracts/v1',
  contractExtensionApiUrl: 'http://213.136.74.202:8061/servicima/contractextensions/v1',
  contractProjectApiUrl: 'http://213.136.74.202:8095/servicima/contractproject/v1',

  contractorApiUrl: 'http://213.136.74.202:8062/servicima/contractors/v1',
  contractorContactApiUrl: 'http://213.136.74.202:8063/servicima/contractorcontacts/v1',
  companyTaxApiUrl: 'http://213.136.74.202:8064/servicima/companytaxes/v1',
  collaboratorApiUrl: 'http://213.136.74.202/collaborators',
  companyLicenceApiUrl: 'http://213.136.74.202:8036/auth/companylicences/v1',
  companyLicenceUrl: 'http://213.136.74.202/companylicences',
  companyPaymentTermsApiUrl: 'http://213.136.74.202:8065/servicima/companypaymentterms/v1',
  companyRoleFeaturesApiUrl: 'http://213.136.74.202/companyrolefeatures',
  companyTimesheetSettingApiUrl: 'http://213.136.74.202:8080/servicima/companytimesheetsetting/v1',
  resumeApiUrl: 'http://213.136.74.202/resume',
  resumeCertifDiplomaApiUrl: 'http://213.136.74.202/resumediploma',
  resumeFunctionalSkillsApiUrl: 'http://213.136.74.202/resumefunctionalskills',
  resumeLanguageApiUrl: 'http://213.136.74.202/resumelanguage',
  resumeProfessionalExperienceApiUrl: 'http://213.136.74.202/resumeprofessionalexperience',
  resumeProjectApiUrl: 'http://213.136.74.202/resumeproject',
  resumeProjectDetailsApiUrl: 'http://213.136.74.202/resumeprojectdetails',
  resumeProjectDetailsSectionApiUrl: 'http://213.136.74.202/resumeprojectdetailssection',
  resumeSectionApiUrl: 'http://213.136.74.202/resumesection',
  resumeTechnicalSkillsApiUrl: 'http://213.136.74.202/resumetechnicalskills',
  resumeInterventionApiUrl: 'http://213.136.74.202/resumeintervention',
  resumeCertificationApiUrl: 'http://213.136.74.202/resumecertification',
  resumeDataApiUrl: 'http://213.136.74.202/resumedata',
  docxTemplateApiUrl: 'http://213.136.74.202/documentgenerator',
  candidateApiUrl: 'http://213.136.74.202/candidates',
  resumeMailingHistoryApiUrl: 'http://213.136.74.202/mailinghistory',
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
  invoiceGenerateApiUrl: 'http://213.136.74.202/invoicegenerate',
  invoiceLineApiUrl: 'http://213.136.74.202/invoiceline',
  invoiceHeaderApiUrl: 'http://213.136.74.202/invoiceheader',
  invoicePaymentApiUrl: 'http://213.136.74.202/invoicepayment',
  invoiceAttachmentApiUrl: 'http://213.136.74.202/invoiceattachment',
  companyBankingInfoApiUrl: 'http://213.136.74.202:8108/servicima/companybankinginfo/v1',
  timesheetApiUrl: 'http://213.136.74.202/timesheet',
  timesheetHolidayApiUrl: 'http://213.136.74.202/timesheetholiday',
  projectCollaboratorApiUrl: 'http://213.136.74.202:8096/servicima/projectcollaborator/v1',
  linkedInOauthApiUrl: 'http://213.136.74.202/socialnetwork',
  servicmaUrl: 'http://localhost:4200',
  /************************* AUTHENTICATION ******************************/
  credentialsApiUrl: 'http://213.136.74.202/credentials',
  userRoleApiUrl: 'http://213.136.74.202/userroles',
  companyApiUrl: 'http://213.136.74.202/companies',
  userApiUrl: 'http://213.136.74.202/users',
  userGatewayApiUrl: 'http://213.136.74.202/usergatway',
  redirectionHomeUrl: '/',

  /************************* UPLOAD FILE ******************************/
  uploadFileApiUrl: 'http://213.136.74.202/uploadfiles',
  /************************* GENERATE CERTIFICATION ******************************/
  pdfFileApiUrl: 'http://213.136.74.202:8104/servicima/hrworkcertificate/pdf/v1',
  /************************* UPLOAD RESUME FILE ************************/
  uploadResumeFileApiUrl: 'http://213.136.74.202/uploadresumefile',
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
