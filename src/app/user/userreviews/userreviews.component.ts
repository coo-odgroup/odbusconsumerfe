import { Component, Input, OnInit } from '@angular/core';
import { UserdataService  } from '../../services/userdata.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbDatepickerConfig,NgbModal,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { LocationdataService } from '../../services/locationdata.service';
import { Router } from '@angular/router';
import { LoginChecker } from '../../helpers/loginChecker';
import { ManagebookingService } from '../../services/managebooking.service';
import { GlobalConstants } from 'src/app/constants/global-constants';


@Component({
  selector: 'app-userreviews',
  templateUrl: './userreviews.component.html',
  styleUrls: ['./userreviews.component.css'],
  providers: [NgbActiveModal]
})
export class UserreviewsComponent implements OnInit {

  userReviews:any;
  reviewdata:any;
  user:any;
  reviewForm: FormGroup;

  OverallRate = 0;
  ComfortRate = 0;
  CleanRate = 0;
  BehaviourRate = 0;
  TimingRate = 0;
  submitted = false;

  @Input() session: LoginChecker; 
  profile:any;




  constructor(private userdataservice: UserdataService,
              private sanitizer: DomSanitizer,
              private modalService: NgbModal,
              private spinner: NgxSpinnerService, 
              public fb: FormBuilder,
              private notify: NotificationService,
              private dtconfig: NgbDatepickerConfig,
              private router: Router,
              private locationService: LocationdataService,
              private managebookingService: ManagebookingService,
              public activeModal: NgbActiveModal
      ) { 

      this.user=JSON.parse(localStorage.getItem('user'));
      this.profileData();


      this.allReview();


      this.reviewForm = this.fb.group({
        comments: ['', Validators.required],
        title: ['', Validators.required]
      })
     
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

  editReview(i:any,review:any){ 

    this.reviewdata=this.userReviews[i];

    this.reviewForm = this.fb.group({
      comments: [this.reviewdata.comments],
      title: [this.reviewdata.title]
    });

    this.OverallRate =this.reviewdata.rating_overall;
    this.ComfortRate = this.reviewdata.rating_comfort;
    this.CleanRate = this.reviewdata.rating_clean;
    this.BehaviourRate = this.reviewdata.rating_behavior;
    this.TimingRate = this.reviewdata.rating_timing;


    this.modalService.open(review, { size: 'lg' });

  }

  get f() { return this.reviewForm.controls; }

  onSubmit() {

    this.submitted = true;

     // stop here if form is invalid
     if (this.reviewForm.invalid) {
      return;
     }else{ 

      this.spinner.show();
       
       const reviewData= {
        "pnr": this.reviewdata.pnr,
        "bus_id":this.reviewdata.bus_id,
        "users_id": this.profile.id,
        "reference_key": this.profile.email,
        "rating_overall": this.OverallRate,
        "rating_comfort": this.ComfortRate,
        "rating_clean": this.CleanRate,
        "rating_behavior": this.BehaviourRate,
        "rating_timing": this.TimingRate,
        "comments": this.reviewForm.value.comments,
        "title": this.reviewForm.value.title,
        "user_id":GlobalConstants.MASTER_SETTING_USER_ID
       };
     
       this.userdataservice.updateReview(reviewData,this.reviewdata.id).subscribe(
        res=>{ 

         if(res.status==1){
          this.allReview();
          this.modalService.dismissAll();
          this.notify.notify(res.message,"Success");
          this.router.navigate(['/my-reviews']);
         }else{
          this.notify.notify(res.message,"Error");
         }

          this.spinner.hide();

         
        },
      error => {
        this.spinner.hide();
        this.notify.notify(error.error,"Error");
      }
      );        
     }
   
  }


  deleteReview(i:any){

    this.reviewdata=this.userReviews[i];

     if(confirm("Are you sure to delete ? ")) {

      
    this.userdataservice.deleteReview(this.reviewdata.id,this.profile.id).subscribe(
      res=>{ 

       if(res.status==1){
        this.allReview();
        this.modalService.dismissAll();
        this.notify.notify(res.message,"Success");
        this.router.navigate(['/my-reviews']);
       }else{
        this.notify.notify(res.message,"Error");
       }

        this.spinner.hide();

       
      },
    error => {
      this.spinner.hide();
      this.notify.notify(error.error,"Error");
    }
    ); 

     }



  }

 

  allReview(){
    this.spinner.show();

    this.userdataservice.UserReviews(this.user.id,this.user.token).subscribe(
      res=>{ 
        if(res.status==1)
        { 
          this.userReviews =res.data;
        } 

        this.spinner.hide();
      });
  }

  getBusImagePath(icon :any){
    let objectURL = 'data:image/*;base64,'+icon  ;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   }
  
  ngOnInit(): void {
  }

}


