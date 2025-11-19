import { Component, OnInit, OnDestroy, Input, Inject, PLATFORM_ID } from '@angular/core';
import{ GlobalConstants } from '../constants/global-constants';
import { LoginChecker } from '../helpers/loginChecker';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbDatepickerConfig,NgbModal,NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { DatePipe, formatDate, Location } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
//  templateUrl:GlobalConstants.ismobile? './footer.component.mobile.html':'./footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [DatePipe,NgbActiveModal]
})
export class FooterComponent implements OnInit, OnDestroy {
  url_path = '';
  @Input() session: LoginChecker; 
  isMobile:boolean = false; // Default to false for SSR
  popular_routes: any=[];
  masterSettingRecord:any=[];
  master_info:any=[];
    mastersocial_info:any=[];
    location_list:any=[];
    private commonDataSubscription: any;
  
  constructor(
    private sanitizer: DomSanitizer,
    private commonService: CommonService,
    private deviceService: DeviceDetectorService,
    private dtconfig: NgbDatepickerConfig,
    private spinner: NgxSpinnerService,
    private router: Router,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    // Only detect device in browser, default to false (desktop) for SSR
    this.isMobile = isPlatformBrowser(this.platformId) ? this.deviceService.isMobile() : false;
    this.session = new LoginChecker();  
    
    // Initialize from current commonData if available
    this.updateCommonData();
  }
  
  getImagePath(image :any){
    let objectURL = 'data:image/*;base64,'+image;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   }

   updateCommonData() {
    this.masterSettingRecord = this.commonService.commonData;
    // Safely access nested properties with null checks for SSR
    if (this.masterSettingRecord) {
      this.master_info = this.masterSettingRecord.common || {};
      this.mastersocial_info = this.masterSettingRecord.socialMedia || {};
    } else {
      this.master_info = {};
      this.mastersocial_info = {};
    }
  }

   ngAfterContentChecked(){
    this.updateCommonData();
  }

  ngOnInit(): void {
    // Subscribe to commonData changes
    this.commonDataSubscription = this.commonService.commonData$.subscribe(data => {
      if (data) {
        this.updateCommonData();
      }
    });
    
    // Also check current value immediately
    this.updateCommonData();
    
    // Only access localStorage in browser
    const storedData = isPlatformBrowser(this.platformId) ? localStorage.getItem('PopularInfo') : null;

    if (storedData) {
      const data = JSON.parse(storedData);
      this.popularInfoGetData(data);
    } else {
      const param = {
        user_id: GlobalConstants.MASTER_SETTING_USER_ID,
        locationName: ""
      };

      this.commonService.PopularInfo(param).subscribe(
        resp => {
          console.log(resp.data);
          
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('PopularInfo', JSON.stringify(resp.data));
          }
          this.popularInfoGetData(resp.data);
        },
        error => {
          console.error('Error fetching PopularInfo:', error); 
        }
      );
    } 
  }

  ngOnDestroy(): void {
    if (this.commonDataSubscription) {
      this.commonDataSubscription.unsubscribe();
    }
  }

  popularInfoGetData(resp: any) {
    const current = new Date();
    this.dtconfig.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };

    this.popular_routes = resp.popularRoutes;
    this.location_list = resp.locationName;
    let maxDate = current.setDate(current.getDate() + resp.common.advance_days_show); 
    const max = new Date(maxDate);
    this.dtconfig.maxDate = { year: max.getFullYear(), month:  max.getMonth() + 1, day: max.getDate() };
  }

  CurrentDate:any = new Date();

  popularSearch(sr:any,ds:any){
    this.CurrentDate = this.datePipe.transform(this.CurrentDate, 'dd-MM-yyyy');

    // Only use window.location in browser
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = GlobalConstants.URL+sr+'-'+ds+'-bus-services?date='+this.CurrentDate;
    } else {
      // For SSR, use router navigation
      this.router.navigate([sr+'-'+ds+'-bus-services'], { queryParams: { date: this.CurrentDate } });
    }
  }

}
