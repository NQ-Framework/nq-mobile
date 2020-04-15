import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private client: HttpClient, private config: ConfigService) {}
  testApi() {
    this.client.get(this.config.apiUrl + '/profile').subscribe({
      next: res => {
        console.log('stigao ', res);
      },
      error: er => {
        console.log('err', er);
      },
    });
  }
}
