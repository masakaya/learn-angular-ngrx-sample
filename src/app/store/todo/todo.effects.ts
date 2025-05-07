import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Todo } from '../../models/todo.model';
import * as TodoActions from './todo.actions';
import { selectTodos } from './todo.selectors';

@Injectable()
export class TodoEffects {
  private readonly STORAGE_KEY = 'todos';
  private nextId = 1;

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      map(() => {
        const storedTodos = localStorage.getItem(this.STORAGE_KEY);
        const todos = storedTodos ? JSON.parse(storedTodos) : [];

        // Update nextId based on the highest id in the loaded todos
        if (todos.length > 0) {
          const maxId = Math.max(...todos.map((todo: Todo) => todo.id));
          this.nextId = maxId + 1;
        }

        return TodoActions.loadTodosSuccess({ todos });
      })
    );
  });

  saveTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TodoActions.addTodoSuccess,
        TodoActions.toggleTodoSuccess,
        TodoActions.deleteTodoSuccess
      ),
      withLatestFrom(this.store.select(selectTodos)),
      map(([_, todos]) => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
      })
    );
  }, { dispatch: false });

  addTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.addTodo),
      map(({ title }) => {
        const newTodo: Todo = {
          id: this.nextId++,
          title: title.trim(),
          completed: false
        };
        return TodoActions.addTodoSuccess({ todo: newTodo });
      })
    );
  });

  toggleTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      withLatestFrom(this.store.select(selectTodos)),
      map(([{ id }, todos]) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
          const updatedTodo = { ...todo, completed: !todo.completed };
          return TodoActions.toggleTodoSuccess({ todo: updatedTodo });
        }
        // This should not happen, but just in case
        return { type: '[Todo] Toggle Todo Error' };
      })
    );
  });

  deleteTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      map(({ id }) => TodoActions.deleteTodoSuccess({ id }))
    );
  });
}
