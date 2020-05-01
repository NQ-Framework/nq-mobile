import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, mergeMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { ConfigService } from './config.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private auth: AngularFireAuth, private config: ConfigService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(this.config.apiUrl)) {
      return next.handle(req);
    }
    return this.auth.authState.pipe(
      first(),
      mergeMap((user) => {
        if (!user) {
          throw new Error(
            'Cannot authenticate to API without a signed in user!',
          );
        }
        return user.getIdToken();
      }),
      mergeMap((token) => {
        return next.handle(
          req.clone({
            setHeaders: {
              authorization: `Bearer ${token}`,
            },
          }),
        );
      }),
    );
  }
}
