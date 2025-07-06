
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
   
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import{ GlobalConstants } from '../constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class ManagebookingService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getbookingdetails(params :any): Observable<any> { 

    return this.httpClient.post<any>(this.apiURL + '/BookingDetails' , JSON.stringify(params) ,this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  

  sendEmailSms(param:any): Observable<any> { 

    return this.httpClient.post<any>(this.apiURL + '/EmailSms' , JSON.stringify(param) ,this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  cancelTicket(param:any): Observable<any> { 

    return this.httpClient.post<any>(this.apiURL + '/CancelTicket' , JSON.stringify(param) ,this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getcancelTicketInfo(param:any): Observable<any> { 

    return this.httpClient.post<any>(this.apiURL + '/cancelTicketInfo' , JSON.stringify(param) ,this.httpOptions)
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