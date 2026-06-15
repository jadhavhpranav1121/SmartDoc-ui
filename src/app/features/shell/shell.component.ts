import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import { selectUsername } from '../auth/store/auth.selectors';
import { logout } from '../auth/store/auth.actions';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  username$!: Observable<string | null>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.username$ = this.store.select(selectUsername);
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
