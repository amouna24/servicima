// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: 'local',
  translateApiURL: 'http://localhost:8006/admin/translates/v1',
  languageApiURL: 'http://localhost:8003/admin/languages/v1',
  credentialsApiURL: 'http://localhost:8010/auth/credentials/v1',
  companyApiURL: 'http://localhost:8012/auth/companies/v1',
  refDataApiUrl: 'http://localhost:8008/admin/refdatas/v1',
  refTypeApiUrl: 'http://localhost:8000/admin/reftypes/v1',
  applicationApiUrl: 'http://localhost:8007/admin/applications/v1',
  loadAuthStarterDataApiUrl: 'http://localhost:8015/admin/loadauthstarterdata/v1',
  zipeCode: 'https://vicopo.selfbuild.fr/cherche',
  userInfoApiUrl: 'http://localhost:8016/auth/v1',
  userApiUrl: 'http://localhost:8013/auth/users/v1',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
