import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OfferService } from '../services/offer.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { LoginChecker } from '../helpers/loginChecker';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
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
  fragmentValue: string | null = null;

  constructor(
    private spinner: NgxSpinnerService,
    private offerService: OfferService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private seo: SeoService,
    private location: Location,
    private detectService: DeviceDetectorService,
    private route: ActivatedRoute,
    private notify: NotificationService,
  ) {
    this.isMobile = this.detectService.isMobile();
    this.session = new LoginChecker();
    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
  }

  ngOnInit(): void {
    // Subscribe only once
    this.route.fragment.subscribe((fragment) => {
      this.fragmentValue = fragment;
      this.checkAndOpenOffer();
    });

    // Load offers
    this.loadOffers();
  }

  checkAndOpenOffer() {
    if (!this.fragmentValue || !this.allOffers?.length) {
      return;
    }

    const index = this.allOffers.findIndex(
      (offer: any) =>
        offer.coupon?.coupon_code === this.fragmentValue ||
        offer.unique_id === this.fragmentValue
    );

    if (index !== -1) {
      this.openOffer(index);
    }
  }

  loadOffers() {
    this.spinner.show();

    const param = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
    };

    this.offerService.Offers(param).subscribe(
      (res) => {
        if (res.status == 1 && res.data) {
          this.allOffers = res.data;

          localStorage.setItem(
            'offerData',
            JSON.stringify(res.data)
          );

          // Check fragment after offers loaded
          this.checkAndOpenOffer();
        }

        this.spinner.hide();
      },
      (err) => {
        console.error('Offer API error:', err);
        this.spinner.hide();
      }
    );
  }

  menu() {
    this.MenuActive = true;
    this.activeMenu = 'active';
  }

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
    // if (!code) return;
    if (!code) {
      this.notify.notify('No coupon code available to copy.', 'Error');
      this.closeOfferModal();
      return;
    }

    navigator.clipboard
      .writeText(code)
      .then(() => {
        this.router.navigate(['offers']);
        this.notify.notify('Coupon copied!', 'Success');
        this.closeOfferModal();
      })
      .catch((err) => {
        console.error('Copy failed:', err);
        this.notify.notify('Failed to copy coupon.', 'Error');
      });
  }
}
