import { Component, OnInit, OnDestroy, Input, Inject, PLATFORM_ID, Injector, AfterContentChecked } from '@angular/core';
import { GlobalConstants } from '../constants/global-constants';
import { LoginChecker } from '../helpers/loginChecker';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';
import { NgbDatepickerConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [DatePipe, NgbActiveModal]
})
export class FooterComponent implements OnInit, OnDestroy, AfterContentChecked {
  url_path = '';
  @Input() session: LoginChecker;
  isMobile: boolean = false; // Default safe value for SSR
  popular_routes: any = [];
  masterSettingRecord: any = {};
  master_info: any = {};
  mastersocial_info: any = {};
  location_list: any = [];
  private commonDataSubscription: Subscription | null = null;

  private apiurl = GlobalConstants.BASE_URL;
  // baseurl = "http://localhost:7001/ODBUS/odbusproviderbe/public/";

  bloglist: any;

  constructor(
    private sanitizer: DomSanitizer,
    private commonService: CommonService,
    private dtconfig: NgbDatepickerConfig,
    private spinner: NgxSpinnerService,
    private router: Router,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector, // lazy-get browser-only services
    private http: HttpClient
  ) {
    // Avoid any browser-only calls here. Keep constructor synchronous and safe for SSR.
    this.session = new LoginChecker();

    // Initialize from current commonData if available (safe sync read from service)
    this.updateCommonData();
    this.checkRouteLinksVisibility();
  }

  showRouteLinks = true;

  checkRouteLinksVisibility() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        const url = this.router.url;

        if (url.includes('/booking') || url.includes('/routes/')) {
          this.showRouteLinks = false;
        } else {
          this.showRouteLinks = true;
        }

      });
  }

  getImagePath(image: any) {
    const objectURL = 'data:image/*;base64,' + image;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
  }

  updateCommonData() {
    this.masterSettingRecord = this.commonService.commonData || {};
    this.master_info = this.masterSettingRecord.common || {};
    this.mastersocial_info = this.masterSettingRecord.socialMedia || {};
  }

  ngAfterContentChecked() {
    this.updateCommonData();
  }

  ngOnInit(): void {
    const reddata = {
      "limit": 3
    }
    // this.http.post(this.apiurl + "/bloglist", reddata).subscribe((res: any) => {
    //   this.bloglist = res.data.blogs;
    // });
    // Subscribe to commonData changes
    this.commonDataSubscription = this.commonService.commonData$.subscribe(data => {
      if (data) {
        this.updateCommonData();
      }
    });

    // Immediately ensure local values are up to date
    this.updateCommonData();

    // Determine isMobile only on browser to avoid server instantiation
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Lazy-get DeviceDetectorService only in browser
        const deviceService = this.injector.get(DeviceDetectorService);
        if (deviceService && typeof deviceService.isMobile === 'function') {
          this.isMobile = !!deviceService.isMobile();
        } else {
          // fallback: user-agent check
          this.isMobile = /Mobi|Android/i.test(navigator?.userAgent || '');
        }
      } catch (e) {
        // Fallback if DeviceDetectorService is unavailable
        this.isMobile = /Mobi|Android/i.test((typeof navigator !== 'undefined' && navigator.userAgent) || '');
      }
    } else {
      // On server leave isMobile default (false)
      this.isMobile = false;
    }

    // Use pre-loaded PopularInfo from AppInitializer (handles SSR and browser)
    const popularInfo = this.commonService.getPopularInfo();
    // console.log('PopularInfo in footer:', popularInfo ? 'loaded' : 'NOT loaded');
    if (popularInfo) {
      // console.log('Using pre-loaded PopularInfo in footer');
      this.popularInfoGetData(popularInfo);
    } else {
      // Fallback: check localStorage (browser only)
      if (isPlatformBrowser(this.platformId)) {
        const storedData = localStorage.getItem('PopularInfo');
        if (storedData) {
          //  console.log('Loading PopularInfo from localStorage in footer');
          try {
            const data = JSON.parse(storedData);
            this.popularInfoGetData(data);
            return;
          } catch (e) {
            console.error('Error parsing cached PopularInfo:', e);
          }
        }

        // Last resort: fetch from API (browser only, not SSR blocking)
        //    console.log('Fetching PopularInfo from API as fallback in footer');
        const param = {
          user_id: GlobalConstants.MASTER_SETTING_USER_ID,
          locationName: ""
        };

        this.commonService.PopularInfo(param).subscribe(
          resp => {
            const data = resp && resp.data ? resp.data : resp;
            this.popularInfoGetData(data);
            try {
              localStorage.setItem('PopularInfo', JSON.stringify(data));
            } catch (e) {
              console.warn('Unable to write PopularInfo to localStorage', e);
            }
          },
          error => {
            console.error('Error fetching PopularInfo in footer:', error);
          }
        );
      } else {
        // On server: do nothing (SSR should be using preloaded data)
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {

        const tabs = document.querySelectorAll('.route-tabs li');
        const panes = document.querySelectorAll('.route-link-section .tab-pane');

        tabs.forEach((tab: any, index: number) => {

          tab.addEventListener('click', (e: any) => {
            e.preventDefault();

            tabs.forEach((t: any, i: number) => {
              t.classList.remove('active');
              panes[i].classList.remove('active');
            });

            tab.classList.add('active');
            panes[index].classList.add('active');

          });

        });

      }, 500);
    }
  }

  ngOnDestroy(): void {
    if (this.commonDataSubscription) {
      this.commonDataSubscription.unsubscribe();
      this.commonDataSubscription = null;
    }
  }

  popularInfoGetData(resp: any) {
    // Defensive checks
    if (!resp || typeof resp !== 'object') {
      console.warn('FooterComponent.popularInfoGetData: invalid PopularInfo payload', resp);
      return;
    }

    try {
      const current = new Date();
      this.dtconfig.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };

      this.popular_routes = resp.popularRoutes || [];
      this.location_list = resp.locationName || [];

      const advanceDays = resp.common && resp.common.advance_days_show ? resp.common.advance_days_show : 30;
      const tmp = new Date();
      tmp.setDate(tmp.getDate() + advanceDays);
      this.dtconfig.maxDate = { year: tmp.getFullYear(), month: tmp.getMonth() + 1, day: tmp.getDate() };
    } catch (e) {
      console.error('FooterComponent.popularInfoGetData: error applying PopularInfo', e, resp);
      this.popular_routes = this.popular_routes || [];
      this.location_list = this.location_list || [];
    }
  }

  CurrentDate: any = new Date();

  popularSearch(sr: any, ds: any) {
    this.CurrentDate = this.datePipe.transform(this.CurrentDate, 'dd-MM-yyyy');

    if (isPlatformBrowser(this.platformId)) {
      try {
        window.location.href = GlobalConstants.URL + sr + '-' + ds + '-bus-services?date=' + this.CurrentDate;
      } catch (e) {
        console.warn('Window navigation failed', e);
        this.router.navigate([sr + '-' + ds + '-bus-services'], { queryParams: { date: this.CurrentDate } });
      }
    } else {
      // SSR: use router navigate (server will not perform client navigation)
      this.router.navigate([sr + '-' + ds + '-bus-services'], { queryParams: { date: this.CurrentDate } });
    }
  }
}
