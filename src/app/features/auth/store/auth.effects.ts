import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import * as AuthActions from './auth.actions';

const TOKEN_KEY = 'smartdoc_token';
const USERNAME_KEY = 'smartdoc_username';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * POST /api/auth/login
   * switchMap: if user clicks login again quickly, cancels the previous request.
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map(({ token }) => {
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USERNAME_KEY, username);
            return AuthActions.loginSuccess({ token, username });
          }),
          catchError(err => {
            const msg = err?.error?.error ?? 'Login failed. Check credentials.';
            return of(AuthActions.loginFailure({ error: msg }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/app/chat']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USERNAME_KEY);
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
