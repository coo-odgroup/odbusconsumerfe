import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationdataService } from '../services/locationdata.service';
import { NotificationService } from '../services/notification.service';
import { PopularRoutesService } from '../services/popular-routes.service';
import { TopOperatorsService } from '../services/top-operators.service';
import { OfferService } from '../services/offer.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalConstants } from '../constants/global-constants';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import {NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-home',
 // templateUrl:GlobalConstants.ismobile? './home.component.mobile.html':'./home.component.html',
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbAlertConfig]
})
export class HomeComponent implements OnInit {
  
  public searchForm: FormGroup;
  public appForm: FormGroup;
  
  submitted = false;
  appsubmitted = false;

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

  masterSettingRecord:any=[];
  master_info:any=[];
  
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
      private Common: CommonService,
      private location: Location,
      private alertConfig: NgbAlertConfig
      
      ) {

        alertConfig.type = 'success';
        alertConfig.dismissible = false;

        this.currentUrl = location.path().replace('/','');
        this.seo.seolist(this.currentUrl);

        const data={
          user_id:GlobalConstants.MASTER_SETTING_USER_ID
        };
    
        this.commonService.getCommonData(data).subscribe(
          resp => {
            this.masterSettingRecord=resp.data;  
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

          });


          this.appForm = this._fb.group({
            phone: ['', [Validators.required,Validators.pattern("^[0-9]{10}$")]]
          })

       
        localStorage.removeItem('bookingdata');
        localStorage.removeItem('busRecord');
        localStorage.removeItem('genderRestrictSeats');
        localStorage.removeItem('source');
        localStorage.removeItem('source_id');
        localStorage.removeItem('destination');
        localStorage.removeItem('destination_id');
        localStorage.removeItem('entdate');

        this.popularRoutesService.all().subscribe(
          res=>{
            if(res.status==1)
            { 
              this.popular_routes =res.data;
            }              
          });


          this.topOperatorsService.all().subscribe(
            res=>{
              if(res.status==1)
              { 
                let topOperators =res.data;
                const mapped = Object.keys(topOperators).map(key => topOperators[key]);
                 this.topOperators = mapped;                
              }
                
            });

            this.locationService.all().subscribe(
              res=>{
    
                if(res.status==1)
                { 
                  this.location_list =res.data;
               }
                else{ 
                  this.notify.notify(res.message,"Error");
                }
                  
              });

                

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

        

        

      
      this.searchForm = _fb.group({
        source: ['', Validators.required],
        destination: ['', Validators.required],
        entry_date: ['', Validators.required],
      });
  
    }


    operator_detail(url:any){
      if(url!=''){
        this.router.navigate(['operator/'+url]);  
      }
         
    }

  swap(){

    if(this.searchForm.value.source){
      this.swapdestination=  this.searchForm.value.source
    }

    if(this.searchForm.value.destination){
      this.swapsource= this.searchForm.value.destination; 
    }
    
  }

  sourceData:any;
  destinationData:any;

  popularSearch(sr:any,ds:any){
    this.spinner.show();

      this.location_list.filter((itm) =>{
        if(sr===itm.url){
          this.sourceData=itm;
        }

        if(ds===itm.url){
          this.destinationData=itm;
        }

      });

      this.spinner.hide();

      let dt=(<HTMLInputElement>document.getElementById("todayDate")).value;
      this.router.navigate([sr+'-'+ds+'-bus-services']);
     // this.listing(this.sourceData,this.destinationData,dt);

  }

  tabChange(val){
    document.getElementById(val).focus();
    document.getElementById(val).click();
  }

 

  listing(s:any,d:any,dt: any){
   
    this.locationService.setSource(s);
    this.locationService.setDestination(d);
    this.locationService.setDate(dt); 
    this.router.navigate(['/listing']);
  }


  getImagePath(slider_img :any){
    let objectURL = 'data:image/*;base64,'+slider_img;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
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

   get f() { return this.appForm.controls; }

  
   onlyNumbers(event:any) {
     var e = event ;
     var charCode = e.which || e.keyCode;
    
       if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode ==8 || charCode==9)
         return true;
         return false;        
 }
  
  submitForm() {  

       
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
      
      if(!this.searchForm.value.source.name){
        this.notify.notify("Select Valid Source !","Error");  
        
        return false;
      }

      if(!this.searchForm.value.destination.name){
        this.notify.notify("Select Valid Destination !","Error"); 
        
        return false;
      }

     let dat = this.searchForm.value.entry_date;
     this.listing(this.searchForm.value.source,this.searchForm.value.destination,dat);

    
    }
  }

  getOffer(typ:any){

    this.activeTab=typ;
    this.offerList = this.Offers.filter(data => data.occassion == typ);
  }

  ngOnInit() {
    this.spinner.show();

    this.seo.deafultmeta_description.subscribe((s:any) => { this.meta_description = s});
    this.seo.deafultmeta_title.subscribe((s:any) => { this.meta_title = s});
    this.seo.deafultmeta_keyword.subscribe((s:any) => { this.meta_keyword = s});

    this.searchForm = this._fb.group({
      source: [null],
      destination: [null],
      entry_date: [null]
    });

    const data={
      user_id:GlobalConstants.MASTER_SETTING_USER_ID
    };  

    this.offerService.Offers(data).subscribe(
      res=>{
        if(res.status==1)
        { 
          this.Offers =res.data;
          this.getOffer(this.activeTab);
        }   
        this.spinner.hide();           
      }); 
  }

}



