import { Injectable } from '@angular/core';
import{ GlobalConstants } from '../constants/global-constants';
import {HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class TokenService {

  private apiURL = GlobalConstants.BASE_URL;

  private issuer = {
    login: this.apiURL + '/VerifyOtp'
  }

  httpOptions = {  
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private jwtHelper: JwtHelperService) { }

  handleData(token :any){
    localStorage.setItem('auth_token', token);
  }

  

  getToken(){
    return localStorage.getItem('auth_token');
  }
  
  // Verify the token
   isValidToken(){
     const token = this.getToken(); 

     if(token){
      return true;
     }
  //      const payload = this.payload(token); 

  //      const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
  //      const isExpired = this.jwtHelper.isTokenExpired(token);

  //      console.log(expirationDate);
  //      console.log(isExpired);
  //      console.log(this.jwtHelper.decodeToken(token));
      
  //      if(payload){
  //        return Object.values(this.issuer).indexOf(payload.iss) > -1 ? true : false;
  //      }
  //    } else {
  //       return false;
  //    }
  // }

  // payload(token:any) {
  //   const jwtPayload = token.split('.')[1];
  //   return JSON.parse(atob(jwtPayload));
   }

  // User state based on valid token
  isLoggedIn() {     
    return this.isValidToken();
  }

  // Remove token
  removeToken(){
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  }

}