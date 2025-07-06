import { Component,Input,OnInit } from '@angular/core';
import { UserdataService  } from '../../services/userdata.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../../services/notification.service';
import { NgbDatepickerConfig,NgbModal,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { LocationdataService } from '../../services/locationdata.service';
import { Router } from '@angular/router';
import { LoginChecker } from '../../helpers/loginChecker';
import { ManagebookingService } from '../../services/managebooking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/constants/global-constants';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css'],
  providers: [NgbActiveModal]
})
export class UserdashboardComponent implements OnInit {

  list:any=[];
  per_page=5;

  
  @Input() session: LoginChecker; 

  statusLabel:any='';

  profile:any;

  cancelInfo:any;

  pnr:any;
  bus_id:any;

  OverallRate = 0;
  ComfortRate = 0;
  CleanRate = 0;
  BehaviourRate = 0;
  TimingRate = 0;

  
  reviewForm: FormGroup;
  submitted = false;
  user:any;

  constructor(private userdataservice: UserdataService,
    private spinner: NgxSpinnerService,    
    private notify: NotificationService,
    private dtconfig: NgbDatepickerConfig,
    private router: Router,
    private locationService: LocationdataService,
    private managebookingService: ManagebookingService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public fb: FormBuilder) { 

      this.user=JSON.parse(localStorage.getItem('user'));
      
      this.getList();
      this.profileData();


      const current = new Date();
        this.dtconfig.minDate = { year: current.getFullYear(), month: 
         current.getMonth() + 1, day: current.getDate() };

         this.reviewForm = this.fb.group({
          comments: ['', Validators.required],
          title: ['', Validators.required]
        })

        
   }

   viewTicket(pnr:any){

    const request= {
      "pnr":pnr,
      "mobile":this.profile.phone
     };   
     

     this.managebookingService.getbookingdetails(request).subscribe(
      res=>{ 
        if(res.status==1){          
          localStorage.setItem('bookingDetails',JSON.stringify(res.data[0]));
          this.router.navigate(['manage-booking-detail']);            
        } 
        if(res.status==0){
          this.notify.notify(res.message,"Error");
        } 

        this.spinner.hide();
      },
    error => {
      this.spinner.hide();
      this.notify.notify(error.error.message,"Error");
    });

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

   getList(url:any='',status:any=''){

    this.spinner.show();

    this.statusLabel=status;
    const param= {
      "status":status,
      "paginate":this.per_page,
      "userId":this.user.id,
      "token":this.user.token
     };

    
     this.userdataservice.BookingHistroy(url,param).subscribe(
      res=>{ 
        if(res.status==1){             
         this.list=res.data.data;
        }
        this.spinner.hide();

      },
    error => {
      this.spinner.hide();
      //this.notify.notify("Login is expired","Error");
    }
    );
   }


   page(label:any){
    return label;
   }

   
  cancel_ticket(){
    this.spinner.show();
    const request= {
      "pnr":this.pnr,
      "phone":this.profile.phone
     };

     
    this.managebookingService.cancelTicket(request).subscribe(
      res=>{ 
        
        if(res.status==1){          
          this.notify.notify(res.message,"Success");   
          this.getList();
          this.modalService.dismissAll();
        } 

        if(res.status==0){
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

   cancelTicketTab(pnr:any,content:any) {   

    this.pnr=pnr;

    this.spinner.show();


    const request= {
      "pnr":this.pnr,
      "mobile":this.profile.phone
     };

    this.managebookingService.getcancelTicketInfo(request).subscribe(
      res=>{

        if(res.status==1){
          if(typeof res.data ==='string'){

            this.notify.notify(res.data,"Error");

          }
          if(typeof res.data ==='object'){

            this.open(content);

            this.cancelInfo=res.data; 

          }              
        }

        if(res.status==0){
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

  open(content:any) {
    this.modalService.open(content);
  }

  
  sourceData:any;
  destinationData:any;
  bookAgain(sr:any,ds:any){
    this.spinner.show();

    

    this.locationService.all().subscribe(
      res=>{
        if(res.status==1)
        { 
          res.data.filter((itm) =>{          

            if(sr===itm.name){
             this.sourceData=itm;
            }

            if(ds===itm.name){
              this.destinationData=itm;
            }

          });

          let dt=(<HTMLInputElement>document.getElementById("todayDate")).value;
          this.listing(this.sourceData,this.destinationData,dt);

        }
      });  

      this.spinner.hide();

      

  }

  listing(s:any,d:any,dt: any){
  
    this.locationService.setSource(s);
    this.locationService.setDestination(d);
    this.locationService.setDate(dt);    
    this.router.navigate(['/listing']);
  }
  




  addReview(pnr:any,bus_id:any,review:any){
    this.pnr=pnr;
    this.bus_id=bus_id;
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
        "pnr": this.pnr,
        "bus_id":this.bus_id,
        "users_id": this.profile.id,
        "reference_key": this.profile.email,
        "rating_overall": this.OverallRate,
        "rating_comfort": this.ComfortRate,
        "rating_clean": this.CleanRate,
        "rating_behavior": this.BehaviourRate,
        "rating_timing": this.TimingRate,
        "comments": this.reviewForm.value.comments,
        "title": this.reviewForm.value.title,
        "user_id":GlobalConstants.MASTER_SETTING_USER_ID,
        "created_by": this.profile.name
       };
     
       this.userdataservice.addreview(reviewData).subscribe(
        res=>{ 

         if(res.status==1){
          this.modalService.dismissAll();
          this.notify.notify(res.message,"Success");
          this.router.navigate(['/my-reviews']);
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


  ngOnInit(): void {
    
  }

}
