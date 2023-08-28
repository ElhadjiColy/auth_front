import {inject, Injectable} from '@angular/core';
import {CanActivate, Router } from '@angular/router';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  authService = inject(AuthService);
  router = inject(Router);
  canActivate(): boolean {

    console.log('is checking can activate');

    if(this.authService.isLoggedIn) return true;

    if (this.router.url === 'login') return false;

    this.router.navigate(['login']);

    return false;

  }

}
