import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatePipe } from '@angular/common';
import { GlobalConstants } from '../constants/global-constants';
import { PopularRoutesService } from '../services/popular-routes.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css'],
  providers: [DatePipe],
})
export class SitemapComponent implements OnInit {
  isMobile: boolean;
  topOperators: any = [];
  popularRoutes: any = [];
  topRoutes: any = [];
  currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    private datePipe: DatePipe,
    private homeService: PopularRoutesService,
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.getSiteMapRecords();
  }

  getSiteMapRecords() {
    try {
      const data = localStorage.getItem('PopularInfo');

      const params = {
        user_id: GlobalConstants.MASTER_SETTING_USER_ID,
        is_popular_routes: 1,
        is_top_routes: 1,
      };

      this.homeService.getHomeData(params).subscribe((res: any) => {
        if (res.status == 1) {
          const topRoutes = res.data.top_routes;
          if (data) {
            const parsedData = JSON.parse(data);

            if (parsedData && parsedData.topOperators) {
              this.topOperators = parsedData.topOperators;
            }

            if (parsedData && parsedData.popularRoutes) {
              // this.popularRoutes = parsedData.popularRoutes;
              this.topRoutes = topRoutes;
            }
          } else {
            this.router.navigate(['/']);
          }
        }
      });
    } catch (error) {
      console.error('Error parsing data', error);
    }
  }
}
