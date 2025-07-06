import { Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationdataService } from '../services/locationdata.service';
import { NotificationService } from '../services/notification.service';
import { PopularRoutesService } from '../services/popular-routes.service';
import { TopOperatorsService } from '../services/top-operators.service';
import { OfferService } from '../services/offer.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalConstants } from '../constants/global-constants';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../services/seo.service';
import { DatePipe, formatDate, Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import {NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig,NgbModal,NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { LoginChecker } from '../helpers/loginChecker';




@Component({
  selector: 'app-home',
 // templateUrl:GlobalConstants.ismobile? './home.component.mobile.html':'./home.component.html',
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe,NgbActiveModal,NgbAlertConfig]
})
export class HomeComponent implements OnInit {
  
  public searchForm: FormGroup;
  public appForm: FormGroup;

  @ViewChild('popup') popup: TemplateRef<any>;

  

  submitted = false;
  appsubmitted = false;
  @Input()
  session: LoginChecker; 

  public keyword = 'name';
  url_path :any=[];
  position = 'bottom-right';
  swapdestination:any;
  swapsource:any;
  bannerImage = '';
  source: any;
  source_id: any;
  destination: any;
  destination_id: any;
  entdate: any;

  popular_routes: any=[];
  topOperators:any;

  setAlert:any='';

  recentSearchFrom:any;
  recentSearchTo:any;
  recentSearchDt:any;

  active = 1;

  search:any;
  location_list:any;
  formatter:any;

  //Bus_Offers:any=[];
  //Festive_Offers:any=[];
  activeTab:any='Bus Offers';
  offerList: any = [];
  Offers: any = [];

  meta_title = '';
  meta_keyword = '';
  meta_description = '';

  seolist:any;
  currentUrl: any;
  selectedDate:any;

  masterSettingRecord:any=[];
  master_info:any=[];
  isMobile:boolean;

  MenuActive:boolean=false;

  model: NgbDateStruct;
  activeMenu: string;

  CurrentDate:any = new Date();
  
 
    constructor(private router: Router,private _fb: FormBuilder,
      private locationService: LocationdataService,
      private dtconfig: NgbDatepickerConfig,
      private notify: NotificationService,
      private spinner: NgxSpinnerService,
      private popularRoutesService:PopularRoutesService,
      private topOperatorsService: TopOperatorsService,
      private offerService:OfferService,
      private sanitizer: DomSanitizer,
      private commonService: CommonService,
      private seo:SeoService,
      private location: Location,
      private deviceService: DeviceDetectorService,
      private modalService: NgbModal,
      private alertConfig: NgbAlertConfig,
      private datePipe: DatePipe,
      
      
      ) {

        let param={
          user_id:GlobalConstants.MASTER_SETTING_USER_ID,
          locationName: ""
        };

        this.commonService.PopularInfo(param).subscribe(
          resp => {  
            //console.log(resp);
            this.masterSettingRecord=resp.data;  

            this.popular_routes =resp.data.popularRoutes;
            let topOperators =resp.data.topOperators;
            const mapped = Object.keys(topOperators).map(key => topOperators[key]);
            this.topOperators = mapped;  
            
            
            this.location_list =resp.data.locationName;
                  this.search = (text$: Observable<string>) =>
              text$.pipe(
                debounceTime(200),
                map((term) =>
                  term === ''
                    ? []
                    : this.location_list
                        .filter(
                          (v) =>
                            v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                            ( v.synonym!='' && v.synonym!=null && v.synonym.toLowerCase().indexOf(term.toLowerCase()) > -1)
                        )
                        .slice(0, 10)
                )
              );

          this.formatter = (x: { name: string }) => x.name; 


          this.Offers =resp.data.offers;
          this.getOffer();



            if(this.masterSettingRecord.banner_image!='' && this.masterSettingRecord.banner_image!=null){
              this.bannerImage=this.masterSettingRecord.banner_image;  
            }else{
              this.bannerImage='../../assets/img/bus-bg.jpg';  
            } 
                  
              this.master_info=this.masterSettingRecord.common;

              const current = new Date();
              this.dtconfig.minDate = { year: current.getFullYear(), month: 
              current.getMonth() + 1, day: current.getDate() };
  
              let maxDate = current.setDate(current.getDate() + resp.data.common.advance_days_show); 
    
              const max = new Date(maxDate);
              this.dtconfig.maxDate = { year: max.getFullYear(), month: 
                max.getMonth() + 1, day: max.getDate() };  

              this.selectedDate = formatDate(new Date(),'yyyy-MM-dd','en_US');


          });

       

     this.session = new LoginChecker();      

        
      this.recentSearchFrom=localStorage.getItem('source');
      this.recentSearchTo=localStorage.getItem('destination');   
      this.recentSearchDt = localStorage.getItem('entdate');

      this.recentSearchDt = this.showformattedDate(this.recentSearchDt);

      alertConfig.type = 'success';
      alertConfig.dismissible = false;


      this.appForm = this._fb.group({
        phone: ['', [Validators.required,Validators.pattern("^[0-9]{10}$")]]
      })
  


        this.isMobile = this.deviceService.isMobile();

        this.currentUrl = location.path().replace('/','');
        this.seo.seolist(this.currentUrl);

       
        localStorage.removeItem('bookingdata');
        localStorage.removeItem('busRecord');
        localStorage.removeItem('genderRestrictSeats');
        localStorage.removeItem('source_id');
        localStorage.removeItem('destination_id');
      
      this.searchForm = _fb.group({
        source: ['', Validators.required],
        destination: ['', Validators.required],
        entry_date: ['', Validators.required],
      });
  
    }

    menu(){

      this.MenuActive=(this.MenuActive==false) ? true:false;
      this.activeMenu='';
      this.modalService.dismissAll();


    }
    bookAgain(){

     let recentSearchDt= this.showformattedDate(localStorage.getItem('entdate'));  
     let currentDt =  formatDate(new Date(),'yyyy-MM-dd','en_US');

      if(currentDt > recentSearchDt){
        recentSearchDt = currentDt;
      }

     let recentSearchTo='';
     let recentSearchFrom='';

     this.location_list.filter((itm) =>{
      if(this.recentSearchTo === itm.name){
         recentSearchTo=itm;
      }

      if(this.recentSearchFrom === itm.name){
         recentSearchFrom =itm;
      }

    });
    
    recentSearchDt = formatDate(new Date(recentSearchDt),'dd-MM-yyyy','en_US');

    if(recentSearchFrom!='' && recentSearchTo!=''){

      this.listing(recentSearchFrom,recentSearchTo,recentSearchDt);

    }

    }

    showformattedDate(date:any){
      if(date){  
        let dt = date.split("-");
        let dd=new Date(dt[2]+'-'+dt[1]+'-'+dt[0]);
  
        return dt[2]+'-'+dt[1]+'-'+dt[0];  
  
      }
    }

    operator_detail(url:any){
      if(url!=''){
        this.router.navigate(['operator/'+url]);  
      }
         
    }

    onlyNumbers(event:any) {
      var e = event ;
      var charCode = e.which || e.keyCode;
     
        if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode ==8 || charCode==9)
          return true;
          return false;        
  }


    submitAppForm(){
      this.appsubmitted=true;
      this.setAlert='';
  
      if(this.appForm.invalid){
         return;
      }else{
  
        this.spinner.show(); 
  
       const param={
          phone:this.appForm.value.phone
        }
  
        this.popularRoutesService.downloadApp(param).subscribe(
          res=>{
            if(res.status==1)
            { 
              this.setAlert="SMS has been sent to your phone";
            } 
  
            this.appsubmitted=false;
            this.appForm.reset();
            this.spinner.hide();           
          }); 
  
  
  
      }
     }

     entry_date:any=null;
  
     get f() { return this.appForm.controls; }

    onDateSelect(event:any){

      this.entry_date= event;

     //this.searchForm.controls.entry_date.setValue(event);

      let dt = event;

     
      this.selectedDate= [dt.year,dt.month,dt.day].join("-");
      this.modalService.dismissAll();

      //console.log(this.searchForm.value.entry_date);

    }

  swap(){

    if(this.searchForm.value.source){
      this.swapdestination=  this.searchForm.value.source
    }

    if(this.searchForm.value.destination){
      this.swapsource= this.searchForm.value.destination; 
    }
    
  }


  tabChange(val){
    document.getElementById(val).focus();
    document.getElementById(val).click();
  }

 

  listing(s:any,d:any,dt: any){

    // console.log(s);
    // console.log(d);
    // console.log(dt);
   
    this.locationService.setSource(s);
    this.locationService.setDestination(d);
    this.locationService.setDate(dt); 
    this.router.navigate(['/listing']);
  }

  OpenCalendar(calendar){

    this.modalService.open(calendar, { centered: true });

  }

 // bannerpopup:any="../../assets/img/starpower_discount.jpg";
  popupData:any=[];

   ngAfterViewInit(): void {
    
    this.CurrentDate = this.datePipe.transform(this.CurrentDate, 'yyyy-MM-dd');

    const current = new Date();
    const timestamp = current.getTime();

    this.popupData =this.commonService.commonData;

    if(this.popupData.common.popup_status==1){

      const popup_s_datetime = new Date(this.popupData.common.popup_start_date+" "+this.popupData.common.popup_start_time);
      const popup_st_datetime = popup_s_datetime.getTime();

      const popup_e_datetime = new Date(this.popupData.common.popup_end_date+" "+this.popupData.common.popup_end_time);

      const popup_end_datetime = popup_e_datetime.getTime();


      if ( popup_st_datetime <= timestamp  && timestamp <= popup_end_datetime){
        this.modalService.open(this.popup);       
      }
     
    }
  
    
  }

  getImagePath(slider_img :any){
    let objectURL = 'data:image/*;base64,'+slider_img;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   }
  
  submitForm() {
    
   
    
    if(this.isMobile==true && this.entry_date != null){
      //console.log(this.searchForm.value.entry_date);
      this.searchForm.value.entry_date = this.entry_date;
    }

       
    if(this.searchForm.value.source==null || this.searchForm.value.source==''){

      this.notify.notify("Enter Source !","Error");

    }

    else if(this.searchForm.value.destination==null || this.searchForm.value.destination==""){

      this.notify.notify("Enter Destination !","Error");
    }

    else if(this.searchForm.value.entry_date==null || this.searchForm.value.entry_date==""){

      this.notify.notify("Enter Journey Date !","Error");

    }

    else{     

      let dt = this.searchForm.value.entry_date;

      if(dt.month < 10){
        dt.month = "0"+dt.month;
      }
      if(dt.day < 10){
        dt.day = "0"+dt.day;
      }

      this.searchForm.value.entry_date= [dt.day,dt.month,dt.year].join("-");

      let sr=this.searchForm.value.source.url;
      let ds=this.searchForm.value.destination.url;
     let date=this.searchForm.value.entry_date;
      
      if(!this.searchForm.value.source.name){
        this.notify.notify("Select Valid Source !","Error");  
        
        return false;
      }

      if(!this.searchForm.value.destination.name){
        this.notify.notify("Select Valid Destination !","Error"); 
        
        return false;
      }

    // let dat = this.searchForm.value.entry_date;

     window.location.href = GlobalConstants.URL+sr+'-'+ds+'-bus-services?date='+date;

    // this.listing(this.searchForm.value.source,this.searchForm.value.destination,dat);

    
    }
  }

  getOffer(){

    //this.activeTab=typ;
    this.offerList =[]; //this.Offers.filter(data => data.occassion == typ);

    this.Offers.forEach(element => {
      this.offerList.push({path: element.slider_photo, width: 0, height: 0} );
      
    });

    //console.log(this.offerList);
  }

  ngOnInit() {
    
    this.searchForm = this._fb.group({
      source: [null],
      destination: [null],
      entry_date: [null]
    });

  }

}



