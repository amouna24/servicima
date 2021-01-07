// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: 'local',
  /************************** ADMINISTRATION *****************************/
  translateApiUrl: 'http://192.168.1.22:8006/admin/translates/v1',
  languageApiUrl: 'http://192.168.1.22:8003/admin/languages/v1',
  refDataApiUrl: 'http://192.168.1.22:8008/admin/refdatas/v1',
  refTypeApiUrl: 'http://192.168.1.22:8000/admin/reftypes/v1',
  applicationApiUrl: 'http://192.168.1.22:8007/admin/applications/v1',
  loadAuthStarterDataApiUrl: 'http://192.168.1.22:8015/admin/loadauthstarterdata/v1',
  moduleApiUrl: 'http://192.168.1.22:8005/admin/modules/v1',
  dataListsUrl: 'http://192.168.1.22:8037/admin/datalists/v1',
  taxApiUrl: 'http://192.168.1.22:8035/admin/taxes/v1',
  paymentTermsApiUrl: 'http://192.168.1.22:8032/admin/paymentterms/v1',

  /************************** SERVICIMA **********************************/
  contractApiUrl: 'http://192.168.1.22:8030/servicima/contracts/v1',
  contractExtensionApiUrl: 'http://192.168.1.22:3031/servicima/contractextensions/v1',
  contractorApiUrl: 'http://192.168.1.22:8028/servicima/contractors/v1',
  contractorContactApiUrl: 'http://192.168.1.22:8075/servicima/contractorcontacts/v1',
  companyTaxApiUrl: 'http://192.168.1.22:8036/servicima/companytaxes/v1',
  companyPaymentTermsApiUrl: 'http://192.168.1.22:8033/servicima/companypaymentterms/v1',

  /************************* AUTHENTICATION ******************************/
  credentialsApiUrl: 'http://192.168.1.22:8010/auth/credentials/v1',
  companyApiUrl: 'http://192.168.1.22:8012/auth/companies/v1',
  companyLicenceUrl: 'http://192.168.1.22:8020/auth/companylicences/v1',
  userGatewayApiUrl: 'http://192.168.1.22:8016/auth/v1',
  userApiUrl: 'http://192.168.1.22:8013/auth/users/v1',
  userRoleApiUrl: 'http://192.168.1.22:8025/auth/userroles/v1',
  redirectionHomeUrl: '/',

  /************************* UPLOAD FILE ******************************/
  uploadFileApiUrl: 'http://192.168.1.22:8065',

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
