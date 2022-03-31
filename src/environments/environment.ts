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
  contractApiUrl: 'http://213.136.74.202/contracts',
  contractExtensionApiUrl: 'http://213.136.74.202/contractextensions',
  contractProjectApiUrl: 'http://213.136.74.202/contractproject',

  contractorApiUrl: 'http://213.136.74.202/contractors',
  contractorContactApiUrl: 'http://213.136.74.202/contractorcontacts',
  companyTaxApiUrl: 'http://213.136.74.202/companytaxes',
  collaboratorApiUrl: 'http://213.136.74.202/collaborators',
  companyLicenceApiUrl: 'http://213.136.74.202/companylicences',
  companyLicenceUrl: 'http://213.136.74.202/companylicences',
  companyPaymentTermsApiUrl: 'http://213.136.74.202/companypaymentterms',
  companyRoleFeaturesApiUrl: 'http://213.136.74.202/companyrolefeatures',
  companyTimesheetSettingApiUrl: 'http://213.136.74.202/companytimesheetsetting',
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
  bankingApiUrl: 'http://213.136.74.202/hrbanking',
  childApiUrl: 'http://213.136.74.202/hrchild',
  emergencyContactApiUrl: 'http://213.136.74.202/hremergencycontact',
  equipmentApiUrl: 'http://213.136.74.202/hrequipment',
  evaluationApiUrl: 'http://213.136.74.202/hrevaluation',
  evaluationGoalApiUrl: 'http://213.136.74.202/hrevaluationgoals',
  identityDocumentApiUrl: 'http://213.136.74.202/hridentitydocument',
  payslipApiUrl: 'http://213.136.74.202/payslip',
  hrContractApiUrl: 'http://213.136.74.202/hrcontract',
  hrContractExtension: 'http://213.136.74.202/hrcontractextension',
  hrPreviousContractApiUrl: 'http://213.136.74.202/hrcontractprevious',
  workCertificateApiUrl: 'http://213.136.74.202/hrworkcertificate',
  payslipAssociateApiUrl: 'http://213.136.74.202/payslip',
  workCertificateUrl: 'http://213.136.74.202/hrworkcertificate',
  hrTrainingApiUrl: 'http://localhost:8113/servicima/training/v1',
  hrTrainingRequestApiUrl: 'http://213.136.74.202/hrtrainingrequest',
  // hrTrainingSessionWeekApiUrl: 'http://213.136.74.202/trainingsessionweek',
  hrTrainingSessionWeekApiUrl: 'http://localhost:8115/servicima/trainingsessionweek/v1',
 // hrTrainingInviteCollaboratorApiUrl: 'http://213.136.74.202/hrtraininginvitecollaborator',
  hrTrainingInviteCollaboratorApiUrl: 'http://localhost:8116/servicima/traininginvitecollaborator/v1',
  invoiceGenerateApiUrl: 'http://213.136.74.202/generateinv',
  invoiceLineApiUrl: 'http://213.136.74.202/invoiceline',
  invoiceHeaderApiUrl: 'http://213.136.74.202/invoiceheader',
  invoicePaymentApiUrl: 'http://213.136.74.202/invoicepayment',
  invoiceAttachmentApiUrl: 'http://213.136.74.202/invoiceattachment',
  companyBankingInfoApiUrl: 'http://213.136.74.202/companybankinginfo',
  timesheetApiUrl: 'http://213.136.74.202/timesheet',
  timesheetHolidayApiUrl: 'http://213.136.74.202/timesheetholiday',
  testChoicesApiUrl: 'http://213.136.74.202/testchoices',
  testQuestionApiUrl: 'http://213.136.74.202/testquestion',
  testQuestionBlocApiUrl: 'http://213.136.74.202/testquestionbloc',
  testTechnologiesApiUrl: 'http://213.136.74.202/testtechnology',
  testSkillsApiUrl: 'http://213.136.74.202/testskills',
  testTechnologySkillsApiUrl: 'http://213.136.74.202/testtechnologyskill',
  testSessionInfoApiUrl: 'http://213.136.74.202/testsessioninfo',
  testLevelApiUrl: 'http://213.136.74.202/testlevel',
  testCandidateResponseApiUrl: 'http://213.136.74.202/testcandidateresponse',
  testCandidateResultApiUrl: 'http://213.136.74.202/testcandidateresult',
  testSessionQuestionsApiUrl: 'http://213.136.74.202/testsessionquestions',
  testInviteCandidatesApiUrl: 'http://213.136.74.202/testinvitecandidates',
  testSessionApiUrl: 'http://213.136.74.202/testsession',
  projectCollaboratorApiUrl: 'http://213.136.74.202/projectcollaborator',
  linkedInOauthApiUrl: 'http://213.136.74.202/socialnetwork',
  servicimaUrl: 'http://localhost:4200',
  /************************* AUTHENTICATION ******************************/
  credentialsApiUrl: 'http://213.136.74.202/credentials',
  mailingApiUrl: 'http://213.136.74.202/mailing',
  userRoleApiUrl: 'http://213.136.74.202/userroles',
  companyApiUrl: 'http://213.136.74.202/companies',
  userApiUrl: 'http://213.136.74.202/users',
  userGatewayApiUrl: 'http://213.136.74.202/usergatway',
  redirectionHomeUrl: '/',

  /************************* UPLOAD FILE ******************************/
  uploadFileApiUrl: 'http://213.136.74.202/uploadfiles',
  /************************* UPLOAD RESUME FILE ************************/
  uploadResumeFileApiUrl: 'http://213.136.74.202/uploadresumefile',
  /*************************** OTHERS ************************************/
  zipCodeApiUrl: 'https://vicopo.selfbuild.fr/cherche',
  applicationCode: 'SERVICIMA',
  cryptoKeyCode: 'RfUjXn2r'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
