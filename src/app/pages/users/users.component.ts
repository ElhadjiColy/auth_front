import {Component, inject, OnInit} from '@angular/core';
import {UsersService} from "../../services/users/users.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usersService = inject(UsersService);
  constructor() { }

  ngOnInit(): void {
    console.log('fetching users...');
    this.usersService.getAllUsers()
      .subscribe(result => console.log('result from fetching users ', result));
  }

}
