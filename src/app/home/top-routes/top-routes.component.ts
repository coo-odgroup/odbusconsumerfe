import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-routes',
  templateUrl: './top-routes.component.html',
  styleUrls: ['./top-routes.component.css', '../home.component.css'],
})
export class TopRoutesComponent implements OnInit {
  constructor(private router: Router) {}

  popular_routes: any = [];

  ngOnInit(): void {
    try {
      const data = localStorage.getItem('PopularInfo');

      if (data) {
        const parsedData = JSON.parse(data);

        if (parsedData && parsedData.popularRoutes) {
          this.popular_routes = parsedData.popularRoutes;
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage data', error);
    }
  }

  popularSearch(sr: any, ds: any) {
    this.router.navigate(['routes/' + sr + '-' + ds + '-bus-services']);
  }
}
