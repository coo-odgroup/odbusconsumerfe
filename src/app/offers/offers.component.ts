import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { OfferService } from '../services/offer.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { LoginChecker } from '../helpers/loginChecker';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  allOffers: any[] = [];
  url_path = '';
  currentUrl: any;

  isMobile: boolean;
  session: LoginChecker;
  MenuActive: boolean = false;
  OfferData: any = null;
  activeMenu: string = '';

  //  CUSTOM MODAL STATE
  showOfferModal: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private offerService: OfferService,
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

    this.loadOffers();
  }

  ngOnInit(): void { }

  loadOffers() {
    this.spinner.show();

    const offerData = localStorage.getItem('offerData');

    if (offerData) {
      try {
        this.allOffers = JSON.parse(offerData) || [];
      } catch (e) {
        this.allOffers = [];
      }
      this.spinner.hide();
    } else {
      const param = {
        user_id: GlobalConstants.MASTER_SETTING_USER_ID
      };

      this.offerService.Offers(param).subscribe(
        res => {
          if (res.status == 1 && res.data) {
            this.allOffers = res.data;
            localStorage.setItem('offerData', JSON.stringify(res.data));
          }
          this.spinner.hide();
        },
        err => {
          console.error("Offer API error:", err);
          this.spinner.hide();
        }
      );
    }
  }

  // 🔥 MENU
  menu() {
    this.MenuActive = true;
    this.activeMenu = 'active';
  }

  // 🔥 LOGOUT
  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  openOffer(i: number) {
    if (!this.allOffers || !this.allOffers[i]) return;

    this.OfferData = this.allOffers[i];
    this.showOfferModal = true;
  }

  closeOfferModal() {
    this.showOfferModal = false;
    this.OfferData = null;
  }

  getImagePath(slider_img: any) {
    if (!slider_img) return '';
    let objectURL = 'data:image/*;base64,' + slider_img;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
  }

  copyCoupon(code: string) {
    if (!code) return;

    navigator.clipboard.writeText(code).then(() => {
      console.log('Coupon copied:', code);
      alert('Coupon copied!');
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  }

}