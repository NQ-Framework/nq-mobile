import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { InterceptorService } from './interceptor.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ConfigService } from './config.service';

let httpMock: HttpTestingController;
let http: HttpClient;
let config: ConfigService;

const mockAuth: any = {};

describe('InterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: mockAuth,
        },
        {
          provide: ConfigService,
          useValue: { apiUrl: 'the api url' },
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: InterceptorService,
          multi: true,
        },
        InterceptorService,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    config = TestBed.inject(ConfigService);
    mockAuth.authState = of({
      getIdToken: () => {
        return Promise.resolve('test token');
      },
    });
  });

  it('should be created', () => {
    const service: InterceptorService = TestBed.inject(InterceptorService);
    expect(service).toBeTruthy();
  });

  it('should not touch non api url routes', () => {
    http.get('non api url').subscribe();
    const response = httpMock.expectOne('non api url');
    expect(response.request.headers.has('token')).toEqual(false);
  });

  it('should inject token for api url routes', fakeAsync(() => {
    http.get(config.apiUrl).subscribe();
    tick();
    const response = httpMock.expectOne(config.apiUrl);
    expect(response.request.headers.has('authorization')).toEqual(true);
  }));

  it('should throw an error when there is no user for api url', fakeAsync(() => {
    mockAuth.authState = of(null);
    expect(() => {
      http.get(config.apiUrl).subscribe();
      tick();
    }).toThrowError('Cannot authenticate to API without a signed in user!');
  }));
});
