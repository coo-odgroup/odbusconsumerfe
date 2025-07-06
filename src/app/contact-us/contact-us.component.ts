import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../services/notification.service';
import { ContactService } from '../services/contact.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginChecker } from '../helpers/loginChecker';
import { CommonService } from '../services/common.service';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  contactForm: FormGroup;
  submitted = false;
  currentUrl: any;
  isMobile: boolean;
  MenuActive: boolean = false;
  session: LoginChecker;
  activeMenu: string;
  @Input() masterSettingRecord;
  constructor( public router: Router,
    public fb: FormBuilder,
    private contactService: ContactService,    
    private notify: NotificationService, 
    private spinner: NgxSpinnerService,
    private seo:SeoService,
    private deviceService: DeviceDetectorService,
    private location: Location,
    private commonService: CommonService,

    ) { 

      this.isMobile = this.deviceService.isMobile();
      this.session = new LoginChecker();
      this.currentUrl = location.path().replace('/','');
      this.seo.seolist(this.currentUrl);
      

      this.contactForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        phone: ['', [Validators.required,Validators.pattern("^[0-9]{10}$")]],
        service: ['', Validators.required],
        message: ['', Validators.required],
        user_id:[GlobalConstants.MASTER_SETTING_USER_ID]
      })
    }

    menu() {
      this.MenuActive = (this.MenuActive==false) ? true : false;  
      this.activeMenu='';    
    }
  
    signOut() {
        this.session.logout();
        this.router.navigate(['login']);
    }

    ngAfterContentChecked(){
      
      //console.log(this.masterSettingRecord.common.office_address_map);
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
     if (this.contactForm.invalid) {
      return;
     }else{ 
      this.spinner.show();
      this.contactService.save(this.contactForm.value).subscribe(
        res=>{ 
          this.spinner.hide();         
          if(res.status==1){  
            this.router.navigate(['thankyou']);
          }
          else if(res.status==0){
            this.notify.notify(res.message,"Error");
          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.notify.notify(error.error.message,"Error");
        }
      );        
     }
   
  }


  get f() { return this.contactForm.controls; }

  ngOnInit(): void {

    this.masterSettingRecord = this.commonService.commonData;
    console.log(this.masterSettingRecord.common.office_address_map);
  }

}
