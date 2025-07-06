import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { PagesService } from '../services/pages.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { LoginChecker } from '../helpers/loginChecker';

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
  activeMenu: string;

  constructor(
    private seo: SeoService,
    private location: Location,
    private pageService: PagesService,
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
    this.MenuActive = (this.MenuActive==false) ? true : false;
    this.activeMenu='';   
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  ngOnInit(): void {}
}