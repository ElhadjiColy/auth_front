import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {catchError, map, Observable, tap, throwError} from "rxjs";

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
    sessionStorage.setItem(AuthService.refresh_token, val);
  }

  signIn(username: string, password: string): Observable<{ access: string, refresh: string }> {
    return this.http.post(`${environment.SERVER_URL}/api/token/`, {username, password})
      .pipe(
        tap((response: {access: string, refresh: string}) => {
          this.jwt = response.access;
          this.jwtRefresh = response.refresh;
          console.log('response ', response);
        }),
        map(r => r),
        catchError((error: HttpErrorResponse) => {
          throw (error.error.detail);
        })
      );
  }

  signOut() {
    console.log('on signing out');
    sessionStorage.clear();
  }


  refreshToken() {
    return this.http.post(`${environment.SERVER_URL}/api/token/refresh/`, {
      refresh: this.jwtRefresh
    })
      .pipe(
        tap((response: {access: string, refresh: string}) => {
          console.log('token after refreshing... ', response);
          console.log('is same token ', this.jwt == response.access);
          this.jwt = response.access;
          console.log('is same token ', this.jwt == response.access);
          this.jwtRefresh = response.refresh;
        }),
        map(response => response),
        catchError((err: HttpErrorResponse) => {
          throw (err.error.detail);
        })
      )
  }
}
