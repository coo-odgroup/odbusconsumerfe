import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginChecker } from '../helpers/loginChecker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent implements OnInit {
  pageTitle: any;
  pageContent: any;
  currentUrl: any;
  isMobile: boolean;

  session: LoginChecker;

  MenuActive: boolean = false;
  activeMenu: string;

  constructor(
    private pagesService: PagesService,
    private seo: SeoService,
    private location: Location,
    private spinner: NgxSpinnerService,
    private router: Router,
    private deviceService: DeviceDetectorService
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
    this.spinner.show();

    const data = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
      page_url: 'about-us',
    };

    this.pagesService.PageContent(data).subscribe((res) => {
      // console.log(res);
      if (res.data.length > 0) {
        this.pageTitle = res.data[0].page_name;
        this.pageContent = res.data[0].page_description;
      }

      this.spinner.hide();
    });
  }
}