// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: 'local',
  translateApiURL: 'http://192.168.1.22:8006/admin/translates/v1',
  languageApiURL: 'http://192.168.1.22:8003/admin/languages/v1',
  credentialsApiURL: 'http://192.168.1.22:8010/auth/credentials/v1',
  companyApiURL: 'http://192.168.1.22:8012/auth/companies/v1',
  refDataApiUrl: 'http://192.168.1.22:8008/admin/refdatas/v1',
  refTypeApiUrl: 'http://192.168.1.22:8000/admin/reftypes/v1',
  applicationApiUrl: 'http://192.168.1.22:8007/admin/applications/v1',
  loadAuthStarterDataApiUrl: 'http://192.168.1.22:8015/admin/loadauthstarterdata/v1',
  licenceApiUrl: 'http://192.168.1.22:8020/auth/companylicence/v1',
  languageApiUrl: 'http://192.168.1.22:8003/admin/languages/v1',
  moduleApiUrl: 'http://192.168.1.22:8005/admin/modules/v1',
  userGatewayApiUrl: 'http://192.168.1.22:8016/auth/v1',
  zipeCodeApiUrl: 'https://vicopo.selfbuild.fr/cherche',
  applicationCode: 'SERVICIMA',
  userInfoApiUrl: 'http://192.168.1.22:8016/auth/v1',
  userApiUrl: 'http://192.168.1.22:8013/auth/users/v1',
  dataListsUrl: 'http://127.0.0.1:8036/admin/datalists/v1',
  redirectionHomeUrl: '/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
