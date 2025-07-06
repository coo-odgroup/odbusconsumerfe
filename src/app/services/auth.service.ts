import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
   
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = GlobalConstants.BASE_URL;

  // params={
  //   "client_id": "RsznkkMUqmJD0nUXjYv2LS8HPopT4xy1" ,
  //   "client_secret": "GZu_62xk_zFCSHAq3jdWdG9E6vXLD0moEksC4BGv46IFRuQp5rcdjWCxDIJTvNRs",
  //   "audience": this.apiURL+'/',
  //   "grant_type": "client_credentials"
  // }

  params={
    "client_id": "odbusSas" ,
    "password": "Admin@2010"
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  

  constructor(private httpClient: HttpClient) { }

  getToken(): Observable<any> { 
     return this.httpClient.post<any>(this.apiURL + '/ClientLogin' , JSON.stringify(this.params) ,this.httpOptions)
     .pipe(
       catchError(this.errorHandler)
     )
   }
 
   errorHandler(error:HttpErrorResponse) {
    let errorMessage :any;
    if(error.error instanceof HttpErrorResponse) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error;
      
      //`Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }
}