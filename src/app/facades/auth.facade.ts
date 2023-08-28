import {inject, Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthFacade {
  loginFormGroup: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    this.buildLoginGroupForm();
  }

  signIn() {
    if (this.loginFormGroup.invalid) return;

    this.authService.signIn(this.loginFormGroup.value.username, this.loginFormGroup.value.password)
      .subscribe((data) => {
        this.router.navigate(['']),
          (err: any) => {
          throw(err)
        }
      });

  }

  private buildLoginGroupForm() {
    this.loginFormGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
}
