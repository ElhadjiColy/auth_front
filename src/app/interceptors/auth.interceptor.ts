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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authService = inject(AuthService);
  eventBusService = inject(EventBusService);

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
        if (
          error instanceof HttpErrorResponse &&
          !request.url.includes('api/token') &&
          error.status === 401
        ) {
          console.log('should refresh the token...')
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log('is refreshing ?: ', this.isRefreshing);
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if(this.authService.isLoggedIn) {
        return this.authService.refreshToken()
            .pipe(
              switchMap(() => {
                this.isRefreshing = false;
                return next.handle(request);
              }),
                catchError((err) => {
                  this.isRefreshing = false;

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
