import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../constants/global-constants';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PopularRoutesService {
  private apiURL = GlobalConstants.BASE_URL;
  private homeData$!: Observable<any>;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  all(): Observable<any> {
    return this.httpClient
      .get<any>(this.apiURL + '/PopularRoutes', this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  allroutes(per_page, page_no): Observable<any> {
    return this.httpClient
      .get<any>(
        this.apiURL + '/AllRoutes?per_page=' + per_page + '&page_no=' + page_no,
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler));
  }

  // getallroutes(per_page: any, page_no: any): Observable<any> {
  //   return this.httpClient
  //     .post<any>(
  //       this.apiURL + '/getallroutes',
  //       {
  //         per_page,
  //         page_no,
  //       },
  //       this.httpOptions,
  //     )
  //     .pipe(catchError(this.errorHandler));
  // }

  getallroutes(
    per_page: any,
    page_no: any,
    search: string = '',
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.apiURL + '/getallroutes',
        {
          per_page,
          page_no,
          search,
        },
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler));
  }

  downloadApp(params): Observable<any> {
    return this.httpClient
      .post<any>(
        this.apiURL + '/downloadapp',
        JSON.stringify(params),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler));
  }

  getHomeData(params: any): Observable<any> {
    if (!this.homeData$) {
      // const param = {
      //   user_id: GlobalConstants.MASTER_SETTING_USER_ID,
      //   is_top_routes: 1,
      //   is_popular_routes: 1,
      // };

      this.homeData$ = this.httpClient.post<any>(
        this.apiURL + '/homedata',
        params
      ).pipe(
        shareReplay(1)
      );
    }

    return this.homeData$;
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage: any;
    if (error.error instanceof HttpErrorResponse) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error;

      //`Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
