// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: 'local',
  /************************** ADMINISTRATION *****************************/
  translateApiUrl: 'http://192.168.1.22:8000/admin/translates/v1',
  languageApiUrl: 'http://192.168.1.22:8001/admin/languages/v1',
  refDataApiUrl: 'http://192.168.1.22:8002/admin/refdatas/v1',
  refTypeApiUrl: 'http://192.168.1.22:8003/admin/reftypes/v1',
  applicationApiUrl: 'http://192.168.1.22:8004/admin/applications/v1',
  moduleApiUrl: 'http://192.168.1.22:8005/admin/modules/v1',
  dataListsUrl: 'http://192.168.1.22:8006/admin/datalists/v1',
  licenceApiUrl: 'http://192.168.1.22:8009/admin/licences/v1',
  licenceFeaturesApiUrl: 'http://192.168.1.22:8012/admin/licencefeatures/v1',
  taxApiUrl: 'http://192.168.1.22:8007/admin/taxes/v1',
  paymentTermsApiUrl: 'http://192.168.1.22:8008/admin/paymentterms/v1',
  loadAuthStarterDataApiUrl: 'http://192.168.1.22:8200/admin/loadauthstarterdata/v1',
  featuresApiUrl: 'http://192.168.1.22:8021/admin/features/v1',

  /************************** SERVICIMA **********************************/
  contractApiUrl: 'http://192.168.1.22:8060/servicima/contracts/v1',
  contractExtensionApiUrl: 'http://192.168.1.22:8061/servicima/contractextensions/v1',
  contractProjectApiUrl: 'http://192.168.1.22:8095/servicima/contractproject/v1',
  contractorApiUrl: 'http://192.168.1.22:8062/servicima/contractors/v1',
  contractorContactApiUrl: 'http://192.168.1.22:8063/servicima/contractorcontacts/v1',
  companyTaxApiUrl: 'http://192.168.1.22:8064/servicima/companytaxes/v1',
  collaboratorApiUrl: 'http://192.168.1.22:8032/auth/collaborators/v1',
  companyLicenceApiUrl: 'http://192.168.1.22:8036/auth/companylicences/v1',
  companyPaymentTermsApiUrl: 'http://192.168.1.22:8065/servicima/companypaymentterms/v1',
  companyRoleFeaturesApiUrl: 'http://192.168.1.22:8037/auth/companyrolefeatures/v1',
  companyTimesheetSettingApiUrl: 'http://192.168.1.22:8080/servicima/companytimesheetsetting/v1',
  resumeApiUrl: 'http://192.168.1.22:8068/servicima/resume/v1',
  resumeCertifDiplomaApiUrl: 'http://192.168.1.22:8074/servicima/resumecertificationdiploma/v1',
  resumeFunctionalSkillsApiUrl: 'http://192.168.1.22:8072/servicima/resumefunctionalskills/v1',
  resumeLanguageApiUrl: 'http://192.168.1.22:8069/servicima/resumelanguage/v1',
  resumeProfessionalExperienceApiUrl: 'http://192.168.1.22:8075/servicima/resumeprofessionalexperience/v1',
  resumeProjectApiUrl: 'http://192.168.1.22:8076/servicima/resumeproject/v1',
  resumeProjectDetailsApiUrl: 'http://192.168.1.22:8077/servicima/resumeprojectdetails/v1',
  resumeProjectDetailsSectionApiUrl: 'http://192.168.1.22:8078/servicima/resumeprojectdetailssection/v1',
  resumeSectionApiUrl: 'http://192.168.1.22:8071/servicima/resumesection/v1',
  resumeTechnicalSkillsApiUrl: 'http://192.168.1.22:8073/servicima/resumetechnicalskills/v1',
  resumeInterventionApiUrl: 'http://192.168.1.22:8070/servicima/resumeintervention/v1',
  resumeCertificationApiUrl: 'http://192.168.1.22:8109/servicima/resumecertification/v1',
  resumeDataApiUrl: 'http://127.0.0.1:8123/servicima/resumedata/v1',
  docxTemplateApiUrl: 'http://127.0.0.1:8094/generate',
  candidateApiUrl: 'http://192.168.1.22:8031/auth/candidates/v1',

  invoiceGenerateApiUrl: 'http://192.168.1.22:3000',
  invoiceLineApiUrl: 'http://192.168.1.22:8105/servicima/invoiceline/v1',
  invoiceHeaderApiUrl: 'http://192.168.1.22:8106/servicima/invoiceheader/v1',
  invoicePaymentApiUrl: 'http://127.0.0.1:8107/servicima/invoicepayment/v1',
  companyBankingInfoApiUrl: 'http://192.168.1.22:8108/servicima/companybankinginfo/v1',
  timesheetApiUrl: 'http://192.168.1.22:8079/servicima/timesheet/v1',
  projectCollaboratorApiUrl: 'http://192.168.1.22:8096/servicima/projectcollaborator/v1',
  /************************* AUTHENTICATION ******************************/
  credentialsApiUrl: 'http://192.168.1.22:8030/auth/credentials/v1',
  userRoleApiUrl: 'http://192.168.1.22:8034/auth/userroles/v1',
  companyApiUrl: 'http://192.168.1.22:8035/auth/companies/v1',
  userApiUrl: 'http://192.168.1.22:8038/auth/users/v1',
  userGatewayApiUrl: 'http://192.168.1.22:8201/auth/v1',
  companyLicenceUrl: 'http://192.168.1.22:8036/auth/companylicences/v1',
  redirectionHomeUrl: '/',

  /************************* UPLOAD FILE ******************************/
  uploadFileApiUrl: 'http://192.168.1.22:8067',
  /************************* UPLOAD RESUME FILE ************************/
  uploadResumeFileApiUrl: 'http://127.0.0.1:8021/servicima/resumelist/v1',
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
