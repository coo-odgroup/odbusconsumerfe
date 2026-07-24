import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/constants/global-constants';
import { PopularRoutesService } from 'src/app/services/popular-routes.service';

@Component({
  selector: 'app-route-links',
  templateUrl: './route-links.component.html',
  styleUrls: ['./route-links.component.css', '../home.component.css'],
})
export class RouteLinksComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  activeTab = 1;

  topOperatorRes: any[] = [];
  // topOperatorLinks: any[] = [];

  popularRoutesRes: any[] = [];
  // popularRoutesLinks: any[] = [];

  @Input() topOperatorLinks: any[] = [];
  @Input() popularRoutesLinks: any[] = [];

  constructor(private router: Router, private homeService: PopularRoutesService) { }

  ngOnInit(): void {
    this.loadRouteLinks();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadRouteLinks();
      });

  }

  loadRouteLinks(): void {
    // Reset tab on route change
    this.activeTab = 1;

    const params = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
      is_popular_routes: 1,
      is_top_routes: 1
    };

    this.homeService.getHomeData(params).subscribe((res: any) => {

      if (res.status == 1) {
        const topRoutes = res.data.top_routes;
        const popularInfo = localStorage.getItem('PopularInfo');

        if (popularInfo) {
          const parsedData = JSON.parse(popularInfo);

          // Top Operators
          if (
            parsedData?.topOperators &&
            Array.isArray(parsedData.topOperators)
          ) {
            this.topOperatorRes = parsedData.topOperators;
            this.topOperatorLinks = this.chunkArray(
              this.topOperatorRes,
              5
            );
          }

          // Popular Routes
          if (
            parsedData?.popularRoutes &&
            Array.isArray(parsedData.popularRoutes)
          ) {
            this.popularRoutesRes = topRoutes;
            this.popularRoutesLinks = this.chunkArray(
              this.popularRoutesRes,
              7
            );
          }
        }
      }
    });
  }

  chunkArray(array: any[], size: number): any[][] {
    const result: any[][] = [];

    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }

    return result;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToRoute(route: any): void {
    const url = `/routes/${route.source_url}-${route.destination_url}-bus-services`;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(url);
    });
  }
}