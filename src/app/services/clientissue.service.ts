import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
   
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Constants} from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class ClientissueService {

  private endPoint = Constants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getIssueType(): Observable<any> {
    return this.httpClient.post<any>(Constants.BASE_URL+'/apiclientissuetype', this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  
  getIssuesubType(post): Observable<any> {
    return this.httpClient.post<any>(Constants.BASE_URL+'/apiclientissuesubtype', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  addClientIssue(post): Observable<any> {
    return this.httpClient.post<any>(Constants.BASE_URL+'/addapiclientissue', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  
  apiclientissuedata(post): Observable<any> {
    return this.httpClient.post<any>(Constants.BASE_URL+'/apiclientissuedata', JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getapiclientissuedata(url,data): Observable<any> {
    return this.httpClient.post<any>(url,JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }
  



  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error;
     // `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }
}
