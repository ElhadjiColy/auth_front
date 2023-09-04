import {inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {environment} from "../../environments/environment";
import {EventData} from "../services/shared/event";
import {EventBusService} from "../services/shared/event-bus.service";
import {JwtService} from "../services/jwt/jwt.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authService = inject(AuthService);
  eventBusService = inject(EventBusService);
  jwtService = inject(JwtService);

  private isRefreshing: boolean = false;

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isLoggedIn = this.authService.isLoggedIn;
    const isToServer: boolean = request.url.startsWith(environment.SERVER_URL);
    const USER_TOKEN = this.authService.jwt;

    if (isLoggedIn && isToServer) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${USER_TOKEN}`),
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        this.jwtService.setToken(this.authService.jwt);
        console.log('jwt service ', this.jwtService.isTokenExpired());
        if(error instanceof HttpErrorResponse &&
          !request.url.includes('api/token') && this.jwtService.isTokenExpired()) {
          console.log('we gonna refresh the token...')
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if(this.authService.isLoggedIn) {
        return this.authService.refreshToken()
            .pipe(
              switchMap(() => {
                this.isRefreshing = false;
                console.log('mafe soupe kandia domoda...');
                return next.handle(request);
              }),
                catchError((err) => {
                  this.isRefreshing = false;

                  console.log("something goes wrong...")
                  if (err.status == '403') {
                      this.eventBusService.emit(new EventData('logout', null));
                  }
                  return throwError(() => err);
                })
            )
      }
    }
    return next.handle(request);
  }
}
