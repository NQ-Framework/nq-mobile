import { Injectable, Inject } from '@angular/core';
import { DevicePlugin, DeviceInfo } from '@capacitor/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { combineLatest, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceManagementService {
  constructor(
    @Inject('DevicePlugin') private device: DevicePlugin,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
  ) {}
  initializeDevice() {
    combineLatest([this.auth.authState, from(this.device.getInfo())]).subscribe(
      ([user, info]) => {
        if (!user) {
          this.unregisterDevice(user, info);
          return;
        }
        this.registerDevice(user, info);
      },
    );
  }
  unregisterDevice(user: firebase.User, info: DeviceInfo) {
    localStorage.removeItem('device_id');
    this.storeDeviceProfile(user.uid, info.uuid, {
      unregisteredAt: new Date(),
    });
  }

  registerDevice(user: firebase.User, info: DeviceInfo) {
    const existingId = localStorage.getItem('device_id');
    if (existingId && existingId === info.uuid) {
      return;
    }
    localStorage.setItem('device_id', info.uuid);
    this.storeDeviceProfile(user.uid, info.uuid, {
      name: info.name || info.model || info.operatingSystem || info.platform,
      platform: info.platform,
    });
  }

  private storeDeviceProfile(userId: string, deviceId: string, value: any) {
    this.firestore
      .collection(`users/${userId}/devices`)
      .doc(deviceId)
      .set(value, { merge: true });
  }
}
