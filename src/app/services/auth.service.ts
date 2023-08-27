import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static readonly key = 'JWT_KEY';
  http = inject(HttpClient);
  constructor(){}

  get isLoggedIn(): boolean {
    return !!this.jwt_key;
  }

  get jwt_key(): string {
    return sessionStorage.getItem(AuthService.key) ?? '';
  }

  private set jwt_key(val: string) {
    sessionStorage.setItem(AuthService.key, val);
  }

  signIn(username: string, password: string): Observable<string> {
    return this.http.post(`${environment.SERVER_URL}/api/token/`, {username, password})
      .pipe(
        tap((response: {access: string, refresh: string}) => this.jwt_key = response.access),
        map(r => r.refresh)
      );
  }
  signOut() {
    console.log('on signing out');
  }
}
