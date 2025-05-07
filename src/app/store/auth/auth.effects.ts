import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('AuthEffects initialized');
  }

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      tap(action => console.log('Login action received:', action)),
      switchMap(({ credentials }) => {
        console.log('Processing login for:', credentials.email);
        return this.authService.login(credentials).pipe(
          tap(response => console.log('Login API response:', response)),
          map(response => {
            console.log('Dispatching loginSuccess with token:', response.api_token);
            return AuthActions.loginSuccess({ token: response.api_token });
          }),
          catchError(error => {
            console.error('Login error:', error);
            return of(AuthActions.loginFailure({ error: error.message || 'ログイン失敗' }));
          })
        );
      })
    );
  });

  loadUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadUser),
      tap(() => console.log('Load user action received')),
      switchMap(() => {
        try {
          const token = this.authService.getToken();
          console.log('Load user - token exists:', !!token);
          
          if (token) {
            // 実際のアプリケーションではAPIリクエストを使用
            const mockUser = {
              id: 1,
              name: 'テストユーザー'
            };
            console.log('Created mock user:', mockUser);
            return of(AuthActions.loadUserSuccess({ user: mockUser }));
          } else {
            console.log('No token for loading user');
            return of(AuthActions.loadUserFailure({ error: '認証されていません' }));
          }
        } catch (error) {
          console.error('loadUser effect error:', error);
          return of(AuthActions.loadUserFailure({ error: '認証エラー' }));
        }
      })
    );
  });

  loginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(action => {
        console.log('Login success action received with token:', action.token);
        try {
          console.log('Navigating to /todo from loginSuccess');
          this.router.navigate(['/todo']);
        } catch (error) {
          console.error('Navigation error in loginSuccess:', error);
        }
      })
    );
  }, { dispatch: false });

  // ユーザー情報のロード成功時にナビゲーション
  loadUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadUserSuccess),
      take(1), // 無限ループを防ぐ
      tap(action => {
        try {
          console.log('User loaded successfully:', action.user);
          console.log('Current router URL:', this.router.url);
          
          // ログイン画面またはルートURLの場合のみリダイレクト
          if (this.router.url === '/login' || this.router.url === '/') {
            console.log('Navigating to /todo from loadUserSuccess');
            this.router.navigate(['/todo']);
          } else {
            console.log('Not navigating, current URL is:', this.router.url);
          }
        } catch (error) {
          console.error('loadUserSuccess effect navigation error:', error);
        }
      })
    );
  }, { dispatch: false });

  // 認証チェック
  checkAuth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      tap(() => console.log('Check auth action received')),
      map(() => {
        try {
          const token = this.authService.getToken();
          console.log('Check auth - token exists:', !!token);
          
          if (token) {
            return AuthActions.loadUser();
          } else {
            return AuthActions.logout();
          }
        } catch (error) {
          console.error('checkAuth effect error:', error);
          return AuthActions.logout();
        }
      })
    );
  });

  // ログアウト処理
  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        try {
          console.log('Logout action received');
          this.authService.logout();
          console.log('Navigating to /login');
          this.router.navigate(['/login']);
        } catch (error) {
          console.error('Logout effect error:', error);
        }
      })
    );
  }, { dispatch: false });
}
