import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalConstants } from '../constants/global-constants';
import { TestimonialsService } from '../services/testimonials.service';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { LoginChecker } from '../helpers/loginChecker';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
})
export class TestimonialsComponent implements OnInit {
  allReviews: any = [];
  currentUrl: any;

  isMobile: boolean;
  session: LoginChecker;
  MenuActive: boolean = false;
  activeMenu: string;

  constructor(
    private spinner: NgxSpinnerService,
    private testimonialsService: TestimonialsService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private seo: SeoService,
    private location: Location,
    private detectService: DeviceDetectorService
  ) {
    this.isMobile = this.detectService.isMobile();
    this.session = new LoginChecker();

    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);

    this.spinner.show();
    const filterdata = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
    };
    this.testimonialsService.GetTestimonial(filterdata).subscribe((res) => {
      this.allReviews = res.data;
      this.spinner.hide();
    });
  }

  menu() {
    this.MenuActive = (this.MenuActive==false) ? true : false; 
    this.activeMenu='';   
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  getImagePath(icon: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(icon);
  }

  getStars(rating: any) {
    let val = parseFloat(rating);
    let size = (val / 5) * 100;
    return size + '%';
  }

  ngOnInit(): void {}
}
