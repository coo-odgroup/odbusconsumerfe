import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-route-links',
  templateUrl: './route-links.component.html',
  styleUrls: ['./route-links.component.css', '../home.component.css'],
})
export class RouteLinksComponent implements OnInit {
  constructor() {}

  topOperatorRes: any[] = [];
  topOperatorLinks: any[] = [];
  popularRoutesRes: any[] = [];
  popularRoutesLinks: any[] = [];

  ngOnInit(): void {
    const popularInfo = localStorage.getItem('PopularInfo');

    if (popularInfo) {
      const parsedData = JSON.parse(popularInfo);

      if (parsedData?.topOperators && Array.isArray(parsedData.topOperators)) {
        this.topOperatorRes = parsedData.topOperators;
        this.topOperatorLinks = this.chunkArray(this.topOperatorRes, 5);
      }

      if (
        parsedData?.popularRoutes &&
        Array.isArray(parsedData.popularRoutes)
      ) {
        this.popularRoutesRes = parsedData.popularRoutes;
        this.popularRoutesLinks = this.chunkArray(this.popularRoutesRes, 5);
      }

      // console.log('popularRoutesLinks:', this.topOperatorLinks);
    }
  }

  chunkArray(array: any[], size: number): any[][] {
    const result = [];

    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }

    return result;
  }
}
