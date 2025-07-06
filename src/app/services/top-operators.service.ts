import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {  BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class TopOperatorsService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  
  all(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/TopOperators',  this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  url = this.apiURL + '/AllOperators';  

  allOperator(apiurl:any,param:any): Observable<any> {
    if(apiurl!=''){
      this.url = apiurl;
    }

    return this.httpClient.post<any>(this.url, JSON.stringify(param),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  OperatorDetail(operator_url:any): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/OperatorDetails?operator_url='+operator_url,  this.httpOptions)
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