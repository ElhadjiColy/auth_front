import {Component, inject, OnInit} from '@angular/core';
import {CurrentUserService} from "./services/current-user/current-user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'auth_front';

}
