import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }


  // login
  login(payload){
    return this.http.post(`${environment.API_BASE_URL}/user/login`, payload, {headers: environment.AUTH_HEADERS})
  }

  // register
  register(payload){
    return this.http.post(`${environment.API_BASE_URL}/user/register`, payload, {headers: environment.AUTH_HEADERS})
  }
}
