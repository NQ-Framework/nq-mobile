import { Component } from '@angular/core';
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
  constructor() { }

  testApi() {
  }
}
