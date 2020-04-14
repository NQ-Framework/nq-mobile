import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user$: Observable<firebase.User | 'none'>;
  error = '';
  public navigatingAway = false;
  public loginForm: FormGroup;
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private formBuilder: FormBuilder,
    private loading: LoadingController,
  ) {
    this.user$ = this.auth.authState.pipe(map((u) => (u ? u : 'none')));
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
    this.loginForm.valueChanges.subscribe(() => {
      this.error = '';
    });
  }
  ngOnInit() {}

  async loginUser(loginForm: FormGroup): Promise<void> {
    if (!loginForm.valid) {
      console.log('Form is not valid yet, current value:', loginForm.value);
      return;
    }
    this.error = '';

    const loading = await this.loading.create({
      message: 'Logovanje u toku',
      showBackdrop: true,
    });
    await loading.present();
    this.auth
      .signInWithEmailAndPassword(
        loginForm.value.email,
        loginForm.value.password,
      )
      .then((u) => {
        this.navigatingAway = true;
        this.router.navigate(['']).then(() => {
          this.navigatingAway = false;
        });
      })
      .catch((e) => {
        this.error = $localize`Error logging in. Please try again`;
        console.error(e);
      })
      .finally(async () => {
        await loading.dismiss();
      });
  }

  signOut() {
    this.auth.signOut();
  }

  isValidUser(user: firebase.User | 'none'): boolean {
    return user && user !== 'none';
  }
}
