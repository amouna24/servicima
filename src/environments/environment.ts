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
  taxApiUrl: 'http://192.168.1.22:8007/admin/taxes/v1',
  paymentTermsApiUrl: 'http://192.168.1.22:8008/admin/paymentterms/v1',
  loadAuthStarterDataApiUrl: 'http://192.168.1.22:8090/admin/loadauthstarterdata/v1',

  /************************** SERVICIMA **********************************/
  contractApiUrl: 'http://192.168.1.22:8060/servicima/contracts/v1',
  contractExtensionApiUrl: 'http://192.168.1.22:8061/servicima/contractextensions/v1',
  contractorApiUrl: 'http://192.168.1.22:8062/servicima/contractors/v1',
  contractorContactApiUrl: 'http://192.168.1.22:8063/servicima/contractorcontacts/v1',
  companyTaxApiUrl: 'http://192.168.1.22:8064/servicima/companytaxes/v1',
  companyPaymentTermsApiUrl: 'http://192.168.1.22:8065/servicima/companypaymentterms/v1',
  companyRoleFeaturesApiUrl: 'http://192.168.1.22:8037/auth/companyrolefeatures/v1',
  /************************* AUTHENTICATION ******************************/
  credentialsApiUrl: 'http://192.168.1.22:8030/auth/credentials/v1',
  userRoleApiUrl: 'http://192.168.1.22:8034/auth/userroles/v1',
  companyApiUrl: 'http://192.168.1.22:8035/auth/companies/v1',
  companyLicenceUrl: 'http://192.168.1.22:8036/auth/companylicences/v1',
  userApiUrl: 'http://192.168.1.22:8038/auth/users/v1',
  userGatewayApiUrl: 'http://192.168.1.22:8091/auth/v1',
  redirectionHomeUrl: '/',

  /************************* UPLOAD FILE ******************************/
  uploadFileApiUrl: 'http://192.168.1.22:8067',

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
