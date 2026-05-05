import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-route-links',
  templateUrl: './route-links.component.html',
  styleUrls: ['./route-links.component.css', '../home.component.css']
})
export class RouteLinksComponent implements OnInit {

  constructor() { }

  topOperatorLinks: any[] = [];

  ngOnInit(): void {
    const popularInfo = localStorage.getItem('PopularInfo');

    if (popularInfo) {
      const parsedData = JSON.parse(popularInfo);

      if (parsedData?.topOperators && Array.isArray(parsedData.topOperators)) {

        this.topOperatorLinks = parsedData.topOperators;

      }

      console.log('Top Operator Links:', this.topOperatorLinks);
    }
  }

}
