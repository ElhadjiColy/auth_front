import {inject, Injectable} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {catchError, map, throwError} from "rxjs";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthFacade {
  loginFormGroup: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage: string = '';

  constructor() {
    this.buildLoginGroupForm();
  }

  signIn() {
    if (this.loginFormGroup.invalid) return;

    this.authService.signIn(this.loginFormGroup.value.username, this.loginFormGroup.value.password)
      .pipe(
        map(response => response),
        catchError((error: string) => {

          this.errorMessage = error;
          return throwError(() => new Error(error));
        })
      )
      .subscribe((data) => {
        this.router.navigate(['users']);
      });

  }

  private buildLoginGroupForm() {
    this.loginFormGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
}
