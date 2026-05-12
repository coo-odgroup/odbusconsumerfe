import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationdataService } from '../services/locationdata.service';
import { NotificationService } from '../services/notification.service';
import { PopularRoutesService } from '../services/popular-routes.service';
import { TopOperatorsService } from '../services/top-operators.service';
import { OfferService } from '../services/offer.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { interval, Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalConstants } from '../constants/global-constants';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../services/seo.service';
import { DatePipe, formatDate, Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbDatepickerConfig,
  NgbModal,
  NgbActiveModal,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { LoginChecker } from '../helpers/loginChecker';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  // templateUrl:GlobalConstants.ismobile? './home.component.mobile.html':'./home.component.html',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe, NgbActiveModal, NgbAlertConfig],
})
export class HomeComponent implements OnInit, AfterViewInit {
  showAppPopup: boolean = false; // Flag to control app download popup visibility
  public searchForm: FormGroup;
  public appForm: FormGroup;

  // Flag to control app download popup visibility close function
  closeAppPopup() {
    this.showAppPopup = false;
  }

  /* =====================================
ADVANTAGE CARD SLIDER WORKING BUTTONS
===================================== */

  moveSlider(direction: number) {
    const slider: any = document.getElementById('cardsScroll');
    if (!slider) return;

    const scrollAmount = 420; // card move distance

    slider.scrollTo({
      left: slider.scrollLeft + direction * scrollAmount,
      behavior: 'smooth',
    });

    setTimeout(() => {
      this.updateSliderButtons();
    }, 500);
  }

  /* BUTTON SHOW / HIDE */
  updateSliderButtons() {
    const slider: any = document.getElementById('cardsScroll');
    const prevBtn: any = document.querySelector('.prev-btn');
    const nextBtn: any = document.querySelector('.next-btn');

    if (!slider || !prevBtn || !nextBtn) return;

    /* LEFT BUTTON */
    if (slider.scrollLeft <= 5) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
    }

