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
    const tncContent = localStorage.getItem('tncContent');

    if (tncContent) {
      const data = JSON.parse(tncContent);
      this.tncContent(data);
    } else {
      const param = {
        user_id: GlobalConstants.MASTER_SETTING_USER_ID,
        page_url: 'terms-conditions',
      };

      this.pagesService.PageContent(param).subscribe(
        res => {
          localStorage.setItem('tncContent', JSON.stringify(res.data));
          this.tncContent(res.data);
        }
      );
    }
  }

  tncContent(res: any) {
    if (res.length > 0) {
      this.pageTitle = res[0].page_name;
      this.pageContent = res[0].page_description;
    }
  }
}