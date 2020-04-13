import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';

const mockAuth = {
  authState: null || {},
};

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule],
      providers: [
        AuthGuard,
        {
          provide: AngularFireAuth,
          useValue: mockAuth,
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/',
        },
      ],
    });
    mockAuth.authState = of({});
  });

  it('should reject when user is not logged into firebase', inject(
    [AuthGuard],
    (guard: AuthGuard) => {
      mockAuth.authState = of(null);
      return guard
        .canActivate()
        .pipe(
          tap(v => {
            expect(v.toString()).toEqual('/login');
          }),
        )
        .subscribe();
    },
  ));

  it('should allow when user is logged into firebase', inject(
    [AuthGuard],
    (guard: AuthGuard) => {
      return guard
        .canActivate()
        .pipe(
          tap(v => {
            expect(v).toEqual(true);
          }),
        )
        .subscribe();
    },
  ));
});
