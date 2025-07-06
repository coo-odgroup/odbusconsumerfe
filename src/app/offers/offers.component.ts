import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { OfferService } from '../services/offer.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  allOffers:any=[];
  url_path ='';
  currentUrl: any;


  constructor(private spinner: NgxSpinnerService,
    private offerService: OfferService,private router: Router,
    private sanitizer: DomSanitizer,
    private seo:SeoService,
      private location: Location,
    ) { 

      this.currentUrl = location.path().replace('/','');
      this.seo.seolist(this.currentUrl);
      
      this.spinner.show();
      const data={
        user_id:GlobalConstants.MASTER_SETTING_USER_ID
      };
    this.offerService.Offers(data).subscribe(
      res=>{
        if(res.status==1)
        { 
          this.allOffers = res.data;
        } 
        
        this.spinner.hide();
      });
    }
    getImagePath(slider_img :any){
      let objectURL = 'data:image/*;base64,'+slider_img;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
     }  

  ngOnInit(): void {

  }

}
