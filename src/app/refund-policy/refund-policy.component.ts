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
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.css'],
})
export class RefundPolicyComponent implements OnInit {
  pageTitle: any;
  pageContent: any;
  currentUrl: string;
  isMobile: boolean;

  session: LoginChecker;

  MenuActive: boolean = false;
  activeMenu!: string;

  constructor(
    private pagesService: PagesService,
    private seo: SeoService,
    private spinner: NgxSpinnerService,
    private deviceService: DeviceDetectorService,
    private location: Location,
    private router: Router,
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.session = new LoginChecker();

    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
  }

  menu() {
    this.MenuActive = this.MenuActive == false ? true : false;
    this.activeMenu = '';
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    const refundPolicyContent = localStorage.getItem('refundPolicyContent');

    if (refundPolicyContent) {
      const data = JSON.parse(refundPolicyContent);
      this.refundPolicyContent(data);
    } else {
      const param = {
        user_id: GlobalConstants.MASTER_SETTING_USER_ID,
        page_url: 'refund-policy',
      };

      this.pagesService.PageContent(param).subscribe((res) => {
        localStorage.setItem('refundPolicyContent', JSON.stringify(res.data));
        this.refundPolicyContent(res.data);
      });
    }
  }

  refundPolicyContent(res: any) {
    if (res.length > 0) {
      this.pageTitle = res[0].page_name;
      this.pageContent = res[0].page_description;
    }
  }
}
