import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup , Validators  } from "@angular/forms";
import { OTPService } from '../services/otp.service';
import { NotificationService } from '../services/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LoginService } from '../services/login.service';
import { SignupService } from '../services/signup.service';
import { LoginChecker } from '../helpers/loginChecker';
import {NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EncryptionService } from '../encrypt.service';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
  providers: [NgbAlertConfig]
})
export class OtpComponent implements OnInit {

  otpForm: FormGroup;
  submitted = false;
  userId: any;
  isMobile:boolean;
  MenuActive: boolean = false;

  ResendOtp :boolean=false;
  ResendTimer :boolean=true;

  Timer= 20;  
  alert:any='';

  @Input()
  session: LoginChecker; 
  currentUrl: any;
  activeMenu: string;

  constructor( 
      public router: Router,
      public fb: FormBuilder, 
      private notify: NotificationService,    
      private otpService : OTPService,
      private spinner: NgxSpinnerService,
      public loginService: LoginService,
      private signupService: SignupService,  
      private alertConfig: NgbAlertConfig ,
      private seo:SeoService,
      private deviceService: DeviceDetectorService,
      private enc:EncryptionService,
      private location: Location) { 
        
      this.isMobile = this.deviceService.isMobile();

      this.currentUrl = location.path().replace('/','');
          this.seo.seolist(this.currentUrl);

      this.session = new LoginChecker();

      alertConfig.type = 'success';
      alertConfig.dismissible = false;

    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    })

    let typ= localStorage.getItem('otp_type');


    if(typ=='login'){
      this.loginService.currentalert.subscribe((message:any) => { this.alert = message; }); 
    }

    if(typ=='signup'){
      this.signupService.currentalert.subscribe((message:any) => { this.alert = message; }); 
    }
      
  }

  menu(){
    this.MenuActive = (this.MenuActive==false) ? true : false;  
    this.activeMenu='';      
  }


  handleEvent(event:any){    
    if(event.action === 'done'){

      this.ResendOtp=true;
      this.ResendTimer=false;
      

    }
  }

  get f() { return this.otpForm.controls; }

  onSubmit() {

    this.submitted = true;

     // stop here if form is invalid
     if (this.otpForm.invalid) {
      return;
     }else{ 

      this.spinner.show();

      const param ={
        userId : this.userId,
        otp : this.otpForm.value.otp
      } ;



      this.otpService.submit_otp(param).subscribe(
        res=>{ 
         // console.log(res);
          if(res.status==1){
            let data=this.enc.decrypt(res.data);
            data = JSON.parse(data); 
            this.session.setLoggedInUser(JSON.stringify(data) );
            //localStorage.setItem('user', JSON.stringify(res.data[0]) );
            localStorage.removeItem('userId');
            localStorage.removeItem('otp_type');
            localStorage.removeItem('resendParam');
            this.notify.notify('OTP verification is successful',"Success");
            this.router.navigate(['dashboard']);
              
          }
          else{
            this.notify.notify(res.message,"Error");
          }

          this.spinner.hide();
      },
      error => {

        this.spinner.hide();
        //console.log(error.error.message);
        this.notify.notify(error.error.message,"Error");

      }
      );

     }
  }

  resend_otp(){

    this.spinner.show();

    this.ResendOtp=false;
    let typ= localStorage.getItem('otp_type');
    let via= localStorage.getItem('via');
    let param = JSON.parse(localStorage.getItem('resendParam'));

    if(typ=='login'){

      this.loginService.signin(param).subscribe(
        res => {
          if(res.status==1){ 

            if(res.message=="Not a Registered User"){

              this.notify.notify(res.message,"Error");

            }else{
              
              this.ResendTimer=true;
              this.loginService.setAlert("OTP has been sent to "+via);
             //this.notify.notify("OTP has been sent to "+via,"Success"); 
            } 
           }
           this.spinner.hide();
          
        }
      );

    }

    if(typ=='signup'){

      this.signupService.signup(param).subscribe(
        res=>{
          this.spinner.hide();         
          if(res.status==1){            
            this.ResendTimer=true;
            let data :any=this.enc.decrypt(res.data);
            data = JSON.parse(data); 
            localStorage.setItem('userId',data.id);
            this.signupService.setAlert("OTP has been sent to "+via);
            //this.notify.notify("OTP has been sent to "+via,"Success");

          }
           else if(res.status==0){
              this.notify.notify(res.message,"Error");
            }
        }
      ); 

    }


  }


  ngOnInit(): void {

    
    this.userId = localStorage.getItem('userId');
    
    console.log(this.userId);

    if(this.userId=='' || this.userId==null){
      this.router.navigate(['']);
    }

    
    if(this.session.isLoggedIn()){   
      this.router.navigate(['myaccount']);
    }


  }

}
