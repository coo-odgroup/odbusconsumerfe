import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-route-links',
  templateUrl: './route-links.component.html',
  styleUrls: ['./route-links.component.css', '../home.component.css'],
})
export class RouteLinksComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  activeTab = 1;

  topOperatorRes: any[] = [];
  topOperatorLinks: any[] = [];

  popularRoutesRes: any[] = [];
  popularRoutesLinks: any[] = [];

  constructor(private router: Router) {}

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
        this.popularRoutesRes = parsedData.popularRoutes;
        this.popularRoutesLinks = this.chunkArray(
          this.popularRoutesRes,
          7
        );
      }
    }
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
}