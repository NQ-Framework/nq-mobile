import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private router: Router) {}
  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.authState.pipe(
      map((user) => {
        return user ? true : this.router.parseUrl('login');
      }),
    );
  }
}
