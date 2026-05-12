import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';
import { GlobalConstants } from '../constants/global-constants';

@Injectable()
export class AppInitializerService {

  constructor(
    private auth: AuthService,
    private commonService: CommonService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Called by APP_INITIALIZER. Return a Promise that resolves when the initial auth token
  // has been acquired (or when an error occurs). This ensures other services that run
  // during app bootstrap (eg. PopularInfo/CommonService calls) have a Bearer token.
  load(): Promise<any> {
    // Step 1: Acquire auth token (required for PopularInfo API calls)
    const tokenPromise = this.getAuthToken();

    // Step 2: Once token is acquired, fetch PopularInfo
    return tokenPromise.then(() => {
      return this.fetchPopularInfo();
    }).catch((err) => {
      console.error('AppInitializer: error during initialization', err);
      // Don't fail the entire app bootstrap; continue with what we have
      return Promise.resolve(true);
    });
  }

  private getAuthToken(): Promise<any> {
    // Only attempt to use localStorage in the browser
    if (isPlatformBrowser(this.platformId)) {
      const existing = localStorage.getItem('AuthAccessToken');
      if (existing) {
        this.auth.setCurrentToken(existing);
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

  private fetchPopularInfo(): Promise<any> {
    // Check if we already have PopularInfo cached (browser only)
    if (isPlatformBrowser(this.platformId)) {
      const storedData = localStorage.getItem('PopularInfo');
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          this.commonService.setPopularInfo(data);
          // console.log('AppInitializer: Using cached PopularInfo');
          return Promise.resolve(true);
        } catch (e) {
          console.error('AppInitializer: Error parsing cached PopularInfo', e);
        }
      }
    }

    // Fetch PopularInfo from API (both SSR and browser)
    return new Promise(resolve => {
      const param = {
        user_id: GlobalConstants.MASTER_SETTING_USER_ID,
        locationName: ""
      };

      this.commonService.PopularInfo(param).subscribe(
        (resp: any) => {
          try {
            const data = resp && resp.data ? resp.data : resp;
            this.commonService.setPopularInfo(data);
            
            // Cache in localStorage for browser usage
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('PopularInfo', JSON.stringify(data));
            }
            
            resolve(true);
          } catch (e) {
            resolve(true); // Don't block app bootstrap
          }
        },
        (err) => {
          resolve(true); // Don't block app bootstrap if PopularInfo fetch fails
        }
      );
    });
  }
}