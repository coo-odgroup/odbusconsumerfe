import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { PagesService } from '../services/pages.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { LoginChecker } from '../helpers/loginChecker';
import { GlobalConstants } from '../constants/global-constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {
  currentUrl: any;
  pageTitle: any;
  pageContent: any;

  isMobile: boolean;
  session: LoginChecker;
  MenuActive: boolean = false;
  activeMenu: string = '';

  // Jagan
  private apiurl = GlobalConstants.BASE_URL;
  faqs: any[] = [];
  activeTab: number = 0;
  openIndex: number[] = [];
  // Jagan

  constructor(
    private seo: SeoService,
    private location: Location,
    private pageService: PagesService,
    private spinner: NgxSpinnerService,
    private detectService: DeviceDetectorService,
    private router: Router,
    private http: HttpClient
  ) {
    this.isMobile = this.detectService.isMobile();
    this.session = new LoginChecker();

    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
  }

  menu() {
    this.MenuActive = (this.MenuActive == false) ? true : false;
    this.activeMenu = '';
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  // Jagan
  ngOnInit(): void {
    this.fetchFaqs();
  }

  // private fetchFaqs(): void {
  //   this.spinner.show();
  //   const payload = {};

  //   this.http.post(this.apiurl + '/getfaqs', payload).subscribe((res: any) => {
  //     this.faqs = res.data;
  //     this.openIndex = this.faqs.map(() => 0);
  //     this.spinner.hide();
  //   });
  // }
  // Jagan

  private fetchFaqs(): void {
    this.spinner.show();
    const storageKey = 'faqs_data';

    const cachedFaqs = localStorage.getItem(storageKey);

    if (cachedFaqs) {
      this.faqs = JSON.parse(cachedFaqs);
      this.openIndex = this.faqs.map(() => 0);
      this.spinner.hide();
      return;
    }
    const payload = {};

    this.http.post(this.apiurl + '/getfaqs', payload).subscribe((res: any) => {
      this.faqs = res.data;
      // Save for future use
      localStorage.setItem(storageKey, JSON.stringify(this.faqs));
      this.openIndex = this.faqs.map(() => 0);
      this.spinner.hide();
    });
  }
}