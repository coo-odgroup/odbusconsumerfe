import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-routes',
  templateUrl: './top-routes.component.html',
  styleUrls: ['./top-routes.component.css', '../home.component.css'],
})
export class TopRoutesComponent implements OnChanges {
  constructor(private router: Router) {}

  @Input() popularRoutes: any[] = [];

  displayedRoutes: any = [];
  showAllRoutes = false;
  isMobile = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.isMobile = window.innerWidth <= 768;
    if (changes['popularRoutes'] && this.popularRoutes?.length) {
      this.displayedRoutes = this.isMobile
        ? this.popularRoutes.slice(0, 5)
        : this.popularRoutes;
    }
  }

  viewAllRoutes() {
    this.showAllRoutes = true;
    this.displayedRoutes = this.popularRoutes;
  }

  popularSearch(sr: any, ds: any) {
    this.router.navigate(['routes/' + sr + '-' + ds + '-bus-services']);
  }
}
