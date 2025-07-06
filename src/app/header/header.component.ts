import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginChecker } from '../helpers/loginChecker';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../services/seo.service';
import { CommonService } from '../services/common.service';
import{ GlobalConstants } from '../constants/global-constants';
import { Location } from '@angular/common';


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

    constructor( private router: Router,private titleService: Title, 
    private commonService: CommonService,
    private metaService: Meta,
      private seo:SeoService,location: Location) { 
          
        const data={
          user_id:GlobalConstants.MASTER_SETTING_USER_ID
        };
    
        this.commonService.getCommonData(data).subscribe(
          resp => {
            this.masterSettingRecord=resp.data; 
            this.logo=this.masterSettingRecord.common.logo_image;
          });

      
      this.session = new LoginChecker();  
      this.currentUrl = location.path().replace('/','');
      
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
