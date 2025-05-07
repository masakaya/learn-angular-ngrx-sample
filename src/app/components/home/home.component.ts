import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadUser } from '../../store/auth/auth.actions';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `<div>リダイレクト中...</div>`,
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) {
    console.log('HomeComponent constructor');
  }

  ngOnInit(): void {
    console.log('HomeComponent ngOnInit - checking auth state');
    
    // 直接Cookieをチェック
    const token = this.authService.getToken();
    const hasToken = !!token;
    console.log('Token exists in cookie:', hasToken);
    
    if (hasToken) {
      console.log('Token found:', token);
      
      // ユーザー情報の読み込みを開始（バックグラウンドで）
      this.store.dispatch(loadUser());
      
      // 直接todo画面へ遷移
      console.log('Navigating to /todo');
      setTimeout(() => {
        this.router.navigate(['/todo']);
      }, 100); // 少し遅延させて、ナビゲーションの競合を避ける
    } else {
      console.log('No token, navigating to /login');
      this.router.navigate(['/login']);
    }
  }
} 