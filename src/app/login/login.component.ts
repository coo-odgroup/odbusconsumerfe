import { Component, Input, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { LoginChecker } from '../helpers/loginChecker';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EncryptionService } from '../encrypt.service';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  submitted = false;
  isMobile: boolean;

  viaphone: boolean = true;
  viaemail: boolean = false;

  @Input()
  session: LoginChecker;
  currentUrl: string;

  MenuActive: boolean = false;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public loginService: LoginService,
    private notify: NotificationService,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private location: Location,
    private enc:EncryptionService,
    private deviceService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
    this.session = new LoginChecker();
    this.loginForm = this.fb.group({
      email: [null],
      phone: ['',[Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],],
    });
  }

  menu(){
    this.MenuActive = true;
  }

  getLogin(e: any) 
  {
     this.submitted = false;  
     this.loginForm = this.fb.group({
        email: [null],
        phone: [null],
    });

    let v = e.target.value;

    if (v == 'phone') {
      this.loginForm = this.fb.group({
        email: [null],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      });
      this.viaphone = true;
      this.viaemail = false;
    }

    if (v == 'email') 
    {
        this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: [null],
      });

      this.viaphone = false;
      this.viaemail = true;
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onlyNumbers(event: any) {
    var e = event;
    var charCode = e.which || e.keyCode;

    if (
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 96 && charCode <= 105) ||
      charCode == 8 ||
      charCode == 9
    )
      return true;
    return false;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    } else {
      let sentTo = '';

      this.spinner.show();

      let param = {};

      if (this.viaphone) {
        sentTo = this.loginForm.value.phone;

        param = {
          phone: this.loginForm.value.phone,
        };
      }

      if (this.viaemail) {
        sentTo = this.loginForm.value.email;
        param = {
          email: this.loginForm.value.email,
        };
      }

      if (param) {
        this.loginService.signin(param).subscribe((res) => {
          if (res.status == 1) {
            if (res.message == 'Not a Registered User') {
              this.notify.notify(res.message, 'Error');
            } else {

              let data :any=this.enc.decrypt(res.data);
              data = JSON.parse(data); 
              localStorage.setItem('resendParam', JSON.stringify(param));
              localStorage.setItem('otp_type', 'login');
              localStorage.setItem('via', sentTo);

              localStorage.setItem('userId', data.id);

              this.loginService.setAlert('OTP has been sent to ' + sentTo);

              //this.notify.notify("OTP has been sent to "+sentTo,"Success");

              this.router.navigate(['otp']);
            }
          } else {

            let msg=this.enc.decrypt(res.message);

            let message = '';

            if(typeof msg ==='string')
            {
              message=  msg;
            }

            // if(typeof msg ==='object')
            // {
            //   let msg = JSON.parse(msg);
             
  
            //   if (this.viaemail && msg['email']) {
            //     message = msg['email'] + '\n';
            //   }
  
            //   if (this.viaphone && msg['phone']) {
            //     message = msg['phone'] + '\n';
            //   }
            // }   

           

            this.notify.notify(message, 'Error');
          }

          this.spinner.hide();
        });
      }
    }
  }

  ngOnInit(): void {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['myaccount']);
    }
  }
}
