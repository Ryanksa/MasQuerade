import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import User from '../models/User';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/user';

  constructor(private http: HttpClient) {}

  signup(name: string, username: string, password: string): Observable<User> {
    const signupRequestBody = { username, password, name };
    return this.http.post<User>(`${this.apiUrl}/signup`, signupRequestBody, httpOptions);
  }

  signin(username: string, password: string): Observable<User> {
    const signinRequestBody = { username, password };
    return this.http.post<User>(`${this.apiUrl}/signin`, signinRequestBody, httpOptions);
  }

  signout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/signout`);
  }
}
