import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  jwtToken: string;
  decodedToken: { [key: string]: string };

  constructor() {
  }

  setToken(token: string) {
    if (token) {
      this.jwtToken = token;
    }
  }

  decodeToken() {
    if (this.jwtToken) {
      this.decodedToken = jwtDecode(this.jwtToken);
    }
  }

  getDecodeToken() {
    return jwtDecode(this.jwtToken);
  }

  getUser() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['username'] : null;
  }

  getEmailId() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['email'] : null;
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['exp'] : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = Number(this.getExpiryTime());

    return (expiryTime - Date.now()) <= 0;
  }
}
