import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { LoginChecker } from '../helpers/loginChecker';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
})
export class PrivacyPolicyComponent implements OnInit {
  pageTitle: any;
  pageContent: any;
  currentUrl: string;
  isMobile: boolean;

  session: LoginChecker;

  MenuActive: boolean = false;
  activeMenu: string;

  constructor(
    private pagesService: PagesService,
    private seo: SeoService,
    private spinner: NgxSpinnerService,
    private deviceService: DeviceDetectorService,
    private location: Location,
    private router: Router
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.session = new LoginChecker();

    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
  }

  menu() {
    this.MenuActive = (this.MenuActive==false) ? true : false;
    this.activeMenu='';   
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    const data = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
      page_url: 'privacy-policy',
    };
    this.pagesService.PageContent(data).subscribe((res) => {
      if (res.data.length > 0) {
        this.pageTitle = res.data[0].page_name;
        this.pageContent = res.data[0].page_description;
      }
    });
  }
}
