import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../constants/global-constants';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginChecker } from '../helpers/loginChecker';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-page-error',
  templateUrl: './page-error.component.html',
  styleUrls: ['./page-error.component.css'],
})
export class PageErrorComponent implements OnInit {
  MenuActive: boolean = false;
  isMobile: boolean;
  session: LoginChecker;
  activeMenu: string;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta
  ) {}

  menu() {
    this.MenuActive = this.MenuActive == false ? true : false;
    this.activeMenu = '';
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.spinner.show();

    this.isMobile = this.deviceService.isMobile();
    this.session = new LoginChecker();

    this.meta.addTag({
      name: 'page-status',
      content: '404'
    });

    this.title.setTitle('404 - Page Not Found');

    setTimeout(() => {
      this.spinner.hide();
    }, 500); // 0.5 seconds
  }
}
