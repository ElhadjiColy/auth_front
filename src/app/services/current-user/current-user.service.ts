import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  currentUser$ = new BehaviorSubject<{id: string, name: string} | null | undefined>(undefined);
  authService = inject(AuthService);

  setCurrentUser() {
    if (this.authService.isLoggedIn) {
      this.currentUser$.next({id: '1', name: 'ibou'});
      return;
    }
    this.currentUser$.next(null);
  }
}
