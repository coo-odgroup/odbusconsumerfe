import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
   
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import{ GlobalConstants } from '../constants/global-constants';

@Injectable({
  providedIn: 'root'
})

export class GetSeatPriceService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  // getprice(lb:any,ub:any,dst:any,src:any,busid:any): Observable<any> {


  //   return this.httpClient.get<any>(this.apiURL + '/PriceOnSeatsSelection?seater='+JSON.stringify(lb)+' &sleeper= '+JSON.stringify(
  //   ub)+'&destinationId='+dst+'&sourceId='+src+'&busId='+busid)
  //   .pipe(
  //     catchError(this.errorHandler)
  //   )

  // }

  getprice(queryparam:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/PriceOnSeatsSelection' ,JSON.stringify(queryparam) ,this.httpOptions)
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