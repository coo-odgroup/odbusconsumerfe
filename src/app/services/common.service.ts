import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse  } from '@angular/common/http';
   
import {  BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import{ GlobalConstants } from '../constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

   private _commonData: any = null;
   commonData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
 
  constructor(private httpClient: HttpClient) { }

  // Getter for commonData (returns the actual data, not the BehaviorSubject)
  get commonData(): any {
    return this._commonData;
  }
  
  setCommonData(newData) {
    this._commonData = newData;
    this.commonData$.next(newData);
  }


  getCommonData(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/CommonService', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  PopularInfo(post): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + '/PopularInfo', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getPathUrls(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/AllPathUrls', this.httpOptions)
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
