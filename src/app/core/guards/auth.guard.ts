import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../../store/app.state';
import { selectIsLoggedIn } from '../../features/auth/store/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(selectIsLoggedIn).pipe(
    take(1),
    map(isLoggedIn => isLoggedIn || router.createUrlTree(['/login']))
  );
};
