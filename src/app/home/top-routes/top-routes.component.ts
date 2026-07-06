import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-routes',
  templateUrl: './top-routes.component.html',
  styleUrls: ['./top-routes.component.css', '../home.component.css'],
})
export class TopRoutesComponent implements OnInit {
  constructor(private router: Router) { }

   @Input() popularRoutes: any[] = [];

  popular_routes: any = [];
  displayedRoutes: any = [];
  showAllRoutes = false;
  isMobile = false;

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;

    try {
      const data = localStorage.getItem('PopularInfo');

      if (data) {
        const parsedData = JSON.parse(data);

        if (parsedData && parsedData.popularRoutes) {
          this.popular_routes = parsedData.popularRoutes;

          this.displayedRoutes = this.isMobile
            ? this.popular_routes.slice(0, 5)
            : this.popular_routes;
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage data', error);
    }
  }

  viewAllRoutes() {
    this.showAllRoutes = true;
    this.displayedRoutes = this.popular_routes;
  }

  popularSearch(sr: any, ds: any) {
    this.router.navigate(['routes/' + sr + '-' + ds + '-bus-services']);
  }
}
