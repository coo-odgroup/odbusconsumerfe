import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoginChecker } from '../helpers/loginChecker';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  meta_title = '';
  meta_keyword = '';
  meta_description = '';

  seolist:any;
  currentUrl:any;
  session: LoginChecker;

  isMobile: boolean;
  MenuActive: boolean = false;
 
  constructor(
      private router:Router,
      private seo:SeoService,
      private location: Location,
      private deviceService: DeviceDetectorService
    
      ) { 
  
      this.session = new LoginChecker();
      this.isMobile = this.deviceService.isMobile();  
      this.currentUrl = location.path().replace('/','');
      this.seo.seolist(this.currentUrl);  
  }
  

  ngOnInit(): void {
    
  }

}
