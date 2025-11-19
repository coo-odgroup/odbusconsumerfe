import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import{ GlobalConstants } from '../constants/global-constants';

@Injectable()
export class AppInitializerService {

  constructor(private auth: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Called by APP_INITIALIZER. Return a Promise that resolves when the initial auth token
  // has been acquired (or when an error occurs). This ensures other services that run
  // during app bootstrap (eg. PopularInfo/CommonService calls) have a Bearer token.
  load(): Promise<any> {
    // Only attempt to use localStorage in the browser
    if (isPlatformBrowser(this.platformId)) {
      const existing = localStorage.getItem('AuthAccessToken');
      if (existing) {
        return Promise.resolve(true);
      }
    }

    return new Promise(resolve => {
      // Attempt to get token from backend. If it succeeds, store it for interceptor use.
      this.auth.getToken().subscribe(
        (res: any) => {
          try {
            const token = res && res.data ? res.data : null;
            // Store token in memory for server-side use
            this.auth.setCurrentToken(token);
            // Store in localStorage for browser usage
            if (isPlatformBrowser(this.platformId) && token) {
              localStorage.setItem('AuthAccessToken', token);
            }
          } catch (e) {
            // ignore storage errors
          }
          resolve(true);
        },
        (err) => {
          // Don't block app bootstrap if token fetch fails; log and continue.
          console.error('AppInitializer: failed to fetch auth token', err);
          resolve(true);
        }
      );
    });
  }
}