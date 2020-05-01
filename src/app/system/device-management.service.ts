import { Injectable, Inject } from '@angular/core';
import { DevicePlugin, DeviceInfo } from '@capacitor/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { combineLatest, from } from 'rxjs';
import { share, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeviceManagementService {
  states;
  constructor(
    @Inject('DevicePlugin') private device: DevicePlugin,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
  ) {
    if (this.device.getInfo()) {
      this.setupStatesObservable();
    }
  }
  private setupStatesObservable() {
    this.states = combineLatest([
      this.auth.authState,
      from(this.device.getInfo()),
    ]).pipe(share());
  }

  updateRegistrationOnSignIn() {
    if (!this.states) {
      this.setupStatesObservable();
    }
    this.states.subscribe(([user, info]) => {
      if (!user) {
        return;
      }
      this.registerUserAndDeviceInfo(user, info);
    });
  }
  unregister(): Promise<boolean> {
    this.setupStatesObservable();
    const promise = new Promise<boolean>((resolve, reject) => {
      this.states.pipe(first()).subscribe(([user, info]) => {
        if (!user) {
          resolve(false);
          return;
        }
        this.unregisterUserAndDeviceInfo(user, info).then((b) => {
          resolve(b);
        });
      });
    });
    return promise;
  }
  unregisterUserAndDeviceInfo(
    user: firebase.User,
    info: DeviceInfo,
  ): Promise<boolean> {
    localStorage.removeItem('device_id');
    return this.storeDeviceProfile(user.uid, info.uuid, {
      unregisteredAt: new Date(),
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  registerUserAndDeviceInfo(user: firebase.User, info: DeviceInfo) {
    const existingId = localStorage.getItem('device_id');
    if (existingId && existingId === info.uuid) {
      this.storeDeviceProfile(user.uid, info.uuid, {
        lastOnlineDate: new Date(),
      });
      return;
    }
    localStorage.setItem('device_id', info.uuid);
    this.storeDeviceProfile(user.uid, info.uuid, {
      name: this.getDeviceName(info),
      platform: this.getDevicePlatform(info),
      model: this.getDeviceModel(info),
      registeredAt: new Date(),
      lastOnlineDate: new Date(),
      unregisteredAt: null,
    });
  }

  getDeviceModel(info: DeviceInfo) {
    return info.model || 'unknown';
  }
  getDevicePlatform(info: DeviceInfo) {
    return info.platform || 'unknown';
  }

  getDeviceName(info: DeviceInfo) {
    return (
      info.name ||
      info.model ||
      info.operatingSystem ||
      info.platform ||
      'unknown'
    );
  }

  private storeDeviceProfile(
    userId: string,
    deviceId: string,
    value: any,
  ): Promise<void> {
    return this.firestore
      .collection(`users/${userId}/devices`)
      .doc(deviceId)
      .set(value, { merge: true });
  }
}
