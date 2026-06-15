import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Store } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { authReducer } from './features/auth/store/auth.reducer';
import { uploadReducer } from './features/upload/store/upload.reducer';
import { chatReducer } from './features/chat/store/chat.reducer';

import { AuthEffects } from './features/auth/store/auth.effects';
import { UploadEffects } from './features/upload/store/upload.effects';
import { ChatEffects } from './features/chat/store/chat.effects';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { LoginComponent } from './features/auth/components/login/login.component';
import { ShellComponent } from './features/shell/shell.component';
import { UploadPanelComponent } from './features/upload/components/upload-panel/upload-panel.component';
import { ChatWindowComponent } from './features/chat/components/chat-window/chat-window.component';
import { MessageBubbleComponent } from './features/chat/components/message-bubble/message-bubble.component';
import { QuestionInputComponent } from './features/chat/components/question-input/question-input.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

import { AppState } from './store/app.state';
import { restoreSession } from './features/auth/store/auth.actions';

const TOKEN_KEY = 'smartdoc_token';
const USERNAME_KEY = 'smartdoc_username';

function restoreSessionFactory(store: Store<AppState>) {
  return () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const username = localStorage.getItem(USERNAME_KEY);
    if (token && username) {
      store.dispatch(restoreSession({ token, username }));
    }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ShellComponent,
    UploadPanelComponent,
    ChatWindowComponent,
    MessageBubbleComponent,
    QuestionInputComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot({
      auth: authReducer,
      upload: uploadReducer,
      chat: chatReducer
    }),
    EffectsModule.forRoot([AuthEffects, UploadEffects, ChatEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: restoreSessionFactory,
      deps: [Store],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
