import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    const body = {
      username: data.username,
      password: data.password,
    };
    return this.http.post(`${this.url}/users/login`, body);
  }

  createUser(data: any): Observable<any> {
    const body = {
      username: data.username,
      password: data.password,
      email: data.email,
    };
    return this.http.post(`${this.url}/users/create`, body);
  }

  resetPasswordEmail(data: any): Observable<any> {
    const body = {
      email: data.email,
      username: data.username,
    };
    return this.http.post(`${this.url}/auth/forgot-password`, body);
  }

  resetPassword(data: any, token: string): Observable<any> {
    const body = {
      newPassword: data.newPassword,
    };
    return this.http.put(
      `${this.url}/auth/reset-password?token=${token}`,
      body
    );
  }
}
