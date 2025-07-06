import { Component, OnInit,Input } from '@angular/core';
import{ GlobalConstants } from '../constants/global-constants';
import { LoginChecker } from '../helpers/loginChecker';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
//  templateUrl:GlobalConstants.ismobile? './footer.component.mobile.html':'./footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  url_path = '';
  @Input() session: LoginChecker; 

  masterSettingRecord:any=[];
  master_info:any=[];
    mastersocial_info:any=[];
  
  constructor(private sanitizer: DomSanitizer,
    private commonService: CommonService

    ) { 
    this.session = new LoginChecker();  

    const data={
      user_id:GlobalConstants.MASTER_SETTING_USER_ID
    };

    this.commonService.getCommonData(data).subscribe(
      resp => {
        this.masterSettingRecord=resp.data; 
        
            this.master_info=this.masterSettingRecord.common;
            this.mastersocial_info=this.masterSettingRecord.socialMedia;
      });


  }
  getImagePath(image :any){
    let objectURL = 'data:image/*;base64,'+image;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   }
  ngOnInit(): void {
   
  }

}
