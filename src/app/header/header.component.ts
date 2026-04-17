import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { LoginChecker } from '../helpers/loginChecker';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../services/seo.service';
import { CommonService } from '../services/common.service';
import { GlobalConstants } from '../constants/global-constants';
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() masterSettingRecord;
  @Input() session: LoginChecker;

  collapsed = true;
  user: any = {};
  logo: any = '';
  isMobile: boolean = false;

  // ✅ TOP BAR CONTROL
  showTopBar: boolean = true;

  private commonDataSubscription: Subscription;

  constructor(
    private router: Router,
    private titleService: Title,
    private commonService: CommonService,
    private metaService: Meta,
    private seo: SeoService,
    location: Location,
    private deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.isMobile = isPlatformBrowser(this.platformId)
      ? this.deviceService.isMobile()
      : false;

    this.session = new LoginChecker();
    this.updateLogoFromCommonData();
  }

  updateLogoFromCommonData() {
    this.masterSettingRecord = this.commonService.commonData;

    if (this.masterSettingRecord && this.masterSettingRecord.common) {
      this.logo = this.masterSettingRecord.common.logo_image || '';
    } else {
      this.logo = '';
    }
  }

  ngAfterContentChecked() {
    this.updateLogoFromCommonData();
  }

  ngOnInit(): void {
    this.user = this.session.getUser();

    this.commonDataSubscription = this.commonService.commonData$.subscribe(data => {
      if (data) {
        this.masterSettingRecord = data;
        this.updateLogoFromCommonData();
      }
    });

    this.updateLogoFromCommonData();
  }

  ngOnDestroy(): void {
    if (this.commonDataSubscription) {
      this.commonDataSubscription.unsubscribe();
    }
  }

  signOut() {
    if (this.session.isLoggedIn()) {
      this.session.logout();
      this.router.navigate(['login']);
    }
  }

  // ✅ CLOSE BAR (only hides until refresh)
  closeTopBar() {
    this.showTopBar = false;
  }
}