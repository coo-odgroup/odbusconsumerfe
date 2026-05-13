import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../constants/global-constants';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Meta, Title } from '@angular/platform-browser';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { element } from 'protractor';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SeoService {

  private apiURL = GlobalConstants.BASE_URL;
  private MASTER_SETTING_USER_ID = GlobalConstants.MASTER_SETTING_USER_ID;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  private seoCache: any = {};

  private seoRoutes = [
    '/blog/',
    '/routes/',
    '/about-us',
    '/contact-us'
  ];

  private link!: HTMLLinkElement;

  constructor(@Inject(DOCUMENT) private doc: Document, private httpClient: HttpClient, private title: Title, private meta: Meta) { }

  // seolist(current_url: any) {
  //   this.httpClient.get(this.apiURL + '/seolist?user_id=' + this.MASTER_SETTING_USER_ID, this.httpOptions).subscribe(
  //     (resp: any) => {
  //       this.setMeta(resp['data'], current_url);
  //     }
  //   );
  // }

  // seolist(current_url: any) {
  //   this.httpClient.post(this.apiURL + '/allseolist', { current_url }, this.httpOptions).subscribe(
  //     (resp: any) => {
  //       // console.log(resp);
  //       // this.setMeta(resp['data'], current_url);
  //       if (resp.status == 1) {
  //         this.setMeta(resp.data);
  //       }
  //     }
  //   );
  // }

  shouldLoadSeo(url: string): boolean {

    return this.seoRoutes.some(route =>
      url.includes(route)
    );
  }

  seolist(current_url: string): Observable<any> {

    // Route check
    if (!this.shouldLoadSeo(current_url)) {
      return of(null);
    }

    // Cache check
    if (this.seoCache[current_url]) {

      this.setMeta(this.seoCache[current_url]);

      return of(this.seoCache[current_url]);
    }

    // API Call
    return this.httpClient.post<any>(
      this.apiURL + '/allseolist',
      { current_url },
      this.httpOptions
    ).pipe(
      tap((resp: any) => {

        if (resp.status == 1) {

          this.seoCache[current_url] = resp.data;

          this.setMeta(resp.data);
        }
      })
    );
  }

  setMeta(c: any) {

    // Canonical URL
    if (this.link === undefined) {
      this.link = this.doc.createElement('link');
      this.link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(this.link);
    }

    this.link.setAttribute('href', this.doc.URL.split('?')[0]);

    // Meta Tags
    this.title.setTitle(c.meta_title || '');

    this.meta.updateTag({
      name: 'description',
      content: c.meta_description || ''
    });

    this.meta.updateTag({
      name: 'keywords',
      content: c.meta_keyword || ''
    });

    this.meta.updateTag({
      property: 'og:title',
      content: c.meta_title || ''
    });

    this.meta.updateTag({
      property: 'og:description',
      content: c.meta_description || ''
    });

    this.meta.updateTag({
      property: 'og:url',
      content: this.doc.URL
    });

    // Remove old schema
    this.removeJsonLd();

    // FAQ Schema
    if (c.faq_schema) {

      const faqScript = this.doc.createElement('script');

      faqScript.type = 'application/ld+json';

      faqScript.text = c.faq_schema;

      faqScript.id = 'faq-schema';

      this.doc.head.appendChild(faqScript);
    }

    // Breadcrumb Schema
    if (c.breadcrumb_schema) {

      const breadcrumbScript = this.doc.createElement('script');

      breadcrumbScript.type = 'application/ld+json';

      breadcrumbScript.text = c.breadcrumb_schema;

      breadcrumbScript.id = 'breadcrumb-schema';

      this.doc.head.appendChild(breadcrumbScript);
    }

    // Service Schema
    if (c.service_schema) {

      const serviceScript = this.doc.createElement('script');

      serviceScript.type = 'application/ld+json';

      serviceScript.text = c.service_schema;

      serviceScript.id = 'service-schema';

      this.doc.head.appendChild(serviceScript);
    }

    // Extra Meta
    if (c.extra_meta) {

      const script = this.doc.createElement('script');

      script.innerHTML = c.extra_meta;

      script.id = 'extra_meta';

      this.doc.head.appendChild(script);
    }
  }

  removeJsonLd() {

    const faq = this.doc.getElementById('faq-schema');
    if (faq) faq.remove();

    const breadcrumb = this.doc.getElementById('breadcrumb-schema');
    if (breadcrumb) breadcrumb.remove();

    const extra = this.doc.getElementById('extra_meta');
    if (extra) extra.remove();
  }

  // setMeta(res: any, current_url: any) {

  //   if (this.link === undefined) {
  //     this.link = this.doc.createElement('link');
  //     this.link.setAttribute('rel', 'canonical');
  //     this.doc.head.appendChild(this.link);
  //   }
  //   this.link.setAttribute('href', this.doc.URL.split('?')[0]);
  //   this.meta.updateTag({ name: 'og:url', content: this.doc.URL });

  //   let flag = false;

  //   if (res) {

  //     res.forEach((c: any) => {
  //       if (c.page_url == current_url) {

  //         flag = true;

  //         this.title.setTitle(c.meta_title);
  //         this.meta.updateTag({ name: 'description', content: c.meta_description });
  //         this.meta.updateTag({ name: 'keywords', content: c.meta_keyword });
  //         this.meta.updateTag({ name: 'og:title', content: c.meta_title });
  //         this.meta.updateTag({ name: 'og:description', content: c.meta_description });

  //         if (c.extra_meta != null) {
  //           const script = document.createElement('script');
  //           script.innerHTML = c.extra_meta;
  //           script.id = "extra_meta";
  //           this.doc.head.append(script);
  //         }
  //       }
  //     });
  //   }

  //   if (flag == false) {
  //     // this.deafultmeta_description.subscribe((s:any) => { 
  //     //   this.meta.updateTag({ name: 'description', content: s });
  //     //  this.meta.updateTag({ name: 'og:description', content: s }) ; 
  //     //});
  //     //this.deafultmeta_title.subscribe((s:any) => { 
  //     //  this.title.setTitle(s);
  //     // this.meta.updateTag({ name: 'og:title', content: s }) ;

  //     //});
  //     //this.deafultmeta_keyword.subscribe((s:any) => { 
  //     // this.meta.updateTag({ name: 'keywords', content: s }) ;

  //     // });

  //     let scripts = document.getElementById('extra_meta');
  //     if (scripts?.parentNode) {
  //       scripts.parentNode.removeChild(scripts);
  //     }
  //   }
  // }

  seoList() {
    return this.httpClient.get<any>(this.apiURL + '/seolist?user_id=' + this.MASTER_SETTING_USER_ID, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage: any;
    if (error.error instanceof HttpErrorResponse) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error;
    }
    return throwError(errorMessage);
  }
}