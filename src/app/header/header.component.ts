import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
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
  styleUrls: ['./header.component.css'],
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
  private readonly TOP_BAR_KEY = 'topBarClosedAt';
  private readonly HIDE_DURATION = 12 * 60 * 60 * 1000;

  private commonDataSubscription: Subscription;

  constructor(
    private router: Router,
    private titleService: Title,
    private commonService: CommonService,
    private metaService: Meta,
    private seo: SeoService,
    location: Location,
    private deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: Object,
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

    this.commonDataSubscription = this.commonService.commonData$.subscribe(
      (data) => {
        if (data) {
          this.masterSettingRecord = data;
          this.updateLogoFromCommonData();
        }
      },
    );

    this.updateLogoFromCommonData();

    // Jagan
    this.router.events.subscribe(() => {
      this.checkTopBarVisibility();
    });
    this.checkTopBarVisibility();
    // Jagan
  }

  // Jagan
  checkTopBarVisibility() {
    // Only homepage
    const isHomePage = this.router.url === '/';

    if (!isHomePage) {
      this.showTopBar = false;
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      this.showTopBar = true;
      return;
    }

    const closedAt = localStorage.getItem(this.TOP_BAR_KEY);

    if (closedAt) {
      const closedTime = Number(closedAt);
      const now = Date.now();

      // If less than 12 hours passed, keep hidden
      if (now - closedTime < this.HIDE_DURATION) {
        this.showTopBar = false;
        return;
      }

      // After 12 hours, remove old data
      localStorage.removeItem(this.TOP_BAR_KEY);
    }

    this.showTopBar = true;
  }

  closeTopBar() {
    this.showTopBar = false;
    // Save current timestamp
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOP_BAR_KEY, Date.now().toString());
    }
  }
  // Jagan

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

  scrollToDownload() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const element = document.getElementById('downloadappnew');

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      this.closeTopBar();
    }
  }
}
