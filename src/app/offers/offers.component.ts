import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { OfferService } from '../services/offer.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { LoginChecker } from '../helpers/loginChecker';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbDatepickerConfig,NgbModal,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
  providers: [NgbActiveModal]
})
export class OffersComponent implements OnInit {

  allOffers:any=[];
  url_path ='';
  currentUrl: any;

  isMobile:boolean;
  session: LoginChecker;
  MenuActive:boolean = false;
  OfferData:any=[];
  activeMenu: string;

  constructor(
    private spinner: NgxSpinnerService,
    private offerService: OfferService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private seo:SeoService,
    private location: Location,
    private detectService: DeviceDetectorService,
    private modalService: NgbModal
    ) { 

      this.isMobile = this.detectService.isMobile();
      this.session = new LoginChecker();
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
          //console.log(this.allOffers);
        } 
        
        this.spinner.hide();
      });
    }

    menu(){
      this.MenuActive = true;
      this.activeMenu='active';
    }

    signOut(){
        this.session.logout();
        this.router.navigate(['login']);   
    }

    OfferModal(modal:any,i:any){
      this.spinner.show();
      this.modalService.open(modal);
      this.OfferData=this.allOffers[i];
      console.log(this.OfferData);
      this.spinner.hide();
    }

    getImagePath(slider_img :any){
      let objectURL = 'data:image/*;base64,'+slider_img;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
     }  

    ngOnInit(): void { }
}