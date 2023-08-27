import {Component, inject, OnInit} from '@angular/core';
import {AuthFacade} from "../../facades/auth.facade";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authFacade = inject(AuthFacade);
  constructor() { }

  ngOnInit(): void {
  }

}




