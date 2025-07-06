import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
   
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';
import { EncryptionService } from '../encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = GlobalConstants.BASE_URL;

  params={
    "client_id": "odbusSas" ,
    "password": "Admin@2010"
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  

  constructor(private httpClient: HttpClient,private enc:EncryptionService) { }

  getToken(): Observable<any> { 
    let requestParam = this.enc.encrypt(JSON.stringify(this.params));

		//let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken, 'REQUEST_KEY': requestKey };
		let reqData = { 'REQUEST_DATA': requestParam};

    return this.httpClient.post<any>(this.apiURL + '/Auth' , reqData ,this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
    
    //  return this.httpClient.post<any>(this.apiURL + '/Clientlogin' , this.params ,this.httpOptions)
    //  .pipe(
    //    catchError(this.errorHandler)
    //  )
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