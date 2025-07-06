import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserdataService  } from '../../services/userdata.service';
import { CommonService  } from '../../services/common.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../../services/notification.service';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { LoginChecker } from '../../helpers/loginChecker';
import { HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from 'src/app/constants/global-constants';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {

profile:any;
profileForm: FormGroup;
PreviewimageUrl: any;
submitted = false;
url_path : any;
displays: string;

@Input()
  session: LoginChecker;

isMobile:boolean;
MenuActive: boolean = false;  

imageChangedEvent: any = '';
croppedImage: any = '';
  activeMenu: string;

  constructor(
    private userdataservice: UserdataService,
    private spinner: NgxSpinnerService,    
    private notify: NotificationService ,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder, 
    public router: Router,
    private Common: CommonService,
    private deviceService: DeviceDetectorService) {   

      this.isMobile = this.deviceService.isMobile();
      this.session = new LoginChecker();
      this.profileData();  
   
   }

   menu(){
    this.MenuActive = (this.MenuActive==false) ? true : false;
    this.activeMenu='';   
   }

  signOut(){
    this.session.logout();
    this.router.navigate(['login']);   
  }

   onFileChange(event:any) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.PreviewimageUrl = reader.result;
        this.profileForm.patchValue({
          profile_image: reader.result
        });
   
      };
   
    }
  }

  profile_image:any;
 
  fileChangeEvent(event: any): void {
     this.displays = "True";
     this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        let File = base64ToFile(this.croppedImage);

        this.profileForm.patchValue({
          profile_image: File
        });

    }
    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

   get f() { return this.profileForm.controls; }

   profileData(){
    
    this.spinner.show();
    this.profile=JSON.parse(localStorage.getItem('user'));

   // this.session = new LoginChecker();
    this.userdataservice.getProfile(this.profile.id,this.profile.token).subscribe(
      res=>{
        if(res.status==0)
        { 
          this.session.logout();
          this.router.navigate(['login']); 
        }

        this.spinner.hide();

      }); 

   }

  onSubmit() {

    console.log(this.profileForm);
   
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
     }else{ 

     this.spinner.show();
    
     let fd: any = new FormData();
        fd.append("profile_image", this.profileForm.get('profile_image').value);
        fd.append("name",this.profileForm.value.name);
        fd.append("email",this.profileForm.value.email);
        fd.append("pincode",this.profileForm.value.pincode);
        fd.append("street",this.profileForm.value.street);
        fd.append("district",this.profileForm.value.district);
        fd.append("address",this.profileForm.value.address);
        fd.append("userId",this.profile.id);
        fd.append("token",this.profile.token);

      this.userdataservice.updateProfile(fd).subscribe(
        res=>{          
          if(res.status==1){
            localStorage.setItem('user', JSON.stringify(res.data) );
            this.profile=res.data;        
            this.notify.notify(res.message,"Success");
          }

          if(res.status==0){                
            this.notify.notify(res.message,"Error");
            this.session.logout();
            this.router.navigate(['login']);
          }

          this.router.navigateByUrl('/header', { skipLocationChange: true }).then(() => {
            this.router.navigate(['myaccount']);
         }); 
       
          this.spinner.hide();
  
        },
      error => {
        this.spinner.hide();
        this.notify.notify(error,"Error");
      }
      );
    }

   }

   getImagePath(icon :any){  
   // let objectURL = 'data:image/*;base64,'+icon  ;
   return this.sanitizer.bypassSecurityTrustResourceUrl(icon);
 }
  ngOnInit(): void {

    this.displays = "false";

    this.Common.getPathUrls().subscribe( res=>{          
      if(res.status==1){  
        this.url_path=res.data[0];        
      }    
    });

    //this.session = new LoginChecker();

    this.profile= this.session.getUser();

    //console.log(this.profile);

    this.profileForm = this.fb.group({
      name: [this.profile.name, [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      email: [this.profile.email, [Validators.required, Validators.email]],
      pincode: [this.profile.pincode, Validators.required],
      street: [this.profile.street, Validators.required],
      district: [this.profile.district, Validators.required],
      address: [this.profile.address, Validators.required],
      profile_image: ['']
    });

    //console.log(this.profileForm);

  }
}