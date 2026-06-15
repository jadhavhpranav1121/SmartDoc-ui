import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  token: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  token: null,
  username: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { token, username }) => ({
    ...state,
    token,
    username,
    loading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthActions.logout, () => ({
    ...initialAuthState
  })),

  on(AuthActions.restoreSession, (state, { token, username }) => ({
    ...state,
    token,
    username
  }))
);
