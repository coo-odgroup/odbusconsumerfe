import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { TopOperatorsService } from '../services/top-operators.service';
import { LocationdataService } from '../services/locationdata.service';
import { NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from '../services/notification.service';
import { CommonService  } from '../services/common.service';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';




@Component({
  selector: 'app-operator-detail',
  templateUrl: './operator-detail.component.html',
  styleUrls: ['./operator-detail.component.css']
})
export class OperatorDetailComponent implements OnInit {

  OperatorData:any=[];
  routes:any=0;
  buses:any=0;
  popular_routes:any=[];
  total_rating:number;
  operator_url:any='';
  url_path : any;
  currentUrl: any;

  
  constructor(private spinner: NgxSpinnerService,
    private topOperatorsService: TopOperatorsService,
    private router: Router,
    private locationService: LocationdataService,    
    private dtconfig: NgbDatepickerConfig,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private notify: NotificationService,
    private Common: CommonService,
      private location: Location,
      private seo:SeoService

    ) { 

      this.currentUrl = location.path().replace('/','');
      this.seo.seolist(this.currentUrl);

      const current = new Date();
        this.dtconfig.minDate = { year: current.getFullYear(), month: 
         current.getMonth() + 1, day: current.getDate() };

      this.spinner.show();

      this.route.params.subscribe(params => {
        this.operator_url = params['url'];
        this.getdetail();
      });

      if(this.operator_url==''){
        this.router.navigate(['operators']);     
      }

     

    }

    getProfileImagePath(icon :any){  
      
      return this.sanitizer.bypassSecurityTrustResourceUrl(icon);
   }


    getImagePath(icon :any){  
      let objectURL = 'data:image/*;base64,'+icon  ;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   }


  getStars(rating:any){
    let val = parseFloat(rating);
    let size = val/5*100;
    return size + '%';
    
  }
    getdetail(){
    
      this.topOperatorsService.OperatorDetail(this.operator_url).subscribe(
        res=>{
          if(res.status==1)
          { 
            this.OperatorData =res.data;
            this.routes=this.OperatorData.routes;
            this.buses=this.OperatorData.buses;
            this.popular_routes=this.OperatorData.popularRoutes;
            this.total_rating=this.OperatorData.total_rating;
          }else{
            this.notify.notify(res.message,"Error");
            this.router.navigate(['operators']);     

          }

          this.spinner.hide();
            
        });
    }

    sourceData:any;
    destinationData:any;

    popularSearch(sr:any,ds:any){

      this.spinner.show();
  
      this.locationService.all().subscribe(
        res=>{
          if(res.status==1)
          { 
            res.data.filter((itm) =>{
              if(sr===itm.name){
               this.sourceData=itm;
              }
  
              if(ds===itm.name){
                this.destinationData=itm;
              }
  
            });
  
            this.spinner.hide();
  
            let dt=(<HTMLInputElement>document.getElementById("todayDate")).value;

            this.listing(this.sourceData,this.destinationData,dt);
  
          }
        });  
    }

    listing(s:any,d:any,dt: any){
  
      this.locationService.setSource(s);
      this.locationService.setDestination(d);
      this.locationService.setDate(dt);    
      this.router.navigate(['/listing']);
    }

  ngOnInit(): void {

    this.Common.getPathUrls().subscribe( res=>{          
      if(res.status==1){  
        this.url_path=res.data[0];        
      }    
    });
   
  }

}
