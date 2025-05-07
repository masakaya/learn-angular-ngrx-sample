import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';
import { User } from '../../models/user.model';
import * as TodoActions from '../../store/todo/todo.actions';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectTodos } from '../../store/todo/todo.selectors';
import { selectUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  newTodoTitle = '';
  currentUser: User | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load todos from localStorage
    this.store.dispatch(TodoActions.loadTodos());

    // Subscribe to todos from store
    this.subscriptions.push(
      this.store.select(selectTodos).subscribe(todos => {
        this.todos = todos;
      })
    );

    // Subscribe to current user from store
    this.subscriptions.push(
      this.store.select(selectUser).subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title: this.newTodoTitle }));
      this.newTodoTitle = '';
    }
  }

  toggleTodo(id: number): void {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  deleteTodo(id: number): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
