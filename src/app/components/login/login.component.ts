import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectIsLoggedIn } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private router: Router
  ) {
    console.log('LoginComponent constructor');
  }

  ngOnInit(): void {
    console.log('LoginComponent initialized');
    
    // Subscribe to loading state
    this.subscriptions.push(
      this.store.select(selectAuthLoading).subscribe(loading => {
        console.log('Auth loading state changed:', loading);
        this.isLoading = loading;
      })
    );

    // Subscribe to error state
    this.subscriptions.push(
      this.store.select(selectAuthError).subscribe(error => {
        console.log('Auth error state changed:', error);
        this.errorMessage = error || '';
      })
    );

    // Check if already logged in (only once during init)
    this.store.select(selectIsLoggedIn).pipe(take(1)).subscribe(isLoggedIn => {
      console.log('Initial auth state:', isLoggedIn);
      if (isLoggedIn) {
        console.log('Already logged in, navigating to /todo');
        this.router.navigate(['/todo']);
      }
    });
  }

  ngOnDestroy(): void {
    console.log('LoginComponent being destroyed');
    // Unsubscribe to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSubmit(): void {
    console.log('Login form submitted');
    
    if (!this.email || !this.password) {
      console.log('Validation failed: email or password empty');
      this.errorMessage = 'メールアドレスとパスワードを入力してください';
      return;
    }

    console.log('Dispatching login action for:', this.email);
    this.errorMessage = '';
    this.store.dispatch(AuthActions.login({
      credentials: { email: this.email, password: this.password }
    }));
    
    // ログイン成功時は自動的にリダイレクトされるため、このコンポーネントでの追加の処理は不要
  }
}
