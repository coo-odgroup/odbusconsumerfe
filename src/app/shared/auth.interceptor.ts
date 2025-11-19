import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpSentEvent, HttpUserEvent, HttpClient } from "@angular/common/http";
import { TokenService } from "../shared/token.service";
import { Router } from "@angular/router";
import { catchError} from 'rxjs/operators';
import { BehaviorSubject, Observable,throwError } from 'rxjs';
import { UserdataService  } from '../services/userdata.service'; 
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';


@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  
    constructor(
        private token: TokenService, 
        private router: Router,
        private userdataservice: UserdataService,
        public auth: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
      
        // Don't attach Authorization for Auth endpoint (prevents recursion)
            if (!req.url.includes('/Auth')) {
                // Only access localStorage in browser
                const AuthAccessToken = isPlatformBrowser(this.platformId) ? localStorage.getItem('AuthAccessToken') : null;

                // On server, prefer auth.currentToken (set by AppInitializerService)
                const serverToken = !isPlatformBrowser(this.platformId) ? (this.auth && (this.auth as any).currentToken) : null;

                const tokenToUse = AuthAccessToken || serverToken;

                // Attach header only when token is present and not the string 'null'
                if (tokenToUse) {
                    req = req.clone({
                        setHeaders: {
                            Authorization: 'Bearer ' + tokenToUse
                        }
                    });
                }
            }

     
        return next.handle(req).pipe(catchError( (err: HttpErrorResponse) => {                
            if (err instanceof HttpErrorResponse) {                  
                if (err.status === 401 && isPlatformBrowser(this.platformId)) {
                        this.tokenSubject.next(null);                        
                        this.auth.getToken().subscribe(res=>{
                            if (isPlatformBrowser(this.platformId)) {
                                localStorage.setItem('AuthAccessToken', res.data);
                            }
                            this.tokenSubject.next(res.data);
                            this.collectFailedRequest(req);
                            this.retryFailedRequests(req,next);
                          }); 
                    
                }
            }                 
             return throwError(err);
        }
        
    ))
      

}

cachedRequests: Array<HttpRequest<any>> = [];

collectFailedRequest(request): void {
   this.cachedRequests.push(request);
   }


retryFailedRequests(request: HttpRequest<any>, next: HttpHandler): void {
    // Only reload in browser
    if (isPlatformBrowser(this.platformId)) {
        window.location.reload();
    }
}

}