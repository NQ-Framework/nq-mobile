import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { DeviceManagementService } from './device-management.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { of, BehaviorSubject } from 'rxjs';

describe('DeviceManagementService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        {
          provide: 'DevicePlugin',
          useValue: jasmine.createSpyObj(['getInfo']),
        },
        {
          provide: AngularFirestore,
          useValue: jasmine.createSpyObj(['collection']),
        },
        {
          provide: AngularFireAuth,
          useValue: { authState: of(null) },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: DeviceManagementService = TestBed.inject(
      DeviceManagementService,
    );
    expect(service).toBeTruthy();
  });

  it('should register device on login, unregister on logout', fakeAsync(() => {
    const service: DeviceManagementService = TestBed.inject(
      DeviceManagementService,
    );

    const device: any = TestBed.inject('DevicePlugin' as any);
    device.getInfo.and.returnValue(
      Promise.resolve({
        uuid: 'device id',
        name: 'a device',
        platform: 'mobile',
      }),
    );

    const firestore: any = TestBed.inject(AngularFirestore);
    const setSpy = jasmine.createSpyObj(['set']);
    const docSpy = jasmine.createSpyObj(['doc']);
    docSpy.doc.and.returnValue(setSpy);
    firestore.collection.and.returnValue(docSpy);

    const auth: any = TestBed.inject(AngularFireAuth);
    auth.authState = new BehaviorSubject({ uid: 'user id' });

    localStorage.removeItem('device_id');

    service.initializeDevice();

    tick();

    expect(localStorage.getItem('device_id')).toBe('device id');
    expect(firestore.collection).toHaveBeenCalledWith('users/user id/devices');
    expect(docSpy.doc).toHaveBeenCalledWith('device id');
    expect(setSpy.set).toHaveBeenCalledWith(
      { name: 'a device', platform: 'mobile' },
      { merge: true },
    );

    firestore.collection.calls.reset();
    docSpy.doc.calls.reset();
    auth.authState.next(null);
    tick();
    expect(localStorage.getItem('device_id')).toEqual(null);
    expect(firestore.collection).toHaveBeenCalledWith('users/user id/devices');
    expect(docSpy.doc).toHaveBeenCalledWith('device id');
  }));

  it('should not register device if id present in local storage', fakeAsync(() => {
    const service: DeviceManagementService = TestBed.inject(
      DeviceManagementService,
    );

    const device: any = TestBed.inject('DevicePlugin' as any);
    device.getInfo.and.returnValue(
      Promise.resolve({
        uuid: 'device id',
        name: 'a device',
        platform: 'mobile',
      }),
    );

    const firestore: any = TestBed.inject(AngularFirestore);

    const auth: any = TestBed.inject(AngularFireAuth);
    auth.authState = of({ uid: 'user id' });

    localStorage.setItem('device_id', 'device id');

    service.initializeDevice();

    tick();

    expect(localStorage.getItem('device_id')).toBe('device id');
    expect(firestore.collection).toHaveBeenCalledTimes(0);
  }));
});
