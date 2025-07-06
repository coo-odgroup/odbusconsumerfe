import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
   
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import{ GlobalConstants } from '../constants/global-constants';

@Injectable({
  providedIn: 'root'
})

export class SeatLayoutService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  //getSeats(dt:any,bus_id:any,s:any,d:any,rf_no:any,origin:any): Observable<any> {
  getSeats(params:any): Observable<any> {

    //console.log(this.apiURL + '/viewSeats?entry_date=' + dt+'&busId='+bus_id+'&sourceId='+s+'&destinationId='+d+'&ReferenceNumber='+rf_no+'&origin='+origin);

    return this.httpClient.post<any>(this.apiURL + '/viewSeats', JSON.stringify(params) ,this.httpOptions)
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