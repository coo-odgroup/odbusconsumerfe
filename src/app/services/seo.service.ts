import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { GlobalConstants } from '../constants/global-constants';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Meta, Title } from '@angular/platform-browser';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { element } from 'protractor';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private apiURL = GlobalConstants.BASE_URL;
  private MASTER_SETTING_USER_ID = GlobalConstants.MASTER_SETTING_USER_ID;

  private BASE_URL = GlobalConstants.URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private seoCache: any = {};
  private metaTitle: any;
  private metaDescription: any;
  private metaKeyword: any;
  private storage_version: any;

  getOrganizationSchema() {
    return this.httpClient.post<any>(this.apiURL + '/organization_schema', '').pipe(
      tap((resp: any) => {
        this.metaTitle = resp.meta_title;
        this.metaDescription = resp.meta_description;
        this.metaKeyword = resp.meta_keyword;
        this.storage_version = resp.storage_version;
      }),
    );;
  }

  addOrganizationSchema(schema: string): void {
    const existing = this.doc.getElementById('organization-schema');

    if (existing) {
      existing.remove();
    }

    const script = this.doc.createElement('script');

    script.type = 'application/ld+json';
    script.id = 'organization-schema';
    script.text = schema;

    this.doc.head.appendChild(script);
  }

  // addCanonicalUrl(): void {
  //   const canonicalUrl = this.BASE_URL.replace(/\/$/, '') + this.router.url;

  //   const existing = this.doc.querySelectorAll("link[rel='canonical']");

  //   existing.forEach((link) => link.remove());

  //   const canonical = this.doc.createElement('link');
  //   canonical.setAttribute('rel', 'canonical');
  //   canonical.setAttribute('href', canonicalUrl);

  //   this.doc.head.appendChild(canonical);
  // }

  addCanonicalUrl(): void {
    const path = this.router.url.split('?')[0]; // Remove query params

    const canonicalUrl = this.BASE_URL.replace(/\/$/, '') + path;

    const existing = this.doc.querySelectorAll("link[rel='canonical']");
    existing.forEach(link => link.remove());

    const canonical = this.doc.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', canonicalUrl);

    this.doc.head.appendChild(canonical);
  }

  addOgUrl(): void {
    const ogUrl = this.BASE_URL.replace(/\/$/, '') + this.router.url;

    this.doc
      .querySelectorAll('meta[property="og:url"], meta[name="og:url"]')
      .forEach((tag) => tag.remove());

    this.meta.addTag({
      property: 'og:url',
      content: ogUrl,
    });
  }

  shouldLoadSeo(url: string): boolean {
    // REMOVE QUERY PARAMS
    const cleanUrl = url.split('?')[0];

    // HOME PAGE
    if (cleanUrl === '/') {
      return true;
    }

    // STATIC PAGES
    if (
      cleanUrl === '/about-us' ||
      cleanUrl === '/contact-us' ||
      cleanUrl === '/blog' ||
      cleanUrl === '/privacy-policy' ||
      cleanUrl === '/instant-booking' ||
      cleanUrl === '/terms-conditions' ||
      cleanUrl === '/login' ||
      cleanUrl === '/faq' ||
      cleanUrl === '/operators' ||
      cleanUrl === '/routes' ||
      cleanUrl === '/offers' ||
      cleanUrl === '/cancelation-policy'
    ) {
      return true;
    }

    // ROUTE SEO
    if (cleanUrl.includes('/routes/')) {
      return true;
    }

    // ROUTE SEO FOR ADVANTAGE PAGES
    if (cleanUrl.includes('/advantage/')) {
      return true;
    }

    // EXCLUDE BLOG LISTING PAGES
    if (cleanUrl.startsWith('/blog/tag/')) {
      return false;
    }

    if (
      cleanUrl.startsWith('/blog/category/') ||
      cleanUrl.startsWith('/blog/author/')
    ) {
      return true;
    }

    // BLOG DETAIL PAGE ONLY
    const segments = cleanUrl.split('/').filter(Boolean);
    if (segments.length === 3 && segments[0] === 'blog') {
      return true;
    }

    return false;
  }

  private link!: HTMLLinkElement;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private httpClient: HttpClient,
    private title: Title,
    private meta: Meta,
    private router: Router,
  ) { }

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
    return this.httpClient
      .post<any>(this.apiURL + '/allseolist', { current_url }, this.httpOptions)
      .pipe(
        tap((resp: any) => {
          if (resp.status == 1) {
            this.seoCache[current_url] = resp.data;

            this.setMeta(resp.data);
          }
        }),
      );
  }

  setMeta(c: any) {
    // Meta Tags
    this.title.setTitle(c?.meta_title || this.metaTitle);

    this.meta.updateTag({
      name: 'description',
      content: c?.meta_description || this.metaDescription,
    });

    this.meta.updateTag({
      name: 'keywords',
      content: c?.meta_keyword || this.metaKeyword,
    });

    this.meta.updateTag({
      property: 'og:title',
      content: c?.meta_title || this.metaTitle,
    });

    this.meta.updateTag({
      property: 'og:description',
      content: c?.meta_description || this.metaDescription,
    });

    // Remove old schema
    this.removeJsonLd();

    // FAQ Schema
    if (c?.faq_schema) {
      const faqScript = this.doc.createElement('script');

      faqScript.type = 'application/ld+json';

      faqScript.text = c.faq_schema;

      faqScript.id = 'faq-schema';

      this.doc.head.appendChild(faqScript);
    }

    // Breadcrumb Schema
    if (c?.breadcrumb_schema) {
      const breadcrumbScript = this.doc.createElement('script');

      breadcrumbScript.type = 'application/ld+json';

      breadcrumbScript.text = c.breadcrumb_schema;

      breadcrumbScript.id = 'breadcrumb-schema';

      this.doc.head.appendChild(breadcrumbScript);
    }

    if (c?.person_schema) {
      const personScript = this.doc.createElement('script');
      personScript.type = 'application/ld+json';
      personScript.text = c.person_schema;
      personScript.id = 'person-schema';

      this.doc.head.appendChild(personScript);
    }

    // Service Schema
    if (c?.service_schema) {
      const serviceScript = this.doc.createElement('script');

      serviceScript.type = 'application/ld+json';

      serviceScript.text = c.service_schema;

      serviceScript.id = 'service-schema';

      this.doc.head.appendChild(serviceScript);
    }

    // Extra Meta
    if (c?.extra_meta) {
      const temp = this.doc.createElement('div');
      temp.innerHTML = c.extra_meta;

      Array.from(temp.children).forEach((node: any) => {
        this.doc.head.appendChild(node.cloneNode(true));
      });
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


  seoList() {
    return this.httpClient
      .get<any>(
        this.apiURL + '/seolist?user_id=' + this.MASTER_SETTING_USER_ID,
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler));
  }

  setOperatorMeta(operatorName: string): void {
    if (!operatorName) {
      return;
    }

    operatorName = operatorName
      .replace(/\s+BUS\s+SERVICE\s*$/i, '')
      .replace(/\s+BUS\s*$/i, '')
      .trim();

    operatorName = operatorName
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());

    console.log(operatorName)

    const title =
      `${operatorName} Bus Tickets, Routes And Booking | ODBUS`;

    const description =
      `Book ${operatorName} bus tickets with ODBUS. View routes, timings, fares, boarding points and seat availability for your journey.`;

    console.log(title);

    // Page Title
    this.title.setTitle(title);

    // Meta Description
    this.meta.updateTag({
      name: 'description',
      content: description
    });

    // Open Graph Title
    this.meta.updateTag({
      property: 'og:title',
      content: title
    });

    // Open Graph Description
    this.meta.updateTag({
      property: 'og:description',
      content: description
    });

    // Canonical URL
    this.addCanonicalUrl();

    // OG URL
    this.addOgUrl();
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
