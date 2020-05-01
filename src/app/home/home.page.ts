import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, from } from 'rxjs';
import { flatMap, filter, map, tap } from 'rxjs/operators';

interface Item {
  name: string;
  id: number;
  returnValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  data$: BehaviorSubject<object> = new BehaviorSubject({});
  status$: BehaviorSubject<string> = new BehaviorSubject('not requested');
  constructor(private firestore: AngularFirestore) {}

  testApi() {
    const id = Math.random() * 20;
    from(
      this.firestore.collection<Item>('items').add({
        name: 'novi item',
        id,
        returnValue: null,
      }),
    )
      .pipe(
        tap(() => {
          this.status$.next('created document');
        }),
        flatMap(() =>
          this.firestore
            .collection<Item>('items', (ref) => ref.where('id', '==', id))
            .stateChanges(['modified']),
        ),
        map((evs) =>
          evs.find((docEvent) => docEvent.payload.doc.data().returnValue),
        ),
        filter((returnValue) => !!returnValue),
        tap((finalValue) => {
          this.status$.next('got response');
          this.data$.next(finalValue.payload.doc.data());
        }),
      )
      .subscribe();
  }

  stringify(object: any) {
    return JSON.stringify(object);
  }
}
