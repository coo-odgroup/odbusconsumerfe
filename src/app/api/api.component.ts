import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiReferenceService } from '../services/apireference.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../services/notification.service';



@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {

  public form1: FormGroup;
  submitted= false;


   
    constructor(private api: ApiReferenceService,private fb : FormBuilder, 
      public router: Router,
      private spinner: NgxSpinnerService,
      private notify: NotificationService

      ) {

    this.form1 = this.fb.group({           
        email: ['', [Validators.required,Validators.email]],
        phone: ['', Validators.required],  
        name:['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
        company_name:['', Validators.required]
      })  

   }

   onlyNumbers(event:any) {
    var e = event ;
    var charCode = e.which || e.keyCode;
   
      if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode ==8 || charCode==9)
        return true;
        return false;        
}


   get f() { return this.form1.controls; }

   onSubmit() {

    this.submitted = true;

     // stop here if form is invalid
     if (this.form1.invalid) {
      return;
     }else{ 

      this.spinner.show();
       
       const dt= {
        "name":this.form1.value.name,
        "email":this.form1.value.email,
        "phone":this.form1.value.phone,
        "company_name":this.form1.value.company_name
       };
     
       this.api.apiref_add(dt).subscribe(
        res=>{ 

          this.spinner.hide();
         
          if(res.status==1){           
            this.router.navigate(['thank-you']);

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
  }

}
