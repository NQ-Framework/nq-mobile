import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import {
  PushNotification,
  PushNotificationActionPerformed,
  Capacitor,
  PluginListenerHandle,
  PushNotificationsPlugin,
} from '@capacitor/core';
import { FCM } from 'capacitor-fcm';
import { AngularFirestore } from '@angular/fire/firestore';
import { Inject } from '@angular/core';

interface FSUser {
  fcmToken: string;
}

let listenerNotification: PluginListenerHandle;
let listenerAction: PluginListenerHandle;

@Injectable({
  providedIn: 'root',
})
export class PushNotificationsService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private fcm: FCM,
    @Inject('PushNotificationsPlugin')
    private pushNotifications: PushNotificationsPlugin,
  ) {}

  initialize() {
    if (Capacitor.platform === 'web') {
      return;
    }
    this.auth.authState.subscribe((user) => {
      if (!user) {
        if (listenerAction) {
          listenerAction.remove();
        }
        if (listenerNotification) {
          listenerNotification.remove();
        }
        this.fcm.deleteInstance();
        localStorage.removeItem('written_fcm_token');
        return;
      }

      this.pushNotifications
        .register()
        .then(() => {
          this.fcm
            .subscribeTo({ topic: 'test' })
            .then(() => {
              console.log('subscribed to topic test');
            })
            .catch((err) => console.error('error subscribing ', err));
          this.fcm.getToken().then((t) => {
            const writtenToken = localStorage.getItem('written_fcm_token');
            if (!writtenToken || writtenToken !== t.token) {
              this.firestore
                .collection<FSUser>('users')
                .doc(user.uid)
                .set({ fcmToken: t.token }, { merge: true })
                .then(() => {
                  localStorage.setItem('written_fcm_token', t.token);
                })
                .catch((err) => console.error('oh noes ', err));
            }
          });
          listenerNotification = this.pushNotifications.addListener(
            'pushNotificationReceived',
            (notification: PushNotification) => {
              alert('Push received: ' + JSON.stringify(notification));
            },
          );

          listenerAction = this.pushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification: PushNotificationActionPerformed) => {
              alert('Push action performed: ' + JSON.stringify(notification));
            },
          );
        })
        .catch((err) => alert(JSON.stringify(err)));
    });
  }
}
