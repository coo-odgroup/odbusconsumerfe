import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
   
import {  BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EncryptionService } from '../encrypt.service';

import{ GlobalConstants } from '../constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  private alert = new  BehaviorSubject('');

  constructor(private httpClient: HttpClient,private enc:EncryptionService) { }

  currentalert = this.alert.asObservable();

  setAlert(message: any) {
    this.alert.next(message);
 }

  signup(params :any): Observable<any> {

    let requestParam = this.enc.encrypt(JSON.stringify(params));

		let reqData = { 'REQUEST_DATA': requestParam};


    return this.httpClient.post<any>(this.apiURL + '/Registerweb' , reqData ,this.httpOptions)
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