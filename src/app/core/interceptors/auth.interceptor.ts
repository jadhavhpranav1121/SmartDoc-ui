import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';
import { AppState } from '../../store/app.state';
import { selectToken } from '../../features/auth/store/auth.selectors';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.select(selectToken).pipe(
      take(1),
      switchMap(token => {
        if (token) {
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next.handle(authReq);
        }
        return next.handle(req);
      })
    );
  }
}
