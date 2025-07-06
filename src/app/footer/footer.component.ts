import { Component, OnInit,Input } from '@angular/core';
import{ GlobalConstants } from '../constants/global-constants';
import { LoginChecker } from '../helpers/loginChecker';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbDatepickerConfig,NgbModal,NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { DatePipe, formatDate, Location } from '@angular/common';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
//  templateUrl:GlobalConstants.ismobile? './footer.component.mobile.html':'./footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [DatePipe,NgbActiveModal]
})
export class FooterComponent implements OnInit {
  url_path = '';
  @Input() session: LoginChecker; 
  isMobile:boolean;
  popular_routes: any=[];
  masterSettingRecord:any=[];
  master_info:any=[];
    mastersocial_info:any=[];
    location_list:any=[];
  
  constructor(private sanitizer: DomSanitizer,
    private commonService: CommonService,
    private deviceService: DeviceDetectorService,
    private dtconfig: NgbDatepickerConfig,
    private spinner: NgxSpinnerService,
     private router: Router,
     private datePipe: DatePipe
    ) { 
    this.isMobile = this.deviceService.isMobile();
    this.session = new LoginChecker();  

   

  }
  getImagePath(image :any){
    let objectURL = 'data:image/*;base64,'+image;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   }

   ngAfterContentChecked(){
    this.masterSettingRecord = this.commonService.commonData;
    this.master_info=this.masterSettingRecord.common;
    this.mastersocial_info=this.masterSettingRecord.socialMedia;
  }

  ngOnInit(): void {
     

    const current = new Date();
    this.dtconfig.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    
    let param={
      user_id:GlobalConstants.MASTER_SETTING_USER_ID,
      locationName: ""
    };

    this.commonService.PopularInfo(param).subscribe(
      resp => {  
        this.popular_routes =resp.data.popularRoutes;
           
        this.location_list =resp.data.locationName;
        let maxDate = current.setDate(current.getDate() + resp.data.common.advance_days_show); 
        const max = new Date(maxDate);
        this.dtconfig.maxDate = { year: max.getFullYear(), month:  max.getMonth() + 1, day: max.getDate() };
      });

    
   
  }

  CurrentDate:any = new Date();

  popularSearch(sr:any,ds:any){
    this.CurrentDate = this.datePipe.transform(this.CurrentDate, 'dd-MM-yyyy');

      window.location.href = GlobalConstants.URL+sr+'-'+ds+'-bus-services?date='+this.CurrentDate;
  }

}
