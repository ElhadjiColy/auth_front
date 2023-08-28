import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static readonly key = 'JWT_KEY';
  private static readonly refresh_token = 'REFRESH_TOKEN';
  http = inject(HttpClient);
  constructor(){}

  get isLoggedIn(): boolean {
    return !!this.jwt;
  }

  get jwt(): string {
    return sessionStorage.getItem(AuthService.key) ?? '';
  }

  get jwtRefresh(): string {
    return sessionStorage.getItem(AuthService.refresh_token) ?? '';
  }

  private set jwt(val: string) {
    sessionStorage.setItem(AuthService.key, val);
  }

  private set jwtRefresh(val: string) {
    sessionStorage.setItem(AuthService.key, val);
  }

  signIn(username: string, password: string): Observable<string> {
    return this.http.post(`${environment.SERVER_URL}/api/token/`, {username, password})
      .pipe(
        tap((response: {access: string, refresh: string}) => {
          this.jwt = response.access;
          this.jwtRefresh = response.refresh;
        }),
        map(r => r.refresh),
        catchError((error: HttpErrorResponse) => {
          throw (error.error.detail);
        })
      );
  }
  signOut() {
    console.log('on signing out');
  }

  refreshToken() {
    return this.http.post(`${environment.SERVER_URL}/api/token/refresh`, { });
  }
}
