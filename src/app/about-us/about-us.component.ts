import { Component, OnInit } from '@angular/core';
import {PagesService} from '../services/pages.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  pageTitle:any;
  pageContent:any;
  currentUrl: any;

  
  constructor( private pagesService: PagesService,
    private seo:SeoService,
      private location: Location, private spinner: NgxSpinnerService) {

        this.currentUrl = location.path().replace('/','');
        this.seo.seolist(this.currentUrl);

       }

  ngOnInit(): void {

    this.spinner.show();

    const data={
      user_id:GlobalConstants.MASTER_SETTING_USER_ID,
      page_url:'about-us'
    };

    this.pagesService.PageContent(data).subscribe(
      res=>{
       // console.log(res);
        if(res.data.length>0){
          this.pageTitle=res.data[0].page_name;
          this.pageContent=res.data[0].page_description;
        }

       this.spinner.hide();

       
      }
    );
  }

}
