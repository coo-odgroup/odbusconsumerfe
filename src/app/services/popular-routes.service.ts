import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {  BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class PopularRoutesService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  
  all(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/PopularRoutes',  this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  allroutes(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/AllRoutes',  this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  downloadApp(params): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/downloadapp', JSON.stringify(params), this.httpOptions)
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