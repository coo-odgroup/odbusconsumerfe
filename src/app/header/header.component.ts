import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { LoginChecker } from '../helpers/loginChecker';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../services/seo.service';
import { CommonService } from '../services/common.service';
import{ GlobalConstants } from '../constants/global-constants';
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  //templateUrl:GlobalConstants.ismobile? './header.component.mobile.html':'./header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() masterSettingRecord;
   @Input() session: LoginChecker; 

    collapsed = true;    
    user:any={};
    url_path = '';
    logo_image='';

    meta_title = '';
    meta_keyword = '';
    meta_description = '';

    seolist:any;
    currentUrl:any;
    logo:any='';
    isMobile:boolean = false; // Default to false for SSR
    private commonDataSubscription: Subscription;

    constructor( 
      private router: Router,
      private titleService: Title, 
      private commonService: CommonService,
      private metaService: Meta,
      private seo:SeoService,
      location: Location,
      private deviceService: DeviceDetectorService,
      @Inject(PLATFORM_ID) private platformId: Object
    ) { 
      // Only detect device in browser, default to false (desktop) for SSR
      this.isMobile = isPlatformBrowser(this.platformId) ? this.deviceService.isMobile() : false;
        
      
      this.session = new LoginChecker();  
      this.currentUrl = location.path().replace('/','');
      
      // Initialize logo from current commonData if available
      this.updateLogoFromCommonData();
    }

    updateLogoFromCommonData() {
      this.masterSettingRecord = this.commonService.commonData;
      // Safely access logo with null check for SSR
      if (this.masterSettingRecord && this.masterSettingRecord.common) {
        this.logo = this.masterSettingRecord.common.logo_image || '';
      } else {
        this.logo = '';
      }
    }

    ngAfterContentChecked(){
      this.updateLogoFromCommonData();
    }

    ngOnInit(): void {
      this.user = this.session.getUser();
      
      // Subscribe to commonData changes
      this.commonDataSubscription = this.commonService.commonData$.subscribe(data => {
        if (data) {
          this.masterSettingRecord = data;
          this.updateLogoFromCommonData();
        }
      });
      
      // Also check current value immediately
      this.updateLogoFromCommonData();
    }

    ngOnDestroy(): void {
      if (this.commonDataSubscription) {
        this.commonDataSubscription.unsubscribe();
      }
    }

    signOut(){
       if(this.session.isLoggedIn()){
        this.session.logout();
        this.router.navigate(['login']);  
      }
       
    }



}
