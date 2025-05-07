import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectIsLoggedIn } from '../store/auth/auth.selectors';
import { checkAuth, loadUser, loadUserSuccess } from '../store/auth/auth.actions';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

export const authGuard = () => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  console.log('AuthGuard activated');
  
  // まず直接トークンをチェック（より高速）
  const hasToken = !!authService.getToken();
  console.log('AuthGuard - token exists:', hasToken);
  
  if (!hasToken) {
    console.log('AuthGuard - no token, redirecting to login');
    router.navigate(['/login']);
    return false;
  }
  
  // トークンが存在する場合は、即座にアクセスを許可
  console.log('AuthGuard - token found, allowing access immediately');
  
  // バックグラウンドでユーザー情報の読み込みを開始
  store.dispatch(loadUser());
  
  // トークンがあれば常にtrueを返す
  return true;
};
