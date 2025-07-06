import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { TopOperatorsService } from '../services/top-operators.service';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginChecker } from '../helpers/loginChecker';


@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  allOperators:any;
  currentUrl: any;
  isMobile: boolean;
  session: LoginChecker;
  MenuActive: boolean = false;


  per_page=400;

  searchText: string;
  alphabets:any = [];
  activeMenu: string;

  constructor(
    private spinner: NgxSpinnerService,
    private topOperatorsService: TopOperatorsService,
    private router: Router,
    private seo:SeoService,
    private location: Location,
    private detectService: DeviceDetectorService

    ) {

      this.getList();

     
      for (let i = 65; i <= 90;i++) {
          this.alphabets.push(String.fromCharCode(i));
      }

      this.isMobile = this.detectService.isMobile();
      this.session = new LoginChecker();
      this.currentUrl = location.path().replace('/','');
      this.seo.seolist(this.currentUrl); 

    }

    menu(){
      this.MenuActive = (this.MenuActive==false) ? true : false;
      this.activeMenu='';   
    }

    signOut(){
      this.session.logout();
      this.router.navigate(['login']);   
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
            //console.log(this.allOperators); 

           let arr=[];
            
            this.allOperators.data.forEach(e => {

              arr.push(e.operator_url)
              
            });

           // console.log(arr);


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
