import {inject, Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthFacade {
  loginFormGroup: FormGroup;
  authService = inject(AuthService);

  constructor() {
    this.buildLoginGroupForm();
  }

  signIn() {
    if (this.loginFormGroup.invalid) return;

    this.authService.signIn(this.loginFormGroup.value.username, this.loginFormGroup.value.password)
      .subscribe((data) => {
        console.log('response ', data),
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
