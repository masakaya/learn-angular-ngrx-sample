import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectIsLoggedIn = createSelector(
  selectUser,
  selectToken,
  (user, token) => !!user && !!token
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
