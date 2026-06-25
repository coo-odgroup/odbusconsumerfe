import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css'],
  providers: [DatePipe]
})
export class SitemapComponent implements OnInit {
  isMobile: boolean;
  topOperators: any = [];
  popularRoutes: any = [];
  currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.getSiteMapRecords();
  }

  getSiteMapRecords() {
    try {
      const data = localStorage.getItem('PopularInfo');

      if (data) {
        const parsedData = JSON.parse(data);

        if (parsedData && parsedData.topOperators) {
          this.topOperators = parsedData.topOperators;
        }

        if (parsedData && parsedData.popularRoutes) {
          this.popularRoutes = parsedData.popularRoutes;
        }
      } else {
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Error parsing data', error);
    }
  }
}
