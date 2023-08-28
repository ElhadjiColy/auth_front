import {inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authService = inject(AuthService);
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

    return next.handle(request);
  }
}
