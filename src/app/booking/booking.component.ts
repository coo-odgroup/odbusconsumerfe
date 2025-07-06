import { Component, OnInit, ChangeDetectorRef, Input, SecurityContext } from '@angular/core';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalLibraryService } from '../util';
import { BookticketService } from '../services/bookticket.service';
import { MakepaymentService } from '../services/makepayment.service';
import { PaymentstatusService } from '../services/paymentstatus.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../services/notification.service';
import { TokenService } from '../shared/token.service';
import { GenderCheck } from '../helpers/gender-check';
import { DatePipe } from '@angular/common';
import { LoginChecker } from '../helpers/loginChecker';
import { GlobalConstants } from '../constants/global-constants';
import { CouponService} from '../services/coupon.service';
import { Coupon } from '../model/coupon';
import * as moment from 'moment';

import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';


declare let Razorpay: any;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  providers: [DatePipe]
})

export class BookingComponent implements OnInit{ 

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };
 
  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Finish', class: 'btn btn-info', event: () => { alert("Finished!!!"); } }
      ],
    }
  };

  genderArr:any=[];
  couponData :  Coupon;

  currentUrl: any;


  @Input() session: LoginChecker;  

   Timer= 420;
   public bookForm1: FormGroup;
   public bookForm2: FormGroup;
   public bookForm3: FormGroup;
   public couponForm: FormGroup;

   submitted1=false;
   submitted2=false;
   couponSubmitted=false;

   bookingdata: any;
   busRecord: any;
   genderRestrictSeats: any;
   bookingDate:any;
   passengerData: any=[];

   bookTicketResponse :any=[];
   MakePaymnetResponse :any=[];

   source:any;
   destination:any;
   source_id:any;
   destination_id:any;
   entdate:any;
   formatentdate:any;

   razorpayResponse: any;
   response: any;
   tabclick :any = true;

   customerInfoname:any=null;
   customerInfoEmail:any=null;
   customerInfoPhone:any=null;

   isnameReadOnly:boolean=false;
   isphoneReadOnly:boolean=false;
   ismailReadOnly:boolean=false;

   total_seat_name:any=[];
   seat_ids:any=[];
   lb_seats:any=[];
   ub_seats:any=[];
   loadingText: string = 'Loading...';

   created_by:any='Customer';

   agent:any;
   applied_comission:number=0;
   commissionError:Boolean=false;


  constructor(private ngWizardService: NgWizardService,private fb : FormBuilder,
    private router: Router,private bookticketService:BookticketService,
    private razorpayService: ExternalLibraryService,
    private cd:  ChangeDetectorRef,
    private notify: NotificationService,
    private makepaymentService:MakepaymentService,
    private paymentstatusService: PaymentstatusService,
    private spinner: NgxSpinnerService,    
    private token: TokenService,
    private datePipe: DatePipe,
    private couponService:CouponService,
    private seo:SeoService,
      private location: Location,
      private sanitizer: DomSanitizer
    ) {    

      this.currentUrl = location.path().replace('/','');
      this.seo.seolist(this.currentUrl);


      this.session = new LoginChecker();

      if(this.session.isLoggedIn()){
        this.user = this.session.getUser();
        this.customerInfoname=this.user.name;
        this.customerInfoEmail=this.user.email;
        this.customerInfoPhone=this.user.phone;  
      }
     
     
    this.source=localStorage.getItem('source');
    this.destination=localStorage.getItem('destination');   
    const entdt:any =localStorage.getItem('entdate'); 

    this.entdate = this.showformattedDate(entdt);

    this.source_id=localStorage.getItem('source_id');
    this.destination_id=localStorage.getItem('destination_id');


    this.genderArr=[
      {
        'name' : 'Male',
        'value' : 'M'
      },
      {
        'name' : 'Female',
        'value' : 'F'
      },
      {
        'name' : 'Other',
        'value' : 'O'
      }
    ];

    this.bookingdata=localStorage.getItem('bookingdata');
    this.busRecord=localStorage.getItem('busRecord');
    this.genderRestrictSeats=localStorage.getItem('genderRestrictSeats');

   

    if(this.bookingdata == null && this.busRecord == null){
      this.router.navigate(['/']);
    }else{
      this.bookingdata= JSON.parse(this.bookingdata);

      this.busRecord= JSON.parse(this.busRecord);

      this.genderRestrictSeats= JSON.parse(this.genderRestrictSeats);

      let brdTm_arr = this.bookingdata.boardingPoint.split(" - ");
      let drpTm_arr = this.bookingdata.droppingPoint.split(" - ");

      this.bookingdata.boardingPoint=brdTm_arr[0];
      this.bookingdata.droppingPoint=drpTm_arr[0];
      this.busRecord.departureTime=brdTm_arr[1];
      this.busRecord.arrivalTime=drpTm_arr[1];

     
    

      if(this.bookingdata.UpperBerthSeats.length){
        this.total_seat_name =this.total_seat_name.concat(this.bookingdata.UpperBerthSeats);
        this.ub_seats = this.ub_seats.concat(this.bookingdata.UpperBerthSeats);

      } 

      if(this.bookingdata.LowerBerthSeats.length){
        this.total_seat_name =this.total_seat_name.concat(this.bookingdata.LowerBerthSeats);
        this.lb_seats = this.lb_seats.concat(this.bookingdata.LowerBerthSeats);
      }
      
      

      if(this.bookingdata.Upperberth.length){
        this.seat_ids =this.seat_ids.concat(this.bookingdata.Upperberth);
      }

      if(this.bookingdata.Lowerberth.length){
        this.seat_ids =this.seat_ids.concat(this.bookingdata.Lowerberth);
      }
      
    }

    this.bookForm2 = this.fb.group({
      tnc:[true, Validators.requiredTrue]
    });


    this.couponData={  
      "totalAmount": this.bookingdata.PriceArray.totalFare,    
      "discount": 0,
      "payableAmount" :this.bookingdata.PriceArray.totalFare
    } as Coupon;


    this.bookForm3 = this.fb.group({});

        this.bookForm1 = this.fb.group({
          customerInfo: this.fb.group({          
            email: [this.customerInfoEmail, [Validators.email]],
            phone: [this.customerInfoPhone, [Validators.required,Validators.pattern("^[0-9]{10}$")]],  
            name:[this.customerInfoname, Validators.required],
          }),   
          bookingInfo: this.fb.group({
  
            "user_id":GlobalConstants.USER_ID,
            bus_id: [this.busRecord.busId],
            source_id: [this.source_id],
            destination_id: [this.destination_id],
            journey_dt: [this.entdate],
            boarding_point: [this.bookingdata.boardingPoint],
            dropping_point: [this.bookingdata.droppingPoint],
            boarding_time: [this.busRecord.departureTime],
            dropping_time: [this.busRecord.arrivalTime],
            origin: ["ODBUS"],
            app_type: ["WEB"],
            typ_id: ["1"],
            total_fare: this.bookingdata.PriceArray.totalFare,
            specialFare: this.bookingdata.PriceArray.specialFare,
            addOwnerFare:this.bookingdata.PriceArray.addOwnerFare,
            festiveFare:this.bookingdata.PriceArray.festiveFare,
            owner_fare: this.bookingdata.PriceArray.ownerFare,
            odbus_service_Charges: this.bookingdata.PriceArray.odbusServiceCharges,
            created_by: this.created_by,
            bookingDetail: this.fb.array([]),        
          })
        });
  
    


    const bookingInfo = this.bookForm1.controls["bookingInfo"] as FormGroup;
    const passengerList = bookingInfo.get('bookingDetail') as FormArray;
    
      for(let i=0;i< this.bookingdata.Upperberth.length ;i++){
        let seat= this.bookingdata.Upperberth[i];
         passengerList.push(this.createItem(seat,this.busRecord.sleeperPrice)); 
      }

      for(let i=0;i< this.bookingdata.Lowerberth.length ;i++){
        let seat= this.bookingdata.Lowerberth[i];
         passengerList.push(this.createItem(seat,this.busRecord.seaterPrice)); 
      }  


      this.couponForm = this.fb.group({
        coupon_code:[null, Validators.required]
      });
  
  }

  public tncStatus:boolean=true;

  public tncStatusChange(value:boolean){
      this.tncStatus = value;
  }

  onlyNumbers(event:any) {
    var e = event ;
    var charCode = e.which || e.keyCode;
   
      if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode ==8 || charCode==9)
        return true;
        return false;        
}

