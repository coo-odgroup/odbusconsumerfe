import { Injectable } from '@angular/core';

@Injectable()

export class LoginChecker {
  // Check if we're in browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  isLoggedIn(): boolean{
    if (!this.isBrowser()) {
      return false;
    }
    return localStorage.getItem('user') == null ? false : true;
  }
    setLoggedInUser(user: any): void {
        if (this.isBrowser()) {
          localStorage.setItem('user', user);
        }
    }
    logout(){
        if (this.isBrowser()) {
          localStorage.removeItem('user');
        }
    }
    getUser(){
        if (!this.isBrowser()) {
          return null;
        }
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          return null;
        }
        try {
          const userdata = JSON.parse(userStr);
          return userdata;
        } catch (e) {
          return null;
        }
    }

}