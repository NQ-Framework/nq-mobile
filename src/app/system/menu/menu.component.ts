import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Menu } from './menu.model';
import { BehaviorSubject, from } from 'rxjs';
import { loggedOutMenu } from './loggedOutMenu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menu$ = new BehaviorSubject<Menu[]>([]);
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {}

  ngOnInit() {
    this.trackUserMenuOptions();
  }

  trackUserMenuOptions() {
    this.auth.authState.subscribe((user) => {
      console.log(user);
      if (!user) {
        loggedOutMenu.sort((a, b) => a.order - b.order);
        this.menu$.next(loggedOutMenu);
        return;
      }

      const fromStorage = localStorage.getItem('menu_structure');
      if (fromStorage) {
        this.menu$.next(JSON.parse(fromStorage));
      }
      this.firestore
        .collection<Menu>('menu')
        .valueChanges()
        .subscribe((menu) => {
          if (menu && menu.length) {
            localStorage.setItem('menu_structure', JSON.stringify(menu));
            menu.sort((a, b) => a.order - b.order);
            this.menu$.next(menu);
          }
        });
    });
  }

  getText(item: Menu): string {
    return Menu.getText(item);
  }
}
