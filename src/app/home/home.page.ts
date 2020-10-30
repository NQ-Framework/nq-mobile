import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

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
  query: string;
  response: any;
  constructor(private httpClient: HttpClient) {}

  testApi() {
    this.httpClient
      .get(environment.apiUrl + '/work-order/sql?query=' + this.query)
      .subscribe((res) => {
        this.response = res;
      });
  }
}
