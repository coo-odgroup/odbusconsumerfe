import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { TopOperatorsService } from '../services/top-operators.service';

import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  allOperators:any;
  currentUrl: any;

  per_page=52;

  searchText: string;
  alphabets:any = [];

  constructor(private spinner: NgxSpinnerService,
    private topOperatorsService: TopOperatorsService,private router: Router
    ,private seo:SeoService,
    private location: Location) {

      this.getList();

     
      for (let i = 65; i <= 90;i++) {
          this.alphabets.push(String.fromCharCode(i));
      }

      this.currentUrl = location.path().replace('/','');
        this.seo.seolist(this.currentUrl); 

    }

    operator_detail(url:any){
      if(url!=''){
        this.router.navigate(['operator/'+url]);  
      }         
    }

    getList(url:any='',filter:any=''){
      this.spinner.show();
      const param= {
        "paginate":this.per_page,
        "filter":filter,
       }; 


      this.topOperatorsService.allOperator(url,param).subscribe(
        res=>{
          if(res.status==1)
          { 
            this.allOperators =res.data.data;      
          }
         this.spinner.hide();            
        });
    }

    page(label:any){
      return label;
     }

  ngOnInit(): void {
  }

}
