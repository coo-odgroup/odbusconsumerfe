import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../constants/global-constants';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginChecker } from '../helpers/loginChecker';


@Component({
  selector: 'app-page-error',
  templateUrl: './page-error.component.html',
  styleUrls: ['./page-error.component.css']
})
export class PageErrorComponent implements OnInit {

  MenuActive: boolean = false;
  isMobile: boolean;
  session: LoginChecker;
  activeMenu: string;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router

  ) { }

  
  menu() {
    this.MenuActive = (this.MenuActive==false) ? true : false;  
    this.activeMenu='';   
  }

  signOut() {
      this.session.logout();
      this.router.navigate(['login']);
  }

  ngOnInit(): void {

      this.isMobile = this.deviceService.isMobile();
      this.session = new LoginChecker();
    
  }

}
