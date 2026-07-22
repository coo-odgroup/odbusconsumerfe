import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from './services/seo.service';
import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { GlobalConstants } from './constants/global-constants';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
  Router,
  NavigationEnd,
  NavigationStart,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { CommonService } from './services/common.service';
import { filter } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { interval, Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  authReady: boolean = false;
  isBrowser: boolean = false;

  meta_title: any;
  meta_keyword: any;
  meta_description: any;
  storage_version: any;
  logo: any = '';
  og_image: any = '';
  common: any = [];

  isMobile: boolean = false;
  deviceReady: boolean = false;
  showLoader = true;

  private detectMobile(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return this.deviceService.isMobile() || window.innerWidth <= 768;
    }

    if (isPlatformServer(this.platformId) && this.request) {
      const userAgent =
        (this.request.headers &&
          (this.request.headers['user-agent'] ||
            this.request.headers['User-Agent'])) ||
        (typeof this.request.get === 'function' &&
          this.request.get('user-agent')) ||
        '';
      return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
        userAgent,
      );
    }

    return false;
  }

  constructor(
    @Inject(DOCUMENT) private doc,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request: any,
    private auth: AuthService,
    private titleService: Title,
    private metaService: Meta,
    private commonService: CommonService,
    private deviceService: DeviceDetectorService,
    public router: Router,
    private seoService: SeoService,
    private spinner: NgxSpinnerService,
  ) {
    this.isMobile = this.detectMobile();
    // Only access localStorage in browser
    // if (isPlatformBrowser(this.platformId)) {
    //   // this.auth.getToken().subscribe(
    //   //   res => {
    //   //     localStorage.setItem('AuthAccessToken', res.data);
    //   //   }
    //   // );

    //   const AuthAccessToken = localStorage.getItem('AuthAccessToken');

    //   if (AuthAccessToken) {
    //     // Nothing to do
    //   } else {
    //     this.auth.getToken().subscribe(
    //       res => {
    //         localStorage.setItem('AuthAccessToken', res.data);
    //       }
    //     );
    //   }
    // }
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.seoService.seolist(event.urlAfterRedirects).subscribe();
      });
  }

  // ngOnInit() {
  //   // Only access localStorage in browser
  //   if (isPlatformBrowser(this.platformId)) {
  //     const storedData = localStorage.getItem('commonData');

  //     if (storedData) {
  //       const data = JSON.parse(storedData);
  //       this.getCommonInfo(data);
  //     } else {
  //       if (isPlatformBrowser(this.platformId)) {
  //         this.isMobile = this.deviceService.isMobile();
  //       }
  //       const param = {
  //         user_id: GlobalConstants.MASTER_SETTING_USER_ID,
  //         locationName: ""
  //       };

  //       this.commonService.getCommonData(param).subscribe(
  //         resp => {
  //           if (isPlatformBrowser(this.platformId)) {
  //             localStorage.setItem('commonData', JSON.stringify(resp.data));
  //           }
  //           this.getCommonInfo(resp.data);
  //         },
  //         error => {
  //           console.error('Error fetching Data:', error);
  //         }
  //       );
  //     }
  //   } else {
  //     // Server-side: fetch data without localStorage
  //     const param = {
  //       user_id: GlobalConstants.MASTER_SETTING_USER_ID,
  //       locationName: ""
  //     };

  //     this.commonService.getCommonData(param).subscribe(
  //       resp => {
  //         this.getCommonInfo(resp.data);
  //       },
  //       error => {
  //         console.error('Error fetching Data:', error);
  //       }
  //     );
  //   }
  // }

  ngOnInit() {
    this.seoService.getOrganizationSchema().subscribe((res: any) => {
      this.seoService.addOrganizationSchema(res.organization_schema);
      this.storage_version = res.storage_version;
      this.storeLocalStorage();
      this.checkLocalStorageVersion();
      this.startApplication();
    });

    // this.seoService.addCanonicalUrlFromCurrentUrl();.

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.seoService.addCanonicalUrl();
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.seoService.addOgUrl();
      });

    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isMobile = this.detectMobile();
    this.deviceReady = true;

    // =========================
    // AUTH TOKEN CHECK
    // =========================

    if (isPlatformBrowser(this.platformId)) {
      const AuthAccessToken = localStorage.getItem('AuthAccessToken');

      if (AuthAccessToken) {
        // token already exists
        this.authReady = true;

        this.loadCommonData();
      } else {
        // token not found -> generate token
        this.auth.getToken().subscribe({
          next: (res: any) => {
            localStorage.setItem('AuthAccessToken', res.data);

            // token ready
            this.authReady = true;

            // now load app data
            this.loadCommonData();
          },

          error: (err) => {
            console.log('Token Error:', err);

            // prevent infinite loader
            this.authReady = true;
          },
        });
      }
    } else {
      // SSR SIDE

      this.authReady = true;

      const param = {
        user_id: GlobalConstants.MASTER_SETTING_USER_ID,
        locationName: '',
      };

      this.commonService.getCommonData(param).subscribe(
        (resp: any) => {
          this.getCommonInfo(resp.data);
        },

        (error: any) => {
          console.error('Error fetching Data:', error);
        },
      );
    }
  }

  storeLocalStorage() {
    const param = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
      locationName: '',
    };
    this.commonService.PopularInfo(param).subscribe(
      (resp) => {
        const data = resp && resp.data ? resp.data : resp;
        this.setPopularInfoData(data);
        localStorage.setItem('PopularInfo', JSON.stringify(data));
      },
      (error) => {
        console.error('Error fetching PopularInfo:', error);
      },
    );
  }

  startApplication() {

    const token = localStorage.getItem('AuthAccessToken');

    if (token) {
      this.loadCommonData();
    } else {
      this.auth.getToken().subscribe((res: any) => {
        localStorage.setItem('AuthAccessToken', res.data);
        this.loadCommonData();
      });
    }
  }

  checkLocalStorageVersion(): void {
    const STORAGE_VERSION = String(this.storage_version);

    const currentVersion = localStorage.getItem('storage_version');

    if (currentVersion !== STORAGE_VERSION) {
      // Clear all old local storage
      // localStorage.clear();
      // localStorage.removeItem('commonData');
      // localStorage.removeItem('PopularInfo');

      const gclLs = localStorage.getItem('_gcl_ls');
      const authAccessToken = localStorage.getItem('AuthAccessToken');
      const recentSearches = localStorage.getItem('recentSearches');

      localStorage.clear();
      // sessionStorage.clear();

      if (gclLs !== null) {
        localStorage.setItem('_gcl_ls', gclLs);
      }

      if (authAccessToken !== null) {
        localStorage.setItem('AuthAccessToken', authAccessToken);
      }

      if (recentSearches !== null) {
        localStorage.setItem('recentSearches', recentSearches);
      }

      // Save new version
      localStorage.setItem('storage_version', STORAGE_VERSION);
    }
  }

  loadCommonData() {
    this.isMobile = this.detectMobile();

    const storedData = localStorage.getItem('commonData');

    if (storedData) {
      const data = JSON.parse(storedData);

      this.getCommonInfo(data);
    } else {
      const param = {
        user_id: GlobalConstants.MASTER_SETTING_USER_ID,
        locationName: '',
      };

      this.commonService.getCommonData(param).subscribe(
        (resp: any) => {
          localStorage.setItem('commonData', JSON.stringify(resp.data));

          this.getCommonInfo(resp.data);
        },

        (error: any) => {
          console.error('Error fetching Data:', error);
        },
      );
    }
  }

  getCommonInfo(resp: any) {
    if (resp.common.maintenance == 1) {
      this.router.navigate(['maintenance']);
    }

    this.commonService.setCommonData(resp);

    this.common = resp.common;

    // console.log(this.common);

    this.meta_description = this.common.meta_description;
    this.meta_title = this.common.meta_title;
    this.meta_keyword = this.common.meta_keyword;
    this.titleService.setTitle(this.meta_title);

    const metaArr = [
      { name: 'keywords', content: this.meta_keyword },
      { name: 'description', content: this.meta_description },
      // { name: 'og:url', content: this.doc.URL },
      { name: 'og:type', content: 'website' },
      { name: 'og:title', content: this.meta_title },
      { name: 'og:description', content: this.meta_description },
    ];

    if (this.og_image != '' && this.og_image != null) {
      metaArr.push({ name: 'og:image', content: this.og_image });
    }

    if (
      this.common.google_verification_code != '' &&
      this.common.google_verification_code != null
    ) {
      metaArr.push({
        name: 'google-site-verification',
        content: this.common.google_verification_code,
      });
    }

    if (
      this.common.bing_verification_code != '' &&
      this.common.bing_verification_code != null
    ) {
      metaArr.push({
        name: 'msvalidate.01',
        content: this.common.bing_verification_code,
      });
    }

    if (
      this.common.pintrest_verification_code != '' &&
      this.common.pintrest_verification_code != null
    ) {
      metaArr.push({
        name: 'p:domain_verify',
        content: this.common.pintrest_verification_code,
      });
    }

    this.metaService.addTags(metaArr);

    // Only manipulate DOM in browser
    // if (isPlatformBrowser(this.platformId)) {
    //   if (this.common.google_analytics != '' && this.common.google_analytics != null) {
    //     let chatScript = this.doc.createElement("script");
    //     chatScript.type = "text/javascript";
    //     chatScript.async = true;
    //     chatScript.src = this.common.google_analytics;
    //     chatScript.id = "google_analytics";
    //     this.doc.head.appendChild(chatScript);
    //   }

    //   if (this.common.no_script != '' && this.common.no_script != null) {
    //     let chatScript = this.doc.createElement("noscript");
    //     chatScript.innerHTML = this.common.no_script;
    //     chatScript.id = "noscript";
    //     this.doc.head.append(chatScript);
    //   }

    //   if (this.isMobile == false && this.common.seo_script != '' && this.common.seo_script != null) {
    //     let chatScript = this.doc.createElement("script");
    //     chatScript.innerHTML = this.common.seo_script;
    //     chatScript.id = "seo_script";
    //     this.doc.head.append(chatScript);
    //   }
    // }
  }

  popular_routes: any = [];
  topOperators: any = [];
  location_list: any = [];
  search: any = (text$: Observable<string>) => text$.pipe(map(() => []));
  topOperatorLinks: any[] = [];
  popularRoutesLinks: any[] = [];

  setPopularInfoData(resp: any) {
    this.popular_routes = resp.popularRoutes || [];
    this.popularRoutesLinks = this.chunkArray(
      this.popular_routes,
      7
    );

    console.log('this.popularRoutesLinks: ', this.popularRoutesLinks);

    this.topOperators = resp.topOperators || [];
    this.topOperatorLinks = this.chunkArray(
      this.topOperators,
      5
    );

    console.log('this.topOperatorLinks: ', this.topOperatorLinks);

    this.location_list = resp.locationName || [];

    this.search = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map((term) =>
          term === ''
            ? []
            : this.location_list
              .filter(
                (v: any) =>
                  v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                  (v.synonym != '' &&
                    v.synonym != null &&
                    v.synonym.toLowerCase().indexOf(term.toLowerCase()) >
                    -1),
              )
              .slice(0, 10),
        ),
      );
  }

  chunkArray(array: any[], size: number): any[][] {
    const result: any[][] = [];

    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }

    return result;
  }
}
