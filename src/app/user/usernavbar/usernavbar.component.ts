import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginChecker } from '../../helpers/loginChecker';
import { GlobalConstants } from 'src/app/constants/global-constants';
import { UserdataService  } from '../../services/userdata.service';
import { CommonService  } from '../../services/common.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-usernavbar',
  templateUrl: './usernavbar.component.html',
  styleUrls: ['./usernavbar.component.css']
})
export class UsernavbarComponent implements OnInit {

  url_path : any;
  @Input()
  session: LoginChecker; 
  profile:any=[];

  constructor( private userdataservice: UserdataService,private router: Router,
     private sanitizer: DomSanitizer,private Common: CommonService, private spinner: NgxSpinnerService) {   
       
      this.profileData();
      
    }

    profileData(){
    
      this.spinner.show();
      this.profile=JSON.parse(localStorage.getItem('user'));
  
      this.session = new LoginChecker();
      this.userdataservice.getProfile(this.profile.id,this.profile.token).subscribe(
        res=>{
          if(res.status==0)
          { 
            this.session.logout();
            this.router.navigate(['login']); 
          }
        }); 
  
     }
   
   getImagePath(icon :any){  
    //let objectURL = 'data:image/*;base64,'+icon  ;
   return this.sanitizer.bypassSecurityTrustResourceUrl(icon);
 }

 signOut(){
  this.session.logout();
  this.router.navigate(['login']);   
}

 ngOnInit(): void {
  this.session = new LoginChecker();
  this.profile =this.session.getUser(); 
  this.Common.getPathUrls().subscribe( res=>{          
    if(res.status==1){  
      this.url_path=res.data[0];        
    }    
  });
}



}
