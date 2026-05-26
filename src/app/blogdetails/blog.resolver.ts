import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../constants/global-constants';

@Injectable({
    providedIn: 'root'
})
export class BlogResolver implements Resolve<any> {

    private apiUrl = GlobalConstants.BASE_URL;

    constructor(private http: HttpClient) { }

    resolve(route: ActivatedRouteSnapshot) {
        const slug = route.paramMap.get('slug');
        return this.http.post(this.apiUrl + '/blogdetails', { slug });
    }
}