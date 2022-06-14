import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';  
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Constants} from '../constant/constant' ;
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ApiclientcancelticketService {
  data:any ="API WILL BE CREATED IN CONSUMER SITE" ;
  private apiURL = Constants.CONSUMER_API_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }


  //https://testing.odbus.co.in/api/ClientCancelTicketInfo

  // getbookingdetails(params :any): Observable<any> { 
  //   // console.log(this.data);
  //   // return ;
  //   return this.httpClient.post<any>(this.apiURL + '/ClientCancelTicketInfo' , JSON.stringify(params) ,this.httpOptions)
  //   .pipe(
  //     catchError(this.errorHandler)
  //   )
  // }
  getbookingdetails(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/ClientCancelTicketInfo', post)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  pnrCancel(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/ClientCancelTicket', post)
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
