import { createAction, props } from '@ngrx/store';
import { User, LoginRequest } from '../../models/user.model';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const loadUser = createAction('[Auth] Load User');
export const loadUserSuccess = createAction(
  '[Auth] Load User Success',
  props<{ user: User }>()
);
export const loadUserFailure = createAction(
  '[Auth] Load User Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const checkAuth = createAction(
  '[Auth] Check Auth'
);
