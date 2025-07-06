import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup , Validators  } from "@angular/forms";
import { SignupService } from '../services/signup.service';
import { NotificationService } from '../services/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LoginChecker } from '../helpers/loginChecker';

import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @Input()session: LoginChecker; 
  signupForm: FormGroup;
  submitted = false;

  viaphone:boolean=true;
  viaemail:boolean=false;
  currentUrl: any;

  constructor( public router: Router,
    public fb: FormBuilder,
    private signupService: SignupService,    
    private notify: NotificationService,
    private spinner: NgxSpinnerService,
    private seo:SeoService,
    private location: Location) { 

    this.currentUrl = location.path().replace('/','');
        this.seo.seolist(this.currentUrl);

      this.session = new LoginChecker();

      this.signupForm = this.fb.group({
        name: ['', Validators.required],
        email: [null],
        phone: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
      })
    }


    get f() { return this.signupForm.controls; }

    getLogin(e:any){

      this.submitted = false;
      this.signupForm = this.fb.group({
        name: [null],
        email: [null],
        phone: [null]
      })

      let v= e.target.value;
  
      if(v=='phone'){  
        this.signupForm = this.fb.group({
          name: ['', Validators.required],
          email: [null],
          phone: ['', [Validators.required,Validators.pattern("^[0-9]{10}$")]]
        })

        this.viaphone=true;
        this.viaemail=false;
      }
  
      if(v=='email'){  
        this.signupForm = this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: [null]
        })

        this.viaphone=false ;
        this.viaemail=true;
      }  
    } 


   onlyNumbers(event:any) {
      var e = event ;
      var charCode = e.which || e.keyCode;
     
        if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode ==8 || charCode==9)
          return true;
          return false;        
  }

  

  onSubmit() {

    this.submitted = true;

     // stop here if form is invalid
     if (this.signupForm.invalid) {
      return;
     }else{ 

      this.spinner.show();
       
       const signupData= {
        "name":this.signupForm.value.name,
        "email":this.signupForm.value.email,
        "phone":this.signupForm.value.phone,
        "created_by":this.signupForm.value.name
       };

       let sentTo='';

       if(this.signupForm.value.phone){

        sentTo=this.signupForm.value.phone;

      }

      if(this.signupForm.value.email){
        sentTo=this.signupForm.value.email;
      }
     

     
       this.signupService.signup(signupData).subscribe(
        res=>{ 

          this.spinner.hide();
         
          if(res.status==1){

           localStorage.setItem("resendParam",JSON.stringify(signupData));
           localStorage.setItem("otp_type",'signup');
           localStorage.setItem("via",sentTo);

            localStorage.setItem('userId',res.data.id);
            this.signupService.setAlert("OTP has been sent to "+sentTo);
              

            //this.notify.notify("OTP has been sent to "+sentTo,"Success");
           
            this.router.navigate(['otp']);

          }
           else if(res.status==0){
              this.notify.notify(res.message,"Error");
            }
          else{
            let msg  = JSON.parse(res.message); 
              let message='';
             
               if(msg['email']){
                 message += msg['email']+"\n";
               }

               if(msg['phone']){
                 message += msg['phone']+"\n";
               }

            this.notify.notify(message,"Error");
           
          }
  
        },
      error => {
        this.spinner.hide();
        this.notify.notify(error.error.message,"Error");
      }
      );        
     }
   
  }

  ngOnInit(): void {
    if(this.session.isLoggedIn()){
      this.router.navigate(['myaccount']);  
    }

  }

}
