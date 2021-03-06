// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  firebaseConfig: {
    apiKey: 'AIzaSyB4L2ujEtbLHKgzk1_LiDuM6UQO4M5NZkE',
    authDomain: 'nq-framework.firebaseapp.com',
    databaseURL: 'https://nq-framework.firebaseio.com',
    projectId: 'nq-framework',
    storageBucket: 'nq-framework.appspot.com',
    messagingSenderId: '384505471856',
    appId: '1:384505471856:web:3c58fbc64af47987ae65b5',
    measurementId: 'G-Y8DD2TBN8J',
  },
  // apiUrl: 'http://localhost:3000/v1',
  apiUrl: 'https://server.nqframework.com/v1',
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
