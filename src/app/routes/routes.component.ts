import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationdataService } from '../services/locationdata.service';
import { PopularRoutesService } from '../services/popular-routes.service';
import { Router } from '@angular/router';
import { NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  all_routes:any=[];
  
  source_id: any;
  destination_id: any;
  currentUrl: any;
  searchText: string;


  constructor(private router: Router,private _fb: FormBuilder,
    private locationService: LocationdataService,
    public dtconfig: NgbDatepickerConfig,
    private spinner: NgxSpinnerService,
      private seo:SeoService,
      private location: Location,
      private popularRoutesService:PopularRoutesService) { 


      this.currentUrl = location.path().replace('/','');
      this.seo.seolist(this.currentUrl);

      this.spinner.show();

      this.popularRoutesService.allroutes().subscribe(
        res=>{
          if(res.status==1)
          { 
            this.all_routes =res.data;
          } 
          this.spinner.hide();
        });

        const current = new Date();
        this.dtconfig.minDate = { year: current.getFullYear(), month: 
         current.getMonth() + 1, day: current.getDate() };


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
              if(sr===itm.url){
               this.sourceData=itm;
              }
  
              if(ds===itm.url){
                this.destinationData=itm;
              }  
            });
  
            let dt=(<HTMLInputElement>document.getElementById("todayDate")).value;
            //this.listing(this.sourceData,this.destinationData,dt);
            this.router.navigate([sr+'-'+ds+'-bus-services']);
  
          }
        }); 

        this.spinner.hide();
    }

    listing(s:any,d:any,dt: any){
  
      this.locationService.setSource(s);
      this.locationService.setDestination(d);
      this.locationService.setDate(dt);    
      this.router.navigate(['/listing']);
    }

  ngOnInit(): void {
  }

}
