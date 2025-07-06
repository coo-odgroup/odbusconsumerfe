import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {  BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs'; 
import { catchError } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';

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

  constructor(private httpClient: HttpClient) { }

  currentalert = this.alert.asObservable();

  setAlert(message: any) {
    this.alert.next(message);
 }

  signin(param: any): Observable<any> { 
    return this.httpClient.post<any>(this.apiURL + '/Login', JSON.stringify(param) ,  this.httpOptions)
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