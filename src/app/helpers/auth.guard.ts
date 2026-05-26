import {
  Injectable,
  Inject,
  PLATFORM_ID
} from "@angular/core";

import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";

import {
  isPlatformBrowser,
  isPlatformServer
} from "@angular/common";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    // SSR SIDE
    if (isPlatformServer(this.platformId)) {
      return true;
    }

    // BROWSER SIDE
    const user = localStorage.getItem('user');

    if (user) {
      return true;
    }

    this.router.navigate(['login']);

    return false;
  }
}