    /* RIGHT BUTTON */
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'flex';
    }
  }

  @ViewChild('popup') popup: TemplateRef<any>;

  PopularInfo: any;

  submitted = false;
  appsubmitted = false;
  @Input()
  session: LoginChecker;

  public keyword = 'name';
  url_path: any = [];
  position = 'bottom-right';
  swapdestination: any;
  swapsource: any;
  bannerImage = '../../assets/img/bus-bg.jpg';
  source: any;
  source_id: any;
  destination: any;
  destination_id: any;
  entdate: any;

  popular_routes: any = [];
  topOperators: any = [];

  setAlert: any = '';

  recentSearchFrom: any;
  recentSearchTo: any;
  recentSearchDt: any;

  active = 1;

  search: any = (text$: Observable<string>) => text$.pipe(map(() => [])); // Default empty search function
  location_list: any = []; // Initialize as empty array
  formatter: any = (x: { name: string }) => x.name; // Default formatter

  //Bus_Offers:any=[];
  //Festive_Offers:any=[];
  activeTab: any = 'Bus Offers';
  offerList: any = [];
  Offers: any = [];

  meta_title = '';
  meta_keyword = '';
  meta_description = '';

  seolist: any;
  currentUrl: any;
  selectedDate: any;

  masterSettingRecord: any = {}; // Initialize as empty object instead of array
  master_info: any = {};
  isMobile: boolean = false; // Default to false for SSR (desktop view)

  countdown_status: number = 0; // Initialize countdown_status
  countdown_title: string = '';
  countdown_enddate: string = '';
  countdown_endtime: string = '';
  endDate: string = '';

  MenuActive: boolean = false;

  model: NgbDateStruct;
  activeMenu: string;

  CurrentDate: any = new Date();

  configcount = {
    leftTime: 60 * 60 * 24 * 14 + 60 * 30 + 36000,
    format: 'dd [Day] hh [hr] mm [min]',
  };

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  public isExpired: boolean = false;
  bloglist: any;

  private apiurl = GlobalConstants.BASE_URL;
  baseurl = GlobalConstants.PATHURL;

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private locationService: LocationdataService,
    private dtconfig: NgbDatepickerConfig,
    private notify: NotificationService,
    private spinner: NgxSpinnerService,
    private popularRoutesService: PopularRoutesService,
    private topOperatorsService: TopOperatorsService,
    private offerService: OfferService,
    private sanitizer: DomSanitizer,
    private commonService: CommonService,
    private seo: SeoService,
    private location: Location,
    private deviceService: DeviceDetectorService,
    private modalService: NgbModal,
    private alertConfig: NgbAlertConfig,
    private datePipe: DatePipe,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.session = new LoginChecker();

    // Only access localStorage in browser
    if (isPlatformBrowser(this.platformId)) {
      this.recentSearchFrom = localStorage.getItem('source');
      this.recentSearchTo = localStorage.getItem('destination');
      this.recentSearchDt = localStorage.getItem('entdate');
    }

    this.recentSearchDt = this.showformattedDate(this.recentSearchDt);

    alertConfig.type = 'success';
    alertConfig.dismissible = false;

    this.appForm = this._fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    // Only detect device in browser, default to false (desktop) for SSR
    this.isMobile = isPlatformBrowser(this.platformId)
      ? this.deviceService.isMobile()
      : false;

    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);

    // Only access localStorage in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('bookingdata');
      localStorage.removeItem('busRecord');
      localStorage.removeItem('genderRestrictSeats');
      localStorage.removeItem('source_id');
      localStorage.removeItem('destination_id');
    }

    this.searchForm = _fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required],
      entry_date: ['', Validators.required],
    });
  }

  setPopularInfoData(resp: any) {
    // Defensive checks: avoid synchronous throws during SSR if resp is missing or malformed
    if (!resp || typeof resp !== 'object' || !resp.common) {
      console.warn(
        'HomeComponent.setPopularInfoData: invalid PopularInfo payload',
        resp,
      );
      return;
    }

    try {
      this.masterSettingRecord = resp;

      this.popular_routes = resp.popularRoutes || [];
      let topOperators = resp.topOperators || {};
      const mapped = Object.keys(topOperators).map((key) => topOperators[key]);
      this.topOperators = mapped || [];
      this.endDate =
        (resp.common && (resp.common.countdown_enddate || '')) +
        ' ' +
        (resp.common && (resp.common.countdown_endtime || ''));
      // console.log(this.endDate);
      this.countdown_status = resp.common.countdown_status || 0;
      this.countdown_title = resp.common.countdown_title || '';

      this.location_list = resp.locationName || [];
      this.search = (text$: Observable<string>) =>
        text$.pipe(
          debounceTime(200),
          map((term) =>
            term === ''
              ? []
              : this.location_list
                  .filter(
                    (v) =>
                      v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                      (v.synonym != '' &&
                        v.synonym != null &&
                        v.synonym.toLowerCase().indexOf(term.toLowerCase()) >
                          -1),
                  )
                  .slice(0, 10),
          ),
        );

      this.formatter = (x: { name: string }) => x.name;

      this.Offers = resp.offers;
      this.getOffer();

      if (
        this.masterSettingRecord.banner_image != '' &&
        this.masterSettingRecord.banner_image != null
      ) {
        this.bannerImage = this.masterSettingRecord.banner_image;
      } else {
        this.bannerImage = '../../assets/img/bus-bg.jpg';
      }

      this.master_info = this.masterSettingRecord.common;

      const current = new Date();
      this.dtconfig.minDate = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate(),
      };

      let maxDate = current.setDate(
        current.getDate() + resp.common.advance_days_show,
      );

      const max = new Date(maxDate);
      this.dtconfig.maxDate = {
        year: max.getFullYear(),
        month: max.getMonth() + 1,
        day: max.getDate(),
      };

      this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
    } catch (e) {
      console.error(
        'HomeComponent.setPopularInfoData: error applying PopularInfo',
        e,
        resp,
      );
      // keep component in a safe default state
      this.popular_routes = this.popular_routes || [];
      this.topOperators = this.topOperators || [];
      this.location_list = this.location_list || [];
      this.Offers = this.Offers || [];
    }
  }

  private initializeDefaults(): void {
    // Set safe defaults so page renders even without PopularInfo data
    // console.log('HomeComponent.initializeDefaults() called');
    const current = new Date();
    this.dtconfig.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };

    // Default max date: 30 days ahead
    let maxDate = current.setDate(current.getDate() + 30);
    const max = new Date(maxDate);
    this.dtconfig.maxDate = {
      year: max.getFullYear(),
      month: max.getMonth() + 1,
      day: max.getDate(),
    };

    this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
    this.bannerImage = '../../assets/img/bus-bg.jpg';
    this.location_list = [];
    this.popular_routes = [];
    this.topOperators = [];
    this.Offers = [];
    this.countdown_status = 0;
    this.countdown_title = '';
    this.endDate = '';

    // Default empty search function (will be updated if PopularInfo loads)
    this.search = (text$: Observable<string>) => text$.pipe(map(() => []));
    this.formatter = (x: { name: string }) => x.name;
  }
  ngOnInit() {
    const reddata = {
      limit: 3,
    };
    // this.http.post(this.apiurl + '/bloglist', reddata).subscribe((res: any) => {
    //   this.bloglist = res.data.blogs;
    // });

    // console.log('HomeComponent.ngOnInit() called');

    // Initialize with safe defaults (ensures page renders even without PopularInfo)
    this.initializeDefaults();

    // Use pre-loaded PopularInfo from AppInitializer (set during app bootstrap)
    const popularInfo = this.commonService.getPopularInfo();
    // console.log(
    //   'PopularInfo from service:',
    //   popularInfo ? 'loaded' : 'NOT loaded',
    // );
    if (popularInfo) {
      // console.log('Using pre-loaded PopularInfo');
      this.setPopularInfoData(popularInfo);
    } else {
      // Fallback: if initializer didn't load it (e.g., API error), try loading from cache
      const storedData = isPlatformBrowser(this.platformId)
        ? localStorage.getItem('PopularInfo')
        : null;
      if (storedData) {
        // console.log('Loading PopularInfo from localStorage');
        try {
          const data = JSON.parse(storedData);
          this.setPopularInfoData(data);
        } catch (e) {
          console.error('Error parsing cached PopularInfo:', e);
        }
      } else if (isPlatformBrowser(this.platformId)) {
        // Last resort: fetch from API (browser only, don't block SSR)
        // console.log('Fetching PopularInfo from API as fallback');
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
    }

    this.startCountdown();

    this.searchForm = this._fb.group({
      source: [null],
      destination: [null],
      entry_date: [null],
    });

    // for app download popup: only show in browser and on mobile devices, with a delay

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.isMobile) {
          this.showAppPopup = true;
        }
      }, 1000);
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

  menu() {
    this.MenuActive = this.MenuActive == false ? true : false;
    this.activeMenu = '';
    this.modalService.dismissAll();
  }

  bookAgain() {
    let recentSearchDt = this.showformattedDate(
      localStorage.getItem('entdate'),
    );
    let currentDt = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');

    if (currentDt > recentSearchDt) {
      recentSearchDt = currentDt;
    }

    let recentSearchTo = '';
    let recentSearchFrom = '';

    this.location_list.filter((itm) => {
      if (this.recentSearchTo === itm.name) {
        recentSearchTo = itm;
      }

      if (this.recentSearchFrom === itm.name) {
        recentSearchFrom = itm;
      }
    });

    recentSearchDt = formatDate(
      new Date(recentSearchDt),
      'dd-MM-yyyy',
      'en_US',
    );

    if (recentSearchFrom != '' && recentSearchTo != '') {
      this.listing(recentSearchFrom, recentSearchTo, recentSearchDt);
    }
  }

  showformattedDate(date: any) {
    if (date) {
      let dt = date.split('-');
      let dd = new Date(dt[2] + '-' + dt[1] + '-' + dt[0]);

      return dt[2] + '-' + dt[1] + '-' + dt[0];
    }
  }

  operator_detail(url: any) {
    if (url != '') {
      this.router.navigate(['operator/' + url]);
    }
  }

  onlyNumbers(event: any) {
    var e = event;
    var charCode = e.which || e.keyCode;

    if (
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 96 && charCode <= 105) ||
      charCode == 8 ||
      charCode == 9
    )
      return true;
    return false;
  }

  submitAppForm() {
    this.appsubmitted = true;
    this.setAlert = '';

    if (this.appForm.invalid) {
      return;
    } else {
      this.spinner.show();

      const param = {
        phone: this.appForm.value.phone,
      };

      this.popularRoutesService.downloadApp(param).subscribe((res) => {
        if (res.status == 1) {
          this.setAlert = 'SMS has been sent to your phone';
        }

        this.appsubmitted = false;
        this.appForm.reset();
        this.spinner.hide();
      });
    }
  }

  entry_date: any = null;

  get f() {
    return this.appForm.controls;
  }

  onDateSelect(event: any) {
    this.entry_date = event;

    let dt = event;

    this.selectedDate = [dt.year, dt.month, dt.day].join('-');
    this.modalService.dismissAll();
  }

  swap() {
    if (this.searchForm.value.source) {
      this.swapdestination = this.searchForm.value.source;
    }

    if (this.searchForm.value.destination) {
      this.swapsource = this.searchForm.value.destination;
    }
  }

  tabChange(val) {
    // Guard DOM access for SSR: only manipulate DOM in browser and if element exists
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(val);
      if (el) {
        try {
          el.focus();
        } catch (e) {}
        try {
          el.click();
        } catch (e) {}
      }
    }
  }

  listing(s: any, d: any, dt: any) {
    // console.log(s);
    // console.log(d);
    // console.log(dt);

    this.locationService.setSource(s);
    this.locationService.setDestination(d);
    this.locationService.setDate(dt);
    this.router.navigate(['/listing']);
  }

  OpenCalendar(calendar) {
    this.modalService.open(calendar, { centered: true });
  }

  // bannerpopup:any="../../assets/img/starpower_discount.jpg";
  popupData: any = [];

  // ngAfterViewInit(): void {

  //   this.CurrentDate = this.datePipe.transform(this.CurrentDate, 'yyyy-MM-dd');

  //   const current = new Date();
  //   const timestamp = current.getTime();

  //   this.popupData = this.commonService.commonData;

  //   if (this.popupData.common.popup_status == 1) {

  //     const popup_s_datetime = new Date(this.popupData.common.popup_start_date + " " + this.popupData.common.popup_start_time);
  //     const popup_st_datetime = popup_s_datetime.getTime();

  //     const popup_e_datetime = new Date(this.popupData.common.popup_end_date + " " + this.popupData.common.popup_end_time);

  //     const popup_end_datetime = popup_e_datetime.getTime();

  //     if (popup_st_datetime <= timestamp && timestamp <= popup_end_datetime) {
  //       this.modalService.open(this.popup);
  //     }

  //   }

  // }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.CurrentDate = this.datePipe.transform(this.CurrentDate, 'yyyy-MM-dd');

    const current = new Date();
    const timestamp = current.getTime();

    // read commonData safely
    this.popupData = this.commonService?.commonData || {};

    // guard against missing common or popup properties
    const common = this.popupData?.common;
    if (!common) {
      // nothing to do — safe exit
      return;
    }

    if (common.popup_status == 1) {
      // guard date fields exist before constructing Date
      const startDateStr = (common.popup_start_date || '').trim();
      const startTimeStr = (common.popup_start_time || '').trim();
      const endDateStr = (common.popup_end_date || '').trim();
      const endTimeStr = (common.popup_end_time || '').trim();

      if (startDateStr && startTimeStr && endDateStr && endTimeStr) {
        const popup_s_datetime = new Date(
          startDateStr + ' ' + startTimeStr,
        ).getTime();
        const popup_e_datetime = new Date(
          endDateStr + ' ' + endTimeStr,
        ).getTime();

        if (!isNaN(popup_s_datetime) && !isNaN(popup_e_datetime)) {
          if (popup_s_datetime <= timestamp && timestamp <= popup_e_datetime) {
            this.modalService.open(this.popup);
          }
        }
      }
    }

    /* =========================================
   FAQ WORKING WITHOUT ID / EXTRA CLASSES
   USE YOUR CURRENT HTML ONLY
   REPLACE ONLY FAQ PART INSIDE ngAfterViewInit()
========================================= */

    setTimeout(() => {
      const tabs = document.querySelectorAll('.faq-tabs li');
      const panes = document.querySelectorAll('.tab-content .tab-pane');

      /* DEFAULT SHOW GENERAL */
      tabs.forEach((tab: any, i: number) => {
        tab.classList.remove('active');
        panes[i].classList.remove('active', 'in');
      });

      if (tabs.length > 0) tabs[0].classList.add('active');
      if (panes.length > 0) panes[0].classList.add('active', 'in');

      /* TAB CLICK SWITCH */
      tabs.forEach((tab: any, index: number) => {
        tab.addEventListener('click', (e: any) => {
          e.preventDefault();

          tabs.forEach((t: any, i: number) => {
            t.classList.remove('active');
            panes[i].classList.remove('active', 'in');
          });

          tab.classList.add('active');
          panes[index].classList.add('active', 'in');
        });
      });

      /* FAQ OPEN CLOSE */
      const questions = document.querySelectorAll('.faq-question');

      questions.forEach((question: any) => {
        question.addEventListener('click', () => {
          const item = question.closest('.faq-item');
          const pane = question.closest('.tab-pane');
          const answer = item.querySelector('.faq-answer');

          /* close same tab others */
          pane.querySelectorAll('.faq-item').forEach((other: any) => {
            if (other !== item) {
              other.classList.remove('active');

              const otherAns = other.querySelector('.faq-answer');
              if (otherAns) otherAns.style.display = 'none';
            }
          });

          /* toggle current */
          if (item.classList.contains('active')) {
            item.classList.remove('active');
            answer.style.display = 'none';
          } else {
            item.classList.add('active');
            answer.style.display = 'block';
          }
        });
      });
    }, 300);

    // ODBUS Advantage card slider: show/hide buttons on scroll (guard DOM access for SSR)
    setTimeout(() => {
      const slider: any = document.getElementById('cardsScroll');

      if (slider) {
        /* first load */
        this.updateSliderButtons();

        /* manual scroll */
        slider.addEventListener('scroll', () => {
          this.updateSliderButtons();
        });

        /* resize */
        window.addEventListener('resize', () => {
          this.updateSliderButtons();
        });
      }
    }, 500);
  }

  getImagePath(slider_img: any) {
    let objectURL = 'data:image/*;base64,' + slider_img;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
  }

  searchToday() {
    const today = new Date();

    this.searchForm.patchValue({
      entry_date: this.formatDate(today),
    });

    this.submitForm();
  }

  searchTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.searchForm.patchValue({
      entry_date: this.formatDate(tomorrow),
    });

    this.submitForm();
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  submitForm() {
    if (this.isMobile == true && this.entry_date != null) {
      this.searchForm.patchValue({
        entry_date: this.entry_date,
      });
    }

    if (!this.searchForm.value.source) {
      this.notify.notify('Enter Source !', 'Error');
      return;
    }

    if (!this.searchForm.value.destination) {
      this.notify.notify('Enter Destination !', 'Error');
      return;
    }

    if (!this.searchForm.value.entry_date) {
      this.notify.notify('Enter Journey Date !', 'Error');
      return;
    }

    let dt = this.searchForm.value.entry_date;
    let formattedDate = '';

    // Case 1: Quick button already gives string
    if (typeof dt === 'string') {
      formattedDate = dt;
    }

    // Case 2: Datepicker gives object
    else if (dt.day && dt.month && dt.year) {
      let day = String(dt.day).padStart(2, '0');
      let month = String(dt.month).padStart(2, '0');

      formattedDate = `${day}-${month}-${dt.year}`;
    } else {
      this.notify.notify('Invalid Date !', 'Error');
      return;
    }

    this.searchForm.patchValue({
      entry_date: formattedDate,
    });

    let sr = this.searchForm.value.source.url;
    let ds = this.searchForm.value.destination.url;

    if (!this.searchForm.value.source.name) {
      this.notify.notify('Select Valid Source !', 'Error');
      return;
    }

    if (!this.searchForm.value.destination.name) {
      this.notify.notify('Select Valid Destination !', 'Error');
      return;
    }

    this.saveSearchHistory(sr, ds, formattedDate);

    window.location.href =
      GlobalConstants.URL +
      'routes/' +
      sr +
      '-' +
      ds +
      '-bus-services?date=' +
      formattedDate;
  }

  saveSearchHistory(sr: string, ds: string, date: string) {
    const newSearch = {
      source: sr,
      destination: ds,
      date: date,
      url: `routes/${sr}-${ds}-bus-services?date=${date}`,
      searchedAt: new Date().toISOString(),
    };

    let history = JSON.parse(localStorage.getItem('recentSearches') || '[]');

    // Find same source + destination
    const existingIndex = history.findIndex(
      (item: any) => item.source === sr && item.destination === ds,
    );

    if (existingIndex !== -1) {
      // Remove old record
      history.splice(existingIndex, 1);
    }

    // Add updated/new record at top
    history.unshift(newSearch);

    // Keep only latest 5
    history = history.slice(0, 5);

    localStorage.setItem('recentSearches', JSON.stringify(history));
  }

  getOffer() {
    //this.activeTab=typ;
    this.offerList = []; //this.Offers.filter(data => data.occassion == typ);

    this.Offers.forEach((element) => {
      this.offerList.push({ path: element.slider_photo, width: 0, height: 0 });
    });

    //console.log(this.offerList);
  }

  private countdownSubscription!: Subscription;

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  private startCountdown(): void {
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const end = new Date(this.endDate).getTime();
    const distance = end - now;

    if (distance < 0) {
      this.isExpired = true;
      // Timer has expired
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;

      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
      return;
    }

    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000); // Optional
  }
}
