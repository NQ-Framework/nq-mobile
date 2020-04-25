import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IEnvironment } from '../../environments/environment.interface';
import { FirebaseOptions } from '@angular/fire';

@Injectable({
  providedIn: 'root',
})
export class ConfigService implements IEnvironment {
  constructor() {
    this.apiUrl = environment.apiUrl;
    this.firebaseConfig = environment.firebaseConfig;
    this.production = environment.production;
  }
  apiUrl: string;
  firebaseConfig: FirebaseOptions;
  production: boolean;
}