get_seatno(seat_id:any){
  for(let i=0;i< this.bookingdata.Lowerberth.length ;i++){
    let seat= this.bookingdata.Lowerberth[i];
     if(seat==seat_id){
      return this.bookingdata.LowerBerthSeats[i]
     }
  }  

  for(let i=0;i< this.bookingdata.Upperberth.length ;i++){
    let seat= this.bookingdata.Upperberth[i];
    if(seat==seat_id){
      return this.bookingdata.UpperBerthSeats[i]
     }
  }
}

  showformattedDate(date:any){
    if(date){

      let dt = date.split("-");
    return dt[2]+'-'+dt[1]+'-'+dt[0];

    }
    

  }

   createItem(seat:any,fare:any): FormGroup{

   // console.log(this.genderRestrictSeats);

    return this.fb.group({
      bus_seats_id: [seat], 
      passenger_name: [null, Validators.required],
      passenger_gender: [null, Validators.required],
      passenger_age:  [null, [Validators.required]],
      created_by: this.created_by
    },
    {
      validator: GenderCheck('passenger_gender','bus_seats_id', this.genderRestrictSeats)
    });
  }

  get passengerFormGroup() {
    const bookingInfo = this.bookForm1.controls["bookingInfo"] as FormGroup;
    const passengerList = bookingInfo.get('bookingDetail') as FormArray;    
    return passengerList;
  }

  getPassengerFormGroup(index:any): FormGroup {
    const bookingInfo = this.bookForm1.controls["bookingInfo"] as FormGroup;
    const passengerList = bookingInfo.get('bookingDetail') as FormArray;
    const formGroup = passengerList.controls[index] as FormGroup;
    return formGroup;
  }

  get f() {     
    return this.bookForm1.controls;
   }

   get GetcustomerInfo():FormGroup{

    const FormGroup = this.bookForm1.get('customerInfo') as FormGroup;
    //const FormControl = ele.controls[type] as FormControl;
   // console.log(FormGroup);
    return FormGroup;

   }

   ApplyCoupon(){

    this.couponSubmitted=true;

    if (this.couponForm.invalid) {
      return;
    }else{
     this.spinner.show();   

    const params= {
      "coupon_code":this.couponForm.value.coupon_code,  
      "bus_id":this.busRecord.busId,  
      "source_id":this.source_id, 
      "destination_id":this.destination_id,
      "journey_date":this.entdate,
      "bus_operator_id":this.busRecord.operatorId,
      "total_fare":this.bookingdata.PriceArray.totalFare,
      "transaction_id" :this.bookTicketResponse.transaction_id
    };

     this.couponService.apply(params).subscribe(
      res=>{
        this.spinner.hide();          
        if(res.status==1){ 
          //console.log(res); 
          this.couponData=res.data;
          
        }else{
          this.notify.notify(res.message,"Error");
        }    
    },
    error => {

      this.spinner.hide();
      this.notify.notify(error.error.message,"Error");
     
    }
    );


    }

   }

   setCommission(event:any){

    if(event.target.value <= this.bookTicketResponse.customer_comission){
      this.applied_comission=event.target.value;
      this.commissionError=false;
    }else{
      this.commissionError=true;
      return false;
    }  
   }
  
  submitForm1(){
    this.submitted1=true;

    if (this.bookForm1.invalid) {
      return;
     }else{
      this.spinner.show();
      this.passengerData=this.bookForm1.value; 


        this.bookticketService.book(this.passengerData).subscribe(
          res=>{ 

          if(res.status==1){            
            this.bookTicketResponse=res.data;
            this.showNextStep();
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

  }

  countdown:any;

  submitForm2(){

    this.submitted2=true;
    if (this.bookForm2.invalid) {
      return;
     }else{
     
      let pass_det=this.bookForm1.value.bookingInfo.bookingDetail;

      let gender:any=[];
      pass_det.forEach((e: any) => {
        gender.push(e.passenger_gender);
        
      });

      const entdt:any =localStorage.getItem('entdate'); 

      this.spinner.show();
      ///// call to make payment API to get RazorPayment Order ID and Total price   

        const paymentParam={        
          "busId" : this.busRecord.busId,
          "sourceId":this.source_id, 
          "destinationId":this.destination_id,
          "transaction_id": this.bookTicketResponse.transaction_id,
          "amount":this.couponData.payableAmount,
          "seatIds":this.seat_ids,
          "entry_date":entdt
        }

        this.makepaymentService.getOrderid(paymentParam).subscribe(
          res=>{
                    
            if(res.status==1){
              if(res.data=='SEAT UN-AVAIL'){
                this.notify.notify(res.message,"Error");
              }else{
                this.MakePaymnetResponse=res.data;          
                this.OpenRazorpayModal();
              }
              
            }else{
              this.notify.notify(res.message,"Error");
            } 

            this.spinner.hide();  

        });
     
  }

   }

   razorpay:any;

   handleEvent(event:any){    
    if(event.action === 'done'){
      this.razorpay.close();
      this.router.navigate(['/']);
    }
  }


  public OpenRazorpayModal() {
    
  this.spinner.hide();

   const RAZORPAY_OPTIONS :any = {
      "key": this.MakePaymnetResponse.key,
      "amount": this.MakePaymnetResponse.amount,
      "name": "ODBUS PAYMENT",
      "order_id": this.MakePaymnetResponse.razorpay_order_id,
      "description": "",
      "image": "assets/img/odbus-logo.svg",
      "prefill": {
        "name": this.passengerData.customerInfo.name,
        "email": this.passengerData.customerInfo.email,
        "contact": '+91'+this.passengerData.customerInfo.phone,
        "method": ""
      },
      "modal": {},
      "theme": {
        "color": "#d39e00"
      }
    };
   
    RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);
    this.razorpay = new Razorpay(RAZORPAY_OPTIONS)

    this.razorpay.open();    
  }


  razorPaySuccessHandler(res: any) { 
    
    if(res && res.razorpay_signature && res.razorpay_payment_id){

    

    let bkdt = new Date();
    let bkdt_mnth = ("0" + (bkdt.getMonth() + 1)).slice(-2);
    let bkdt_day = ("0" + bkdt.getDate()).slice(-2);
    let booking_date= [bkdt_day, bkdt_mnth,bkdt.getFullYear()].join("-");

    this.bookingDate= [bkdt.getFullYear(),bkdt_mnth,bkdt_day].join("-");

    let j_date = new Date(this.entdate);
    let j_mnth = ("0" + (j_date.getMonth() + 1)).slice(-2);
    let j_day = ("0" + j_date.getDate()).slice(-2);
    let journey_date= [j_day,j_mnth,j_date.getFullYear()].join("-");

    const param=  {
      "transaction_id":this.bookTicketResponse.transaction_id,   
      'razorpay_payment_id' : res.razorpay_payment_id,
      'razorpay_order_id' : res.razorpay_order_id,
      'razorpay_signature' : res.razorpay_signature , 
      "name":this.passengerData.customerInfo.name,
      "phone":this.passengerData.customerInfo.phone,    
      "email":this.passengerData.customerInfo.email,    
      "routedetails":this.source+'-'+this.destination,    
      "bookingdate":booking_date,
      "journeydate":journey_date,
      "boarding_point":this.bookingdata.boardingPoint,
      "departureTime":this.busRecord.departureTime,
      "dropping_point":this.bookingdata.droppingPoint,
      "arrivalTime":this.busRecord.arrivalTime,
      "seat_id":this.seat_ids,  
      "seat_no": this.total_seat_name ,
      "bus_id" : this.busRecord.busId,
      "source": this.source,
      "destination": this.destination,
      "busname": this.busRecord.busName,
      "busNumber": this.busRecord.busNumber,
      "bustype":this.busRecord.busType,
      "busTypeName":this.busRecord.busTypeName,
      "sittingType":this.busRecord.sittingType,
      "conductor_number":this.busRecord.conductor_number,
      "passengerDetails":this.passengerData.bookingInfo.bookingDetail,
      "totalfare":this.bookingdata.PriceArray.totalFare, 
      "discount":this.couponData.discount,
      "payable_amount":this.couponData.payableAmount,   
      "odbus_charges":this.bookingdata.PriceArray.odbusServiceCharges,
      "odbus_gst":this.bookingdata.PriceArray.transactionFee, 
      "owner_fare":this.bookingdata.PriceArray.ownerFare   
    }
    
  
    this.spinner.show("mySpinner");

    
    this.paymentstatusService.getPaymentStatus(param).subscribe(
      res=>{

        if(res.status==1){ 

          this.showNextStep();                 
          this.tabclick = false;           
          setTimeout(() => {
            this.spinner.hide("mySpinner");
          }, 5000); 
          
            localStorage.removeItem('bookingdata');
            localStorage.removeItem('busRecord');
            localStorage.removeItem('genderRestrictSeats');
            localStorage.removeItem('source');
            localStorage.removeItem('source_id');
            localStorage.removeItem('destination');
            localStorage.removeItem('destination_id');
            localStorage.removeItem('entdate'); 


          this.notify.notify(res.data,"Success");
        }else{
          this.notify.notify(res.message,"Error");
        }

    },
    error => {
      this.notify.notify(error.error.message,"Error");
      this.spinner.hide();   

    }
    );

   }

   this.loadingText = 'Loading...';
  }

  print(): void {
    var printButton = document.getElementById('print_btn');
    printButton.style.visibility = 'hidden';
    const printContents = document.getElementById('print-section').innerHTML;
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
   
    popupWin.document.write(`
        <html>
            <head>
                <title>Print Page</title>
                <style>
                .container {
                  max-width:1320px !important;
                  margin:0 auto ;
              }
              
              .od-body{
                  border:3px solid #323232;
                  padding: 25px;
                  margin-top: 20px;
              }
              
              .row {
               display: flex;
               flex-wrap: wrap;
               margin-right: -15px;
               margin-left: -15px;
              }
              
              .od-logo{
                 height: 80px;
              }
              
              .odtext24 h3{
                 font-size:20px;
                 text-align: left;
                 line-height:26px;
                 font-weight:600;
                 color: #323232;
              }
              
              .odtext32{
                 font-size:28px;
                 text-align: center;
                 line-height:34px;
                 font-weight:600;
                 padding-top: 8px;
                 color: #043c5d;
              }
              
              .odtext32 span{
                 font-weight: 800;
              }
              
              .od-bktext{
                 font-size:18px;
                 text-align: center;
                 line-height: 22px;
                 color: #000000;
                 border:1px solid #c4c4c4 ;
                 padding:8px ;
                 font-weight: 600;
              }
              .od-banner{
                 width: 100%;
              }
              .od-qrcode{
                 background:#c4c4c4;
                 padding: 15px;
                 width: 100%;
                 margin-top: 34px;
              }
              .mt30{
               margin-top: 35px;
              }
              .mb25{
                 
                 margin-bottom: 35px;
              }
              
              .mb40{
                 margin-bottom: 40px;
              }
              
              .odbox1{
               border: 1px solid #c4c4c4;
               padding:25px 15px;
              }
              
              .odbox1 ol{
               margin-left: -20px;
              }
              
              .odbox2{
               border: 1px solid #000000;
               padding:25px 15px;
              }
              
              .odbox2 p{
               font-size:18px;
               color: #000000;
               font-weight: 600;
               margin-bottom: 8px;
              }
              
              .odbox3 p{
               font-size:18px;
               color: #000000;
               font-weight: 600;
               margin-bottom: 8px;
               text-align: right;
              }
                </style>
            </head>
            <body
                style="font-size: 14px;
                    font-family: 'Source Sans Pro', 'Helvetica Neue',
                    Helvetica, Arial, sans-serif;
                    color: #333";
                onload="document.execCommand('print');window.close()">${printContents}</body>
        </html>`
    );
    printButton.style.visibility = 'visible';
    popupWin.document.close();
  }  

  user :any=[];
  isSignedIn: boolean;

   myDate:any = new Date();
  ngOnInit() { 
    this.passengerData=this.bookForm1.value;

    this.razorpayService
    .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
    .subscribe();
    
    const entdt:any =localStorage.getItem('entdate'); 

    this.myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy');

    if(moment(this.myDate) > moment(entdt)){
      this.router.navigate(['/']);
    }
  }
 
  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }
 
  showNextStep(event?: Event) {
    this.ngWizardService.next();
    
  }
 
  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }
 
  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }
 
  stepChanged(args: StepChangedArgs) {
    //console.log(args);
  }
 
  isValidTypeBoolean: boolean = true;
 
  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }
 
  isValidFunctionReturnsObservable(args: StepValidationArgs) {    
    return this.tabclick;
  }

}