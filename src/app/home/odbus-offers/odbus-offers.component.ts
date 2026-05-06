import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../constants/global-constants';

@Component({
  selector: 'app-odbus-offers',
  templateUrl: './odbus-offers.component.html',
  styleUrls: ['./odbus-offers.component.css', '../home.component.css'],
})
export class OdbusOffersComponent implements OnInit {
  private apiURL = GlobalConstants.BASE_URL;

  isMobile: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkScreen();
    this.getOffers();
  }

  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }

  Offers: any[] = [];
  offerList: any[] = [];

  getOffers() {
    const postData = {
      user_id: 1,
    };

    this.http.post<any>(this.apiURL + '/Offers', postData).subscribe(
      (res: any) => {
        // console.log('API Response:', res);

        // If API directly returns array
        if (Array.isArray(res)) {
          this.Offers = res;
        }

        // If API returns {data: []}
        else if (Array.isArray(res.data)) {
          this.Offers = res.data;
        } else {
          this.Offers = [];
        }

        this.offerList = this.Offers.map((item) => ({
          path: item.slider_photo,
        }));

        // console.log('Carousel:', this.offerList);
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
