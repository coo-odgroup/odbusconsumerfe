import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginChecker } from '../helpers/loginChecker';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../services/seo.service';
import { CommonService } from '../services/common.service';
import{ GlobalConstants } from '../constants/global-constants';
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  //templateUrl:GlobalConstants.ismobile? './header.component.mobile.html':'./header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() masterSettingRecord;
   @Input() session: LoginChecker; 

    collapsed = true;    
    user:any={};
    url_path = '';
    logo_image='';

    meta_title = '';
    meta_keyword = '';
    meta_description = '';

    seolist:any;
    currentUrl:any;
    logo:any='';
    isMobile:boolean;

    constructor( private router: Router,private titleService: Title, 
    private commonService: CommonService,
    private metaService: Meta,
      private seo:SeoService,location: Location,
      private deviceService: DeviceDetectorService) { 
      this.isMobile = this.deviceService.isMobile();
        
      
      this.session = new LoginChecker();  
      this.currentUrl = location.path().replace('/','');
      
    }

    ngAfterContentChecked(){
      this.masterSettingRecord = this.commonService.commonData;
      this.logo=this.masterSettingRecord.common.logo_image;
    }

    

    ngOnInit(): void {
       
        this.user = this.session.getUser();
    }

    signOut(){
       if(this.session.isLoggedIn()){
        this.session.logout();
        this.router.navigate(['login']);  
      }
       
    }



}
