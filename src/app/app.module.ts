import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { todoReducer } from './store/todo/todo.reducer';
import { TodoEffects } from './store/todo/todo.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({
      auth: authReducer,
      todo: todoReducer
    }),
    EffectsModule.forRoot([AuthEffects, TodoEffects])
  ],
  providers: [
    AuthEffects,
    TodoEffects
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 