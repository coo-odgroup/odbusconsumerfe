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
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.css'],
})
export class TncComponent implements OnInit {
  pageTitle: any;
  pageContent: any;
  currentUrl: any;

  isMobile: boolean;
  session: LoginChecker;
  MenuActive: boolean = false;

  constructor(
    private pagesService: PagesService,
    private seo: SeoService,
    private location: Location,
    private spinner: NgxSpinnerService,
    private detectService: DeviceDetectorService,
    private router: Router
  ) {
    this.isMobile = this.detectService.isMobile();
    this.session = new LoginChecker();

    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
  }

  menu() {
     this.MenuActive = true;    
  }

  signOut() {
      this.session.logout();
      this.router.navigate(['login']);
  }

  ngOnInit(): void {
    const data = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
      page_url: 'terms-conditions',
    };
    this.pagesService.PageContent(data).subscribe((res) => {
      if (res.data.length > 0) {
        this.pageTitle = res.data[0].page_name;
        this.pageContent = res.data[0].page_description;
      }
    });
  }
}