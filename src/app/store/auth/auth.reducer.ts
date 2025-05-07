import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { token }) => ({
    ...state,
    token,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.logout, () => initialState)
);
