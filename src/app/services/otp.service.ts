import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
   
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';
import { EncryptionService } from '../encrypt.service';


@Injectable({
  providedIn: 'root'
})
export class OTPService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient,private enc:EncryptionService) { }

  submit_otp(params :any): Observable<any> {

    let requestParam = this.enc.encrypt(JSON.stringify(params));

		let reqData = { 'REQUEST_DATA': requestParam};

    return this.httpClient.post(this.apiURL + '/VerifyOtpweb', reqData ,this.httpOptions)
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