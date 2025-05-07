import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
}

export const initialState: TodoState = {
  todos: [],
  loading: false
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, (state) => ({
    ...state,
    loading: true
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false
  })),
  on(TodoActions.addTodoSuccess, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, todo]
  })),
  on(TodoActions.toggleTodoSuccess, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => t.id === todo.id ? todo : t)
  })),
  on(TodoActions.deleteTodoSuccess, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(t => t.id !== id)
  }))
);
