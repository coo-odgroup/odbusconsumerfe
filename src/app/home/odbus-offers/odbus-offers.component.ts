import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../constants/global-constants';
import { Router } from '@angular/router';

import {
  Component,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-odbus-offers',
  templateUrl: './odbus-offers.component.html',
  styleUrls: ['./odbus-offers.component.css', '../home.component.css'],
})
export class OdbusOffersComponent implements OnInit {
  private apiURL = GlobalConstants.BASE_URL;

  isBrowser = false;

  isMobile = false;

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  Offers: any[] = [];

  offerList: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // SSR SAFE
    if (this.isBrowser) {
      this.checkScreen();
    }
    this.getOffers();
  }

  checkScreen(): void {
    // SSR SAFE
    if (!this.isBrowser) {
      return;
    }

    this.isMobile = window.innerWidth < 768;
  }

  ngAfterViewInit() {
    if (!this.isBrowser) {
      return;
    }
  }

  onOfferClick(index: number): void {
    const code =
      this.Offers[index]?.coupon_id === 0
        ? this.Offers[index]?.unique_id
        : this.Offers[index]?.coupon?.coupon_code;

    this.goToOffers(code);
  }

  getOffers(): void {
    const postData = {
      user_id: 1,
    };

    this.http.post<any>(this.apiURL + '/Offers', postData).subscribe(
      (res: any) => {
        if (Array.isArray(res)) {
          this.Offers = res;
        } else if (Array.isArray(res.data)) {
          this.Offers = res.data;
        } else {
          this.Offers = [];
        }

        // this.offerList = this.Offers.map((item) => ({
        //   path: item.slider_photo,
        //   alt: item.alt_tag
        // }));

        // console.log(this.Offers);
      },

      (error) => {
        console.log(error);
      },
    );
  }

  // goToOffers() {
  //   this.router.navigate(['/offers']);
  // }

  // goToOffers(index: number) {
  //   this.router.navigate(['/offers'], {
  //     queryParams: {
  //       offer: index,
  //     },
  //   });
  // }

  goToOffers(couponCode: string) {
    this.router.navigate(['/offers'], {
      fragment: couponCode,
    });
  }

  moveSlider1(direction: number) {
    const slider: any = document.getElementById('cardsScroll1');
    if (!slider) return;

    const scrollAmount = 420; // card move distance

    slider.scrollTo({
      left: slider.scrollLeft + direction * scrollAmount,
      behavior: 'smooth',
    });

    setTimeout(() => {
      this.updateSliderButtons();
    }, 500);
  }

  updateSliderButtons() {
    const slider: any = document.getElementById('cardsScroll1');
    const prevBtn: any = document.querySelector('.offer-prev');
    const nextBtn: any = document.querySelector('.offer-next');

    if (!slider || !prevBtn || !nextBtn) return;

    /* LEFT BUTTON */
    if (slider.scrollLeft <= 5) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'block';
    }

    /* RIGHT BUTTON */
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'block';
    }
  }
}
