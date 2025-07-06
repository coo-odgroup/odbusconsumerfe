import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

  private apiURL = GlobalConstants.BASE_URL;

  constructor(private httpClient: HttpClient) { }

  httpOptions = {  
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  

  url = this.apiURL + '/BookingHistory';  

  BookingHistroy(apiurl:any,params:any): Observable<any> {
    if(apiurl!=''){
      this.url = apiurl;
    }

    return this.httpClient.post<any>(this.url, JSON.stringify(params),this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getProfile(userId:any,token:any): Observable<any> {
    
    return this.httpClient.get<any>(this.apiURL + '/UserProfile?userId='+userId+'&token='+token,this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateProfile(userId:any,token:any,params:any): Observable<any> {
    
  //   return this.httpClient.put<any>(this.apiURL + '/updateProfile/'+userId+'/'+token, JSON.stringify(params),this.httpOptions)
  //   .pipe(
  //     catchError(this.errorHandler)
  //   )
  // }

  updateProfile(params:any): Observable<any> {
    
    return this.httpClient.post<any>(this.apiURL + '/updateProfile', params)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  refreshToken(): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/RefreshToken',this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  UserReviews(userId:any,token:any): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/UserReviews?userId='+userId+'&token='+token,  this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  addreview(params:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/AddReview',JSON.stringify(params),  this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  updateReview(params:any,id:any): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + '/UpdateReview/'+id,JSON.stringify(params),  this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  deleteReview(id:any,users_id:any): Observable<any> {
    return this.httpClient.delete<any>(this.apiURL + '/DeleteReview/'+id+'/'+users_id,this.httpOptions)
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