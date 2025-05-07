import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { checkAuth } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TODO App';

  constructor(private store: Store) {
    console.log('AppComponent constructor called');
  }

  ngOnInit(): void {
    try {
      console.log('AppComponent ngOnInit called');
      // Check if user is authenticated when app starts
      this.store.dispatch(checkAuth());
      console.log('checkAuth action dispatched');
    } catch (error) {
      console.error('Error in AppComponent ngOnInit:', error);
    }
  }
}
