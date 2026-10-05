import { Component, Input } from '@angular/core';

/**
 * SPEED FIX:
 * - Server and browser now render the SAME list (no window.innerWidth on the server),
 *   so the section no longer collapses from ~28 cards to 5 after the app boots (mobile CLS).
 * - "Show only 5 on mobile" is done with CSS (see top-routes.component.css), not JS.
 * - Cards are real <a href> links, so Google can crawl every route page.
 */
@Component({
  selector: 'app-top-routes',
  templateUrl: './top-routes.component.html',
  styleUrls: ['./top-routes.component.css', '../home.component.css'],
})
export class TopRoutesComponent {
  @Input() popularRoutes: any[] = [];
  showAllRoutes = false;

  routeLink(p: any): string {
    return '/routes/' + p?.source_url + '-' + p?.destination_url + '-bus-services';
  }

  viewAllRoutes(): void {
    this.showAllRoutes = true;
  }

  trackByRoute(_: number, p: any) {
    return (p?.source_url || '') + '-' + (p?.destination_url || '');
  }
}
