import { FirebaseOptions } from '@angular/fire';

export interface IEnvironment {
  firebaseConfig: FirebaseOptions;
  production: boolean;
  apiUrl: string;
}
