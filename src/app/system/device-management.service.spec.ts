import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { DeviceManagementService } from './device-management.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { of, BehaviorSubject } from 'rxjs';
import { DeviceInfo } from '@capacitor/core';

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
    const device: any = TestBed.inject('DevicePlugin' as any);
    device.getInfo.and.returnValue(
      Promise.resolve({
        uuid: 'device id',
        name: 'a device',
        platform: 'mobile',
      }),
    );
    const service: DeviceManagementService = TestBed.inject(
      DeviceManagementService,
    );
    expect(service).toBeTruthy();
  });

  it('should register device on login', fakeAsync(() => {
    const device: any = TestBed.inject('DevicePlugin' as any);
    device.getInfo.and.returnValue(
      Promise.resolve({
        uuid: 'device id',
        name: 'a device',
        platform: 'mobile',
        model: 'a model',
      }),
    );

    const auth: any = TestBed.inject(AngularFireAuth);
    auth.authState = new BehaviorSubject({ uid: 'user id' });

    const service: DeviceManagementService = TestBed.inject(
      DeviceManagementService,
    );

    const firestore: any = TestBed.inject(AngularFirestore);
    const setSpy = jasmine.createSpyObj(['set']);
    const docSpy = jasmine.createSpyObj(['doc']);
    docSpy.doc.and.returnValue(setSpy);
    firestore.collection.and.returnValue(docSpy);

    localStorage.removeItem('device_id');

    service.updateRegistrationOnSignIn();

    tick();

    expect(localStorage.getItem('device_id')).toBe('device id');
    expect(firestore.collection).toHaveBeenCalledWith('users/user id/devices');
    expect(docSpy.doc).toHaveBeenCalledWith('device id');
    expect(setSpy.set).toHaveBeenCalledWith(
      {
        name: 'a device',
        platform: 'mobile',
        registeredAt: jasmine.any(Date),
        lastOnlineDate: jasmine.any(Date),
        model: 'a model',
        unregisteredAt: null,
      },
      { merge: true },
    );

    firestore.collection.calls.reset();
    docSpy.doc.calls.reset();
  }));

  it('should update login time register device if id present in local storage', fakeAsync(() => {
    const device: any = TestBed.inject('DevicePlugin' as any);
    device.getInfo.and.returnValue(
      Promise.resolve({
        uuid: 'device id',
        name: 'a device',
        platform: 'mobile',
      }),
    );

    const auth: any = TestBed.inject(AngularFireAuth);
    auth.authState = new BehaviorSubject({ uid: 'user id' });

    const service: DeviceManagementService = TestBed.inject(
      DeviceManagementService,
    );

    const firestore: any = TestBed.inject(AngularFirestore);
    const setSpy = jasmine.createSpyObj(['set']);
    const docSpy = jasmine.createSpyObj(['doc']);
    docSpy.doc.and.returnValue(setSpy);
    firestore.collection.and.returnValue(docSpy);

    localStorage.setItem('device_id', 'device id');

    service.updateRegistrationOnSignIn();

    tick();

    expect(localStorage.getItem('device_id')).toBe('device id');
    expect(firestore.collection).toHaveBeenCalledWith('users/user id/devices');
    expect(docSpy.doc).toHaveBeenCalledWith('device id');
    expect(setSpy.set).toHaveBeenCalledWith(
      {
        lastOnlineDate: jasmine.any(Date),
      },
      { merge: true },
    );
  }));

  it('should clean up when calling unregister', fakeAsync(() => {
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
    const auth: any = TestBed.inject(AngularFireAuth);
    auth.authState = new BehaviorSubject({ uid: 'user id' });

    const firestore: any = TestBed.inject(AngularFirestore);
    const setSpy = jasmine.createSpyObj(['set']);
    setSpy.set.and.returnValue(Promise.resolve());
    const docSpy = jasmine.createSpyObj(['doc']);
    docSpy.doc.and.returnValue(setSpy);
    firestore.collection.and.returnValue(docSpy);

    localStorage.setItem('device_id', 'device id');

    service.unregister();

    tick();

    expect(localStorage.getItem('device_id')).toBe(null);
    expect(firestore.collection).toHaveBeenCalledWith('users/user id/devices');
    expect(docSpy.doc).toHaveBeenCalledWith('device id');
    expect(setSpy.set).toHaveBeenCalledWith(
      {
        unregisteredAt: jasmine.any(Date),
      },
      { merge: true },
    );
  }));

  it('should do nothing when calling register without a logged in user', fakeAsync(() => {
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
    const auth: any = TestBed.inject(AngularFireAuth);
    auth.authState = new BehaviorSubject(null);

    const firestore: any = TestBed.inject(AngularFirestore);

    service.updateRegistrationOnSignIn();

    tick();

    expect(firestore.collection).toHaveBeenCalledTimes(0);
  }));

  it('should do nothing  calling unregister without a logged in user', fakeAsync(() => {
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
    const auth: any = TestBed.inject(AngularFireAuth);
    auth.authState = new BehaviorSubject(null);

    const firestore: any = TestBed.inject(AngularFirestore);

    service.unregister();

    tick();

    expect(firestore.collection).toHaveBeenCalledTimes(0);
  }));

  it('should pull out best name possible from given device info', () => {
    const deviceInfo: Partial<DeviceInfo> = {
      uuid: 'device id',
      name: 'a device',
      model: 'model id',
      operatingSystem: 'android',
      platform: 'android',
    };
    const service: DeviceManagementService = TestBed.inject(
      DeviceManagementService,
    );
    expect(service.getDeviceName(deviceInfo as DeviceInfo)).toBe('a device');
    deviceInfo.name = null;
    expect(service.getDeviceName(deviceInfo as DeviceInfo)).toBe('model id');
    deviceInfo.model = null;
    expect(service.getDeviceName(deviceInfo as DeviceInfo)).toBe('android');
    deviceInfo.operatingSystem = null;
    expect(service.getDeviceName(deviceInfo as DeviceInfo)).toBe('android');
    deviceInfo.platform = null;
    expect(service.getDeviceName(deviceInfo as DeviceInfo)).toBe('unknown');
  });

  it('should get platform from device info', () => {
    const deviceInfo: Partial<DeviceInfo> = {
      platform: 'android',
    };
    const service: DeviceManagementService = TestBed.inject(
      DeviceManagementService,
    );
    expect(service.getDevicePlatform(deviceInfo as DeviceInfo)).toBe('android');
    deviceInfo.platform = null;
    expect(service.getDevicePlatform(deviceInfo as DeviceInfo)).toBe('unknown');
  });
  it('should get model from device info', () => {
    const deviceInfo: Partial<DeviceInfo> = {
      model: 'a model',
    };
    const service: DeviceManagementService = TestBed.inject(
      DeviceManagementService,
    );
    expect(service.getDeviceModel(deviceInfo as DeviceInfo)).toBe('a model');
    deviceInfo.model = null;
    expect(service.getDeviceModel(deviceInfo as DeviceInfo)).toBe('unknown');
  });
});
