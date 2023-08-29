import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  http = inject(HttpClient);
  constructor() { }

  getAllUsers() {
    console.log('user services...');
    return this.http.get(`${environment.SERVER_URL}/users/`)
      .pipe(
        tap(response => console.log('response ', response)),
        map(response => response)
      )
  }
}
