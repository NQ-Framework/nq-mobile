import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PushNotificationsService } from './push-notifications.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Capacitor, PushNotificationsPlugin } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';
import { FCM } from 'capacitor-fcm';

const spyAlert = jasmine.createSpy();
const spyAction = jasmine.createSpy();
describe('PushNotificationsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PushNotificationsService,
        {
          provide: AngularFireAuth,
          useValue: { authState: new BehaviorSubject({ uid: 'test user id' }) },
        },
        {
          provide: AngularFirestore,
          useValue: {
            collection: () => {},
          },
        },
        {
          provide: FCM,
          useValue: {
            subscribeTo: () => {},
            getToken: () => {},
            deleteInstance: () => {},
          },
        },
        {
          provide: 'PushNotificationsPlugin',
          useValue: {
            register: jasmine
              .createSpy()
              .and.returnValue(Promise.resolve(true)),
            addListener: event => {
              if (event === 'pushNotificationReceived') {
                return { remove: spyAlert };
              }
              return { remove: spyAction };
            },
          },
        },
      ],
    }),
  );

  beforeEach(() => {
    Capacitor.platform = 'mobile';
  });

  it('should be created', () => {
    const service: PushNotificationsService = TestBed.inject(
      PushNotificationsService,
    );
    expect(service).toBeTruthy();
  });

  it('should not initialize on web', fakeAsync(() => {
    Capacitor.platform = 'web';
    const service: PushNotificationsService = TestBed.inject(
      PushNotificationsService,
    );
    const pushNotifications = TestBed.inject<PushNotificationsPlugin>(
      'PushNotificationsPlugin' as any,
    );

    service.initialize();
    expect(pushNotifications.register).toHaveBeenCalledTimes(0);
    tick();
  }));

  it('should initialize on mobile', fakeAsync(() => {
    const service: PushNotificationsService = TestBed.inject(
      PushNotificationsService,
    );
    // tslint:disable-next-line: deprecation
    const pushNotifications = TestBed.get('PushNotificationsPlugin');

    const fireAuth = TestBed.inject(AngularFireAuth);

    const firestore = TestBed.inject(AngularFirestore);

    const firestoreSetSpy = jasmine
      .createSpy()
      .and.returnValue(Promise.resolve());

    const firestoreDocSpy = jasmine
      .createSpy()
      .and.returnValue({ set: firestoreSetSpy } as any);
    const firestoreCollectionSpy = spyOn(
      firestore,
      'collection',
    ).and.returnValue({ doc: firestoreDocSpy } as any);

    const fcm = TestBed.inject(FCM);

    const fcmDeleteInstanceSpy = spyOn(fcm, 'deleteInstance');
    const fcmSubscribeToSpy = spyOn(fcm, 'subscribeTo').and.returnValue(
      Promise.resolve({ message: 'success' }),
    );
    const fcmGetTokenSpy = spyOn(fcm, 'getToken').and.returnValue(
      Promise.resolve({ token: 'fcm token' }),
    );

    const addListenerSpy = spyOn(pushNotifications, 'addListener');
    localStorage.removeItem('written_fcm_token');

    service.initialize();
    tick();
    expect(fcmDeleteInstanceSpy).toHaveBeenCalledTimes(0);
    expect(pushNotifications.register).toHaveBeenCalledTimes(1);
    expect(fcmSubscribeToSpy).toHaveBeenCalledTimes(1);
    expect(fcmSubscribeToSpy).toHaveBeenCalledWith({ topic: 'test' });
    expect(fcmGetTokenSpy).toHaveBeenCalledTimes(1);
    expect(firestoreCollectionSpy).toHaveBeenCalledTimes(1);
    expect(firestoreDocSpy).toHaveBeenCalledTimes(1);
    expect(firestoreDocSpy).toHaveBeenCalledWith('test user id');
    expect(firestoreSetSpy).toHaveBeenCalledTimes(1);
    expect(firestoreSetSpy).toHaveBeenCalledWith(
      { fcmToken: 'fcm token' },
      { merge: true },
    );
    expect(localStorage.getItem('written_fcm_token')).toBe('fcm token');

    expect(addListenerSpy).toHaveBeenCalledTimes(2);

    ((fireAuth.authState as any) as BehaviorSubject<{ uid: string }>).next(
      null,
    );
    tick();

    expect(fcmDeleteInstanceSpy).toHaveBeenCalledTimes(1);
    expect(pushNotifications.register).toHaveBeenCalledTimes(1); // no additional calls
    expect(fcmSubscribeToSpy).toHaveBeenCalledTimes(1); // no additional calls
    expect(localStorage.getItem('written_fcm_token')).toBe(null);
  }));
});
