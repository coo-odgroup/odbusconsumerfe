import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { LoginChecker } from '../helpers/loginChecker';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css']
})
export class CareersComponent implements OnInit {

  currentUrl: any;
  isMobile: boolean;
  MenuActive: boolean = false;
  session: LoginChecker;


  constructor(
    private seo:SeoService,
    private location: Location,
    private deviceService : DeviceDetectorService,
    private router: Router,
    private spinner: NgxSpinnerService,
    ) { 
      
      this.isMobile = this.deviceService.isMobile();
      this.session = new LoginChecker();
      this.currentUrl = location.path().replace('/','');
      this.seo.seolist(this.currentUrl);
      
    }

  ngOnInit(): void {
  }

}
