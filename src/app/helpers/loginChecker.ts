import { Injectable } from '@angular/core';
@Injectable()

export class LoginChecker {
  isLoggedIn(): boolean{
    return localStorage.getItem('user') == null ? false : true;
  }
    setLoggedInUser(user: any): void {
        localStorage.setItem('user', user);
    }
    logout(){
        localStorage.removeItem('user');
    }
    getUser(){
        const userdata= JSON.parse(localStorage.getItem('user'));
        return userdata;
    }

}