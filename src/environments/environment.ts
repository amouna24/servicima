// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: 'local',
  translateApiURL: 'http://localhost:8006/translate',
  languageApiURL: 'http://localhost:8003/language',
  credentialsApiURL: 'http://localhost:8010/credentials',
  companyApiURL: 'http://localhost:8012/company',
  refDataApiUrl: 'http://localhost:8008/refdata',
  refTypeApiUrl: 'http://localhost:8000/reftype',
  applicationApiUrl: 'http://localhost:8007/application',
  loadAuthStarterDataApiUrl: 'http://localhost:8015/loadauthstarterdata',
  zipeCode: 'https://vicopo.selfbuild.fr/cherche',
  getUserInfosApiUrl: 'http://localhost:8016/getprofileinfos',
  userApiUrl: 'http://localhost:8013/user',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
