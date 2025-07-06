import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {  BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs'; 
import { catchError } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';
import { EncryptionService } from '../encrypt.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

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

  signin(param: any): Observable<any> { 

    let requestParam = this.enc.encrypt(JSON.stringify(param));

		let reqData = { 'REQUEST_DATA': requestParam};


    return this.httpClient.post<any>(this.apiURL + '/Loginweb', reqData ,  this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  errorHandler(error:HttpErrorResponse) {
    let errorMessage :any;
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error;
      
      //`Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }
}