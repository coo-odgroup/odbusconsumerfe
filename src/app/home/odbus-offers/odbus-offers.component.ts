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
    setTimeout(() => {
      this.getOffers();
    }, 1000);
    
  }

  checkScreen(): void {
    // SSR SAFE
    if (!this.isBrowser) {
      return;
    }

    this.isMobile = window.innerWidth < 768;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const cells = document.querySelectorAll('.carousel-cell');

      console.log(cells);

      cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
          // alert(this.Offers[0]?.coupon.coupon_code);
          this.goToOffers(this.Offers[index]?.coupon.coupon_code);
        });
      });
    }, 500);
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

        this.offerList = this.Offers.map((item) => ({
          path: item.slider_photo,
        }));

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
}
