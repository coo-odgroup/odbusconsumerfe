import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ReplaySubject, Observable, forkJoin } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Handled loading the external library ondemand into our app
 */
@Injectable({providedIn: 'root'})
export class ExternalLibraryService {

    private _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

    constructor(
        @Inject(DOCUMENT) private readonly document: any,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    // forkjoin parameters will grow when we are adding any new external library into app
    lazyLoadLibrary(resourceURL: string): Observable<any> {
        return forkJoin([
            this.loadScript(resourceURL)
        ]);
    }

    private loadScript(url: string): Observable<any> {
        // Only load scripts in browser
        if (!isPlatformBrowser(this.platformId)) {
            const emptySubject = new ReplaySubject();
            emptySubject.next(null);
            emptySubject.complete();
            return emptySubject.asObservable();
        }

        if (this._loadedLibraries[url]) {
            return this._loadedLibraries[url].asObservable();
        }
    
        this._loadedLibraries[url] = new ReplaySubject();
    
        const script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = url;
        script.onload = () => {
            this._loadedLibraries[url].next();
            this._loadedLibraries[url].complete();
        };
    
        if (this.document.body) {
            this.document.body.appendChild(script);
        } else {
            // Fallback if body doesn't exist yet
            this.document.head.appendChild(script);
        }
        return this._loadedLibraries[url].asObservable();
    }    
}
