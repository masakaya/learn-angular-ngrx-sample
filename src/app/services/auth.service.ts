import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, switchMap } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    console.log('AuthService initialized');
    // Check if token exists in cookie on initialization
    this.checkToken();
  }

  get currentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.currentUser.pipe(
      switchMap(user => of(!!user))
    );
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Login attempt with:', credentials.email);
    // 開発環境ではモックログインを使用
    return this.mockLogin(credentials);

    // 本番環境では実際のAPIを呼び出す
    // return this.http.post<LoginResponse>('/api/login', credentials).pipe(
    //   tap(response => {
    //     if (response && response.api_token) {
    //       this.setToken(response.api_token);
    //       this.loadUserProfile();
    //     }
    //   }),
    //   catchError(error => {
    //     console.error('Login failed:', error);
    //     throw error;
    //   })
    // );
  }

  // モックログイン実装（開発用）
  private mockLogin(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Using mock login with credentials:', credentials);
    
    // 簡易的な認証ロジック
    if (credentials.email && credentials.password) {
      // レスポンスを即座に返さずに少し遅延させる（APIリクエストのシミュレーション）
      return new Observable<LoginResponse>(observer => {
        console.log('Creating mock login response');
        
        setTimeout(() => {
          try {
            const response: LoginResponse = {
              api_token: 'mock_token_' + Date.now()
            };
            
            // トークンをCookieに保存
            this.setToken(response.api_token);
            console.log('Token set in cookie');
            
            // モックユーザー情報を設定
            const mockUser: User = {
              id: 1,
              name: 'テストユーザー'
            };
            this.currentUserSubject.next(mockUser);
            console.log('Mock user set in subject');
            
            observer.next(response);
            observer.complete();
          } catch (error) {
            console.error('Error in mock login:', error);
            observer.error(new Error('ログイン処理でエラーが発生しました'));
          }
        }, 500); // 500msの遅延
      });
    } else {
      console.log('Invalid credentials in mock login');
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('メールアドレスとパスワードを入力してください'));
          observer.complete();
        }, 500);
      });
    }
  }

  logout(): void {
    console.log('Logging out');
    this.removeToken();
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    try {
      console.log('Getting token from cookie');
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === this.TOKEN_KEY) {
          console.log('Token found');
          return value;
        }
      }
      console.log('No token found in cookies');
      return null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private checkToken(): void {
    try {
      console.log('Checking token');
      const token = this.getToken();
      if (token) {
        console.log('Token exists, loading user profile');
        this.loadUserProfile();
      } else {
        console.log('No token exists');
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  }

  private loadUserProfile(): void {
    console.log('Loading user profile');
    // 開発環境ではモックユーザーを使用
    const mockUser: User = {
      id: 1,
      name: 'テストユーザー'
    };
    this.currentUserSubject.next(mockUser);
    console.log('User profile loaded:', mockUser);

    // 本番環境では実際のAPIを呼び出す
    // this.http.get<User>('/api/user/1').subscribe({
    //   next: (user) => {
    //     this.currentUserSubject.next(user);
    //   },
    //   error: () => {
    //     // If we can't load the user profile, log out
    //     this.logout();
    //   }
    // });
  }

  private setToken(token: string): void {
    try {
      // Set token in cookie with expiration of 1 day
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);
      document.cookie = `${this.TOKEN_KEY}=${token}; expires=${expiryDate.toUTCString()}; path=/`;
      console.log('Token saved to cookie:', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  private removeToken(): void {
    try {
      // Remove token by setting an expired date
      document.cookie = `${this.TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      console.log('Token removed from cookie');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
}
