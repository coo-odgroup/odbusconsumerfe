import { Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl} from '@angular/forms';
import {NgbNavConfig, NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { LocationdataService } from '../services/locationdata.service';
import { ListingService } from '../services/listing.service';
import { FilterOptionsService } from '../services/filter-options.service';
import { SeatLayoutService } from '../services/seat-layout.service';
import { FilterService } from '../services/filter.service';
import { GetSeatPriceService } from '../services/get-seat-price.service';
import { BoardingDropingPointService } from '../services/boarding-droping-point.service';
import { ActivatedRoute, Router ,Routes} from '@angular/router';
import { SeatsLayout } from '../model/seatslayout';
import { Buslist } from '../model/buslist';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../services/notification.service';
import { DatePipe, formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { GlobalConstants } from '../constants/global-constants';
import { CommonService  } from '../services/common.service';
import * as moment from 'moment';
import { SeoService } from '../services/seo.service';
import { Lightbox } from 'ngx-lightbox';
import { PopularRoutesService } from '../services/popular-routes.service';
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbDatepickerConfig,NgbModal,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { time } from 'console';
import 'lodash';
import { exit } from 'process';

declare var _:any;


export const DATEPICKER_VALUE_ACCESSOR =  {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchComponent),
  multi: true
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [DatePipe,NgbActiveModal]
})



export class SearchComponent  implements OnInit {  

  selectedDate: any;
  disabled = false;
  isMobile:boolean;

  journey_date:any;

  couponDetail:any=[];

  _albums = [];
  // Function to call when the date changes.
  onChange = (date?: Date) => {};

  // Function to call when the date picker is touched
  onTouched = () => {};

  writeValue(value: Date) {
    if (!value) return;
    this.selectedDate = {
      year: value.getFullYear(),
      month: value.getMonth(),
      day: value.getDate()
    }
  }

  registerOnChange(fn: (date: Date) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Write change back to parent
  onDateChange(value: Date) {
    this.onChange(value);
  }

  // Write change back to parent
  onDateSelect(value: any) {
    this.onChange(new Date(value.year, value.month - 1, value.day));
  }

  commonData:any;

  source :any;
  destination :any;
  source_id :any;
  destination_id :any;
  entdate :any;
  jrnyDt:any;
  buslist :Buslist[] =[];
  buslistRecord :Buslist;
  currentSeatlayoutIndex:boolean=false;

  busId: any;
  busIds: any=[];
  seatsLayouts :  SeatsLayout[];
  seatsLayoutRecord :  SeatsLayout;  

  public filterForm: FormGroup;
  public MobilefilterForm: FormGroup;

  keyword = 'name'  
  public searchForm: FormGroup;
  public seatForm: FormGroup ;

  public Source: string = 'Source';
  public Destination: string = 'Destination';

  swapdestination:any;
  swapsource:any;

  public source_list:  any = [];
  public destination_list:  any = []; 

  busTypes :any=[];
  seatTypes :any=[];
  boardingPoints :any=[];
  droppingPoints :any=[];
  busOperators :any=[];
  amenities :any=[];

  LowerberthArr: any=[];
  UpperberthArr: any=[];

  LowerberthMobileArr:any=[];
  UpperberthMobileArr:any=[];

  boardingPointArr:any=[];
  droppingPointArr:any=[];
 
  Lowerberth: any;
  Upperberth: any;

  selectedLB:any=[];
  selectedUB:any=[];
  PriceArray:any=[];

  
  maxSeat:number=0;
  checkedIndex:any=0;

  url_path : any;
  totalfound: any ;

  colarr:any[]=[];
  mobilecolarr:any[]=[];

  selectedBoard:any;
  selectedDrop:any;

  seatlayoutShow: any='';
  safetyshow: any='';
  busPhotoshow: any='';
  reviewShow: any='';
  policyShow: any='';
  amenityShow: any='';
  btnstatus :any='hide';

  isShown: boolean = false ; // hidden by default

  seatLoader : boolean = false ;


  isAscendingSort: any='';
  columnName: any = '';
  arrowStatus: any='';

  search:any;
  location_list:any;
  formatter:any;
  currentUrl:any;


  myDate:any = new Date();
  sourceData:any;
  destinationData:any;
  prevDate:any;
  nextDate:any;
  maxAllowedDate:any=new Date();
  referenceNumber:any='';
  origin:any='';
  show = 5;
 
  constructor(
        private router: Router,
        private fb : FormBuilder , 
        config: NgbNavConfig,
        private locationService: LocationdataService,
        private listingService : ListingService, 
        private filterOptionsService : FilterOptionsService,
        private sanitizer: DomSanitizer, private filterService :FilterService,
        private seatLayoutService: SeatLayoutService,
        private getSeatPriceService:GetSeatPriceService,
        private boardingDropingPointService:BoardingDropingPointService,
        private notify: NotificationService,
        private dtconfig:NgbDatepickerConfig,
        private datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        private Common: CommonService,
        private seo:SeoService,
        private _lightbox: Lightbox,
        private location: Location,
        private popularRoutesService:PopularRoutesService,
        private deviceService: DeviceDetectorService,
        private modalService: NgbModal,
        private route: ActivatedRoute
        
     ) { 

      this.locationService.all().subscribe(
        res=>{
  
          if(res.status==1)
          { 
            this.location_list =res.data;
            //console.log(this.location_list);
            this.search = (text$: Observable<string>) =>
              text$.pipe(
                debounceTime(200),
                map((term) =>
                  term === ''
                    ? []
                    : this.location_list
                        .filter(
                          (v) =>
                            v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                            ( v.synonym!='' && v.synonym!=null && v.synonym.toLowerCase().indexOf(term.toLowerCase()) > -1)
                        )
                        .slice(0, 10)
                )
              );
  
             this.formatter = (x: { name: string }) => x.name; 
  
         }
          else{ 
            this.notify.notify(res.message,"Error");
          }
            
        });

      this.isMobile = this.deviceService.isMobile();
            
        this.currentUrl = location.path().replace('/','');
        this.seo.seolist(this.currentUrl);

          this.buslistRecord = {} as Buslist;

          this.seatsLayouts=[];
          this.seatsLayoutRecord={} as SeatsLayout;

          this.seatsLayoutRecord.visibility=false;

          config.destroyOnHide = false;
          config.roles = false;

          this.searchForm = this.fb.group({
            source: [null, Validators.compose([Validators.required])],
            destination: [null, Validators.compose([Validators.required])],
            entry_date: [null, Validators.compose([Validators.required])],
          });
        
          this.filterForm = this.fb.group({
            price: [0],
            busType: this.fb.array([]),
            seatType: this.fb.array([]),
            boardingPointId: this.fb.array([]),
            dropingingPointId: this.fb.array([]),
            operatorId: this.fb.array([]),
            amenityId: this.fb.array([]),
          })


          this.MobilefilterForm = this.fb.group({
            price: [0],
            busType: this.fb.array([]),
            seatType: this.fb.array([]),
            boardingPointId: this.fb.array([]),
            dropingingPointId: this.fb.array([]),
            operatorId: this.fb.array([]),
            amenityId: this.fb.array([]),
          })


          this.seatForm = this.fb.group({
            boardingPoint: [null, Validators.compose([Validators.required])],
            droppingPoint: [null, Validators.compose([Validators.required])],
            Lowerberth:this.fb.array([]),   
            Upperberth:this.fb.array([])   
          }); 

          
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._albums, index);
  }
 
  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }


  lastPanelId: string = null;
  defaultPanelId: string = "price";

  panelShadow($event: NgbPanelChangeEvent, shadow) {
   
    const { nextState } = $event;

    const activePanelId = $event.panelId;
    const activePanelElem = document.getElementById(activePanelId);

    if (!shadow.isExpanded(activePanelId)) {
      activePanelElem.parentElement.classList.add("open");
    }

    if(!this.lastPanelId) this.lastPanelId = this.defaultPanelId;

    if (this.lastPanelId) {
      const lastPanelElem = document.getElementById(this.lastPanelId);

      if (this.lastPanelId === activePanelId && nextState === false)
        activePanelElem.parentElement.classList.remove("open");
      else if (this.lastPanelId !== activePanelId && nextState === true) {
        lastPanelElem.parentElement.classList.remove("open");
      }

    }

    this.lastPanelId = $event.panelId;
  }

  swapStatus:boolean=false;

  swap(){

    this.swapStatus=true;

    if(this.searchForm.value.source){
      this.swapdestination=  this.searchForm.value.source
    }

    if(this.searchForm.value.destination){
      this.swapsource= this.searchForm.value.destination; 
    }
    
  }

  tabChange(val){
    document.getElementById(val).focus();
    document.getElementById(val).click();
  }


  submitSeat(){
      if (this.seatForm.valid) {
        let Lowerberth=this.seatForm.value.Lowerberth;
        let Upperberth=this.seatForm.value.Upperberth;

        if(Lowerberth.length==0 && Upperberth.length ==0){

          this.notify.notify("Select Seat","Error");
          return;

        }

        this.modalService.dismissAll();

       
       Lowerberth.forEach((item, index) => {
          if (index !== Lowerberth.findIndex(i => i == item) || item == null) 
          {
            
            Lowerberth.splice(index, 1);
          }

      });

      Upperberth.forEach((item, index) => {
        if (index !== Upperberth.findIndex(i => i == item) || item == null ) 
        {
          Upperberth.splice(index, 1);
        }

       });  

     
      //  this.selectedLB.forEach((item, index) => {
      //   if (index !== this.selectedLB.findIndex(i => i == item)) 
      //   {
      //     this.selectedLB.splice(index, 1);
      //   }

      //  });

      //  this.selectedUB.forEach((item, index) => {
      //   if (index !== this.selectedUB.findIndex(i => i == item)) 
      //   {
      //     this.selectedUB.splice(index, 1);
      //   }
      //  });
      
      const bookingdata={
       // LowerBerthSeats:this.selectedLB,
        Lowerberth:Lowerberth,
        //UpperBerthSeats:this.selectedUB,
        Upperberth: Upperberth,
        boardingPoint:this.seatForm.value.boardingPoint,
        busId:this.busId,
        PriceArray:this.PriceArray,
        droppingPoint:this.seatForm.value.droppingPoint
      }

      console.log(bookingdata);

      localStorage.setItem('bookingdata',JSON.stringify(bookingdata));
      localStorage.setItem('busRecord',JSON.stringify(this.buslistRecord));
      this.router.navigate(['booking']);     
    }else{

      if(this.seatForm.value.boardingPoint==null || this.searchForm.value.boardingPoint==''){

        this.notify.notify("Select Boarding Point !","Error");
      }

      else if(this.seatForm.value.droppingPoint==null || this.searchForm.value.droppingPoint==''){
        this.notify.notify("Select Dropping Point !","Error");
      }

      else if(this.seatForm.value.Lowerberth==null || this.searchForm.value.Lowerberth=='' || this.seatForm.value.Upperberth==null || this.searchForm.value.Upperberth==''){
        this.notify.notify("Select Seat !","Error");
      }


    }
  }



  updateLowerberth(e:any){

    //console.log(e.target.value);


    const Lowerberth: FormArray = this.seatForm.get('Lowerberth') as FormArray;  
    if (e.target.checked) {
       if(this.maxSeat!=0 &&  this.checkedIndex < this.maxSeat ){
        this.checkedIndex++;
        Lowerberth.push(new FormControl(e.target.value));
       }else{                
        e.target.checked = false;
       }
      
    } else {
      let i: number = 0;
      Lowerberth.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          this.checkedIndex--; 
          Lowerberth.removeAt(i);
          return;
        }
        i++;
      });
    }

   // console.log(Lowerberth);

    this.getPriceOnSeatSelect();
  }

  
  dualsleeper_warning:any='';
  double_sleeper_restrict: any=[];
  
  getPriceOnSeatSelect(){   
    
    this.dualsleeper_warning='';
   this.double_sleeper_restrict=[];


    const SeatPriceParams={
      seater: this.seatForm.value.Lowerberth,
      sleeper: this.seatForm.value.Upperberth,
      destinationId: this.destination_id,
      sourceId: this.source_id,
      busId: this.busId
    }
       
        let seaterparam=[];
        let sleeperparam=[];

        let lbIds=[];
        let ubIds=[];
        let ubnames=[];
        let lbnames=[];
        
        SeatPriceParams.seater.forEach(e => {
          let ar=e.split('-');
          lbIds.push(ar[0]);          
          lbnames.push(ar[1]);          
        });


        SeatPriceParams.sleeper.forEach(e => {
          let ar=e.split('-');
          ubIds.push(ar[0]);          
          ubnames.push(ar[1]);          
        });

        let genderRestrictSeatarray: any=[];
        


    if(this.seatsLayoutRecord.lower_berth){


      this.selectedLB =this.seatsLayoutRecord.lower_berth.filter((itm) =>{

          if(lbIds.indexOf(itm.id.toString()) > -1){
            //seaterparam +='&seater[]='+itm.id;
            seaterparam.push(itm.id);

            ///////// logic for seat select gender restriction

            let prevGender=null;

             this.seatsLayoutRecord.lower_berth.filter((at) =>{  
              if( itm.colNumber == at.colNumber && 
                  (itm.rowNumber - at.rowNumber == -1 || itm.rowNumber - at.rowNumber == 1)  
                  && at.seatText!='' && itm.seatText !=at.seatText && at.Gender && at.Gender!='' ){                

                if(prevGender!=null){
                  if(prevGender != at.Gender){
                    let indexNum =genderRestrictSeatarray.findIndex((i)=> {
                      return (i.seat_name == itm.id);
                    });

                    genderRestrictSeatarray.splice(indexNum,1);

                    const sst={
                      "seat_name" : itm.id,
                      "canSelect" : 'none'
                    };
                    genderRestrictSeatarray.push(sst);

                  }
                }else{
                  if(at.Gender=='F' || at.Gender=='M'){
                    const sst={
                      "seat_name" : itm.id,
                      "canSelect" : at.Gender
                    };
                    genderRestrictSeatarray.push(sst);
                  }
                }

                prevGender=at.Gender;                

              } 
            });

             
          } 
          return lbIds.indexOf(itm.id.toString()) > -1; 
    
        }).map(itm => itm.seatText);      

    }

   
   
    if(this.seatsLayoutRecord.upper_berth){ 

      this.selectedUB =this.seatsLayoutRecord.upper_berth.filter((t) =>{  
          if(ubIds.indexOf(t.id.toString()) > -1){
            sleeperparam.push(t.id); 
             ///////// logic for seat select gender restriction

             let prevSleepGender=null;
            
            this.seatsLayoutRecord.upper_berth.filter((at) =>{  
              if( t.colNumber == at.colNumber && 
                (t.rowNumber - at.rowNumber == -1 || t.rowNumber - at.rowNumber == 1)  
                && at.seatText!='' && t.seatText !=at.seatText && at.Gender  && at.Gender!='' ){ 

                if(prevSleepGender!=null){

                  if(prevSleepGender != at.Gender){
                    let indexNum =genderRestrictSeatarray.findIndex((i)=> {
                      return (i.seat_name == t.id);
                    });

                    genderRestrictSeatarray.splice(indexNum,1);

                    const sst={
                      "seat_name" : t.id,
                      "canSelect" : 'none'
                    };
                    genderRestrictSeatarray.push(sst);

                  }
                }else{
                  if(at.Gender =='F' || at.Gender =='M'){
                    const sst={
                      "seat_name" : t.id,
                      "canSelect" : at.Gender
                    };
                    genderRestrictSeatarray.push(sst);
                  }
                }


               prevSleepGender=at.Gender;     


              } 
            });


            /////////// logic for double sleeper single booking restrict /////////

           
            this.seatsLayoutRecord.upper_berth.filter((at) =>{  
              if( t.colNumber == at.colNumber && 
                (t.rowNumber - at.rowNumber == -1 || t.rowNumber - at.rowNumber == 1)  
                && at.seatText!='' && t.seatText != at.seatText && at.bus_seats){ 

                  if(ubnames.indexOf(at.seatText) === -1){
                    this.dualsleeper_warning='Please note that ODBUS has the right to cancel single sleeper booking in double sleepers without notice as well the traveler will be bound to share the adjacent sleeper with other passenger. For details contact customer support.';
                     
                  }
                  at['linkedseat']=t;
                  this.double_sleeper_restrict.push(at);                 
              } 
            });

            ////////////////////////////////////////////////////

          }
          return ubIds.indexOf(t.id.toString()) > -1; 
        }).map(t => t.seatText);

    }

   if(this.double_sleeper_restrict){
    this.double_sleeper_restrict.forEach(e => {     
       if (!sleeperparam.includes(e.id)) {
        sleeperparam.push(e.id);
      }

      if (!this.selectedUB.includes(e.seatText)) {
        this.selectedUB.push(e.seatText);
      }

       let otherId = 'upper'+e.id;
        let otherElement = document.getElementById(otherId) as HTMLInputElement;
        otherElement.checked = true;

       const Upperberth: FormArray = this.seatForm.get('Upperberth') as FormArray;
        const newValue = otherElement.value;
        const exists = Upperberth.controls.some(control => control.value === newValue);

        if (!exists) {
          Upperberth.push(new FormControl(newValue));
        }

    });     
   }
    
                   
               

  
    localStorage.setItem('genderRestrictSeats', JSON.stringify(genderRestrictSeatarray));
   
    this.spinner.show();

    if(this.selectedLB.length != 0 || this.selectedUB.length != 0){


      let params={
        "entry_date": this.entdate,
        "sourceId": SeatPriceParams.sourceId,
        "destinationId": SeatPriceParams.destinationId,
        "busId": SeatPriceParams.busId,
        "sleeper": sleeperparam,
        "seater": seaterparam,
        "ReferenceNumber":this.referenceNumber,
        "origin":this.origin
      }

      this.getSeatPriceService.getprice(params).subscribe(
        res=>{ 
          this.PriceArray=res.data[0]; 
          //console.log(this.PriceArray) ;
          this.spinner.hide();

          if(this.checkedIndex==this.maxSeat && this.isMobile==true){
            // this.notify.notify("You have selected maximum no of seats !","Error");
             alert("You have selected maximum no of seats !");
           }

           
        });
     
    }else{

      this.spinner.hide();
      this.PriceArray=[];
    }

    
     
  }
 
  

  updateUpperberth(e:any){  
    
    const Upperberth: FormArray = this.seatForm.get('Upperberth') as FormArray;  
    if (e.target.checked) {
      if(this.maxSeat!=0 && this.checkedIndex < this.maxSeat ){
        this.checkedIndex++;
        Upperberth.push(new FormControl(e.target.value));
       }else{             
        e.target.checked = false;
       }

     //  console.log(Upperberth);
     
    } else {
    console.log(e);
      let vl=e.target.value.split('-');
      let i: number = 0;
      Upperberth.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          this.checkedIndex--; 
          Upperberth.removeAt(i);
          
          if(this.double_sleeper_restrict){            
             this.double_sleeper_restrict.forEach(e => {

              if(e.linkedseat.id == vl[0] && e.linkedseat.seatText == vl[1]){

              const index = this.selectedUB.indexOf(e.seatText);
              if (index !== -1) {
                this.selectedUB.splice(index, 1);
              }
              let otherId = 'upper'+e.id;
                let otherElement = document.getElementById(otherId) as HTMLInputElement;
                otherElement.checked = false;
                const valueToRemove = otherElement.value;

                const idx = Upperberth.controls.findIndex(control => control.value === valueToRemove);

                if (idx !== -1) {
                  Upperberth.removeAt(idx);
                }
              }
            });     

          }
          return;
        }
        i++;
      });
    }

  
    this.getPriceOnSeatSelect();

  }

  
  

///////////////////////////////////////////////////////////
updateBusType(e:any,typ:any) {
  const busType: FormArray = this.filterForm.get('busType') as FormArray;

  if (e.target.checked) {
    busType.push(new FormControl(e.target.value));
  } else {
    let i: number = 0;
    busType.controls.forEach((item: AbstractControl) => {
      if (item.value == e.target.value) {
        busType.removeAt(i);
        return;
      }
      i++;
    });
  }

  this.submitFilterForm(typ);
  
}

nonacFilter:boolean=false;
acFilter:boolean=false;
seaterFilter:boolean=false;
sleeperFilter:boolean=false;

FilterMobile(e: any,type:any,active:any='') {
 

  if(type=='seat_type'){
    const seatType: FormArray = this.filterForm.get('seatType') as FormArray;


    let i: number = 0;

    let match=false;

    seatType.controls.forEach((item: AbstractControl) => {
      if (item.value == e.target.value) {
        seatType.removeAt(i);
        match=true;
        return
      }
      i++;
    }); 

      if(match==false){
        seatType.clear();
        seatType.push(new FormControl(e.target.value));
      }

      if(e.target.value==2){

        if(this.sleeperFilter==false){
          this.sleeperFilter=true;
        }else{
          this.sleeperFilter=false;
        }
       
        this.seaterFilter=false;
  
      }
  
      if(e.target.value==1){

        if(this.seaterFilter==false){
          this.seaterFilter=true;
        }else{
          this.seaterFilter=false;
        }

        this.sleeperFilter=false;
  
      }

  }
  
  if(type=='bus_type'){
    const busType: FormArray = this.filterForm.get('busType') as FormArray;

    let i: number = 0;
    let match=false;
    busType.controls.forEach((item: AbstractControl) => { 

      if (item.value == e.target.value) {
        busType.removeAt(i);
        match=true;
        return
      }
      i++;
    });

    if(match==false){
      busType.clear();
       busType.push(new FormControl(e.target.value));
    }

    if(e.target.value==2){

      if(this.nonacFilter==false){
        this.nonacFilter=true;
      }else{
        this.nonacFilter=false;
      }
      this.acFilter=false;

    }

    if(e.target.value==1){

      if(this.acFilter==false){
        this.acFilter=true;
      }else{
        this.acFilter=false;
      }

      this.nonacFilter=false;

    }


  }

 

  this.submitFilterForm();
  
}
updateSeatType(e:any,typ:any) {
    const seatType: FormArray = this.filterForm.get('seatType') as FormArray;
  
    if (e.target.checked) {
      seatType.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      seatType.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          seatType.removeAt(i);
          return;
        }
        i++;
      });
    }

    this.submitFilterForm(typ);
  }


  updateBoarding(e : any,typ:any){

   // console.log(this.filterForm.value);
    
    const boardingPointId: FormArray = this.filterForm.get('boardingPointId') as FormArray;
  
    if (e.target.checked) {

      let match=false;
      boardingPointId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          match=true;
          return
        }
      });

      if(match==false){
        boardingPointId.push(new FormControl(e.target.value));
      }

      
    } else {
      let i: number = 0;
      boardingPointId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          boardingPointId.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.submitFilterForm(typ);
  }

  updateDropping(e : any,typ:any){    
    const dropingingPointId: FormArray = this.filterForm.get('dropingingPointId') as FormArray;
  
    if (e.target.checked) {

      let match=false;
      dropingingPointId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          match=true;
          return
        }
      });

      if(match==false){
        dropingingPointId.push(new FormControl(e.target.value));
      }

      
    } else {
      let i: number = 0;
      dropingingPointId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          dropingingPointId.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.submitFilterForm(typ);
  }

  updateOperator(e : any,typ:any){    
    const operatorId: FormArray = this.filterForm.get('operatorId') as FormArray;
  
    if (e.target.checked) {
      let match=false;
      operatorId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          match=true;
          return
        }
      });

      if(match==false){
        operatorId.push(new FormControl(e.target.value));
      }

      
    } else {
      let i: number = 0;
      operatorId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          operatorId.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.submitFilterForm(typ);
  }

  updateAmenity(e : any,typ:any){  

    const amenityId: FormArray = this.filterForm.get('amenityId') as FormArray;
  
    if (e.target.checked) {

      let match=false;
      amenityId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          match=true;
          return
        }
      });

      if(match==false){
        amenityId.push(new FormControl(e.target.value));
      }

     
    } else {
      let i: number = 0;
      amenityId.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          amenityId.removeAt(i);
          return;
        }
        i++;
      });
    }

    this.submitFilterForm(typ);

  }

  updatePrice(e: any,typ:any){

    
    let price = this.filterForm.get('price') as FormControl;

    if (e.target.checked) {
      price.patchValue(e.target.value);
      
    }else{
      price.patchValue(0);
    }

    this.submitFilterForm(typ);

  }

  resetFilterForm(){
    this.filterForm = this.fb.group({
      price: [0], 
      busType: this.fb.array([]),
      seatType: this.fb.array([]),
      boardingPointId: this.fb.array([]),
      dropingingPointId: this.fb.array([]),
      operatorId: this.fb.array([]),
      amenityId: this.fb.array([]),
    });

    this.submitFilterForm();
  }

  getCheckedStatus(id,typ){

    if(typ=='boarding'){

        let val= this.filterForm.value.boardingPointId.indexOf(id.toString());

        if(val<0){
          return false;
        }else{
          return true;
        }
     
     }

     if(typ=='droping'){

      let val= this.filterForm.value.dropingingPointId.indexOf(id.toString());

      if(val<0){
        return false;
      }else{
        return true;
      }   
   }

   if(typ=='operator'){

    let val= this.filterForm.value.operatorId.indexOf(id.toString());

    if(val<0){
      return false;
    }else{
      return true;
    }   
 }

 if(typ=='amenity'){

  let val= this.filterForm.value.amenityId.indexOf(id.toString());

  if(val<0){
    return false;
  }else{
    return true;
  }   
}



  }
  

  submitFilterForm(typ:any=null) {

    if(typ=='desktop' || typ==null){
 
      this.spinner.show();

    }
    

    this.seatsLayoutRecord.visibility =false;
    this.checkedIndex=0;
    this.seatlayoutShow='';
    this.safetyshow='';
    this.busPhotoshow='';
    this.reviewShow='';
    this.policyShow='';

    
     let et= this.entdate;

    // let filterparam ='price='+this.filterForm.value.price+'&sourceID='+this.source_id+
    // '&destinationID='+this.destination_id+
    // '&entry_date='+et;


  let filterparam ={
      "price":this.filterForm.value.price,
      "sourceID":this.source_id,
      "destinationID":this.destination_id,
      "user_id":GlobalConstants.USER_ID,
      "entry_date":et
  }

   if(this.filterForm.value.busType.length>0){

    // this.filterForm.value.busType.forEach((e: any) => {

    //   filterparam +='&busType[]='+e;   
    // });

    filterparam["busType"]=this.filterForm.value.busType;

   }

   if(this.filterForm.value.seatType.length>0){

    // this.filterForm.value.seatType.forEach((e: any) => {

    //   filterparam +='&seatType[]='+e;   
    // });

    filterparam["seatType"]=this.filterForm.value.seatType;

   }
  
   if(this.filterForm.value.boardingPointId.length>0){

    // this.filterForm.value.boardingPointId.forEach((e: any) => {

    //   filterparam +='&boardingPointId[]='+e;   
    // });

    filterparam["boardingPointId"]=this.filterForm.value.boardingPointId;

   }

   if(this.filterForm.value.dropingingPointId.length>0){

    // this.filterForm.value.dropingingPointId.forEach((e: any) => {

    //   filterparam +='&dropingingPointId[]='+e;   
    // });

    filterparam["dropingingPointId"]=this.filterForm.value.dropingingPointId;

   }

   if(this.filterForm.value.operatorId.length>0){

    // this.filterForm.value.operatorId.forEach((e: any) => {

    //   filterparam +='&operatorId[]='+e;   
    // });

    filterparam["operatorId"]=this.filterForm.value.operatorId;

   }

   if(this.filterForm.value.amenityId.length>0){

    // this.filterForm.value.amenityId.forEach((e: any) => {

    //   filterparam +='&amenityId[]='+e;   
    // });

    filterparam["amenityId"]=this.filterForm.value.amenityId;

   } 
     
   this.submitFilter(filterparam);

 }


 submitFilter(filterparam:any){

  //console.log(filterparam);

  this.filterService.getlist(filterparam).subscribe(
    res=>{

     // console.log(res);

      if(res.data){

        this.buslist = res.data;

        if(this.commonData.common.bus_list_sequence ==1){

          this.columnName="startingFromPrice";
          this.isAscendingSort='desc';
          this.arrowStatus='up';  
        }
  
        if(this.commonData.common.bus_list_sequence ==2){  
          this.columnName="departureTime";
          this.isAscendingSort='desc';
          this.arrowStatus='up';  
        }
  
        if(this.commonData.common.bus_list_sequence ==3){
            this.columnName="totalSeats"; 
            this.isAscendingSort='asc';
            this.arrowStatus='down';            
        }

        if(this.filterForm.value.price==1){

          this.columnName="startingFromPrice";
          this.isAscendingSort='asc';
          this.arrowStatus='down';  
        }

        if(this.filterForm.value.price==0){

          this.columnName="startingFromPrice";
          this.isAscendingSort='desc';
          this.arrowStatus='up';  
        }

       
        this.totalfound = res.data.length;

      }else{
        this.totalfound =0;
      }

      
       this.spinner.hide();
    });

 }

 moreFilter(moreFilter:any){

  this.modalService.open(moreFilter, { windowClass: 'mobile-modalbox' });

 }

 closeFilter(){

  this.filterForm.reset();
  
   this.modalService.dismissAll();
 }

  submitForm() {  

    this.seatsLayoutRecord.visibility =false;
    this.seatlayoutShow='';
    this.safetyshow='';
    this.busPhotoshow='';
    this.reviewShow='';
    this.policyShow='';
    this.checkedIndex=0;

    this.buslist=[];
    
    if (this.searchForm.valid) {

      if(!this.searchForm.value.source.name){
        this.notify.notify("Select Valid Source !","Error");  
        
        return false;
      }

      if(!this.searchForm.value.destination.name){
        this.notify.notify("Select Valid Destination !","Error"); 
        
        return false;
      }

      let dt = this.searchForm.value.entry_date;
      if(dt.month < 10){
        dt.month = "0"+dt.month;
      }
      if(dt.day < 10){
        dt.day = "0"+dt.day;
      }
      this.searchForm.value.entry_date= [dt.day,dt.month,dt.year].join("-");
    
      this.sourceData = this.searchForm.value.source;
      this.destinationData = this.searchForm.value.destination;
      this.entdate = this.searchForm.value.entry_date;     
      
      this.source_id=this.sourceData.id;
      this.destination_id=this.destinationData.id;

      let sr=this.searchForm.value.source.url;
      let ds=this.searchForm.value.destination.url;
     let date=this.searchForm.value.entry_date;
      

      window.location.href = GlobalConstants.URL+sr+'-'+ds+'-bus-services?date='+date;
     
      // this.locationService.setSource(this.sourceData);
      // this.locationService.setDestination(this.destinationData);
      // this.locationService.setDate(this.searchForm.value.entry_date);

      // this.isShown = false ; 
      // this.showformattedDate(this.searchForm.value.entry_date);

      // this.setPrevNextDate(this.entdate);
      // this.setPrevNextDate(this.entdate);

      // this.getbuslist();


    }
    else{

      if(this.searchForm.value.source==null || this.searchForm.value.source==''){

        this.notify.notify("Select Source !","Error");
     }

     else if(this.searchForm.value.destination==null || this.searchForm.value.destination==""){
      this.notify.notify("Select Destination !","Error");
     }

     else if(this.searchForm.value.entry_date==null || this.searchForm.value.entry_date==""){
      this.notify.notify("Select Journey Date !","Error");
     }
   }
  }

  coupon_detail(i,modal){

    this.couponDetail=[];
    this.couponDetail= this.buslist[i]['couponDetails'];
    //console.log(this.couponDetail);
    this.modalService.open(modal);

  }

  sort(coulmn:any){

     let order='';

    this.columnName=coulmn;


    if(this.isAscendingSort=='desc'){
      this.isAscendingSort='asc';
      order='asc';
      this.arrowStatus='up';
    }

    else if(this.isAscendingSort=='asc'){
      this.isAscendingSort='desc';
      order='desc';
      this.arrowStatus='down';
    }

    //console.log(this.isAscendingSort,coulmn,order,this.arrowStatus)

          
     if(coulmn=='totalSeats'){ 

        this.buslist = _.orderBy(this.buslist, (item:any) => item.totalSeats, [order]);

      }else if(coulmn=='departureTime'){

        this.buslist = _.orderBy(this.buslist, (item:any) => item.departureTime, [order]);

      }else if(coulmn=='startingFromPrice'){

        this.buslist = _.orderBy(this.buslist, (item:any) => item.startingFromPrice, [order]);

      }

      else if(coulmn=='totalJourneyTime'){

        this.buslist = _.orderBy(this.buslist, (item:any) => item.totalJourneyTime, [order]);

      }

      else if(coulmn=='arrivalTime'){

        this.buslist = _.orderBy(this.buslist, (item:any) => item.arrivalTime, [order]);

      }


      else if(coulmn=='busName'){

        this.buslist = _.orderBy(this.buslist, (item:any) => item.busName, [order]);

      }

      

  }

   bussearching:boolean=false;


  getbuslist() {

    this.busIds=[];
    this.bussearching=true;
    this.spinner.show();
    this.nonacFilter=false;
    this.acFilter=false;
    this.seaterFilter=false;
    this.sleeperFilter=false;
    
    this.listingService.getlist(this.sourceData.name,this.destinationData.name,this.entdate).subscribe(
      res=>{

         this.bussearching=false;

        localStorage.setItem('source', this.sourceData.name);
        localStorage.setItem('source_id', this.sourceData.id);
        localStorage.setItem('destination', this.destinationData.name);
        localStorage.setItem('destination_id', this.destinationData.id);
        localStorage.setItem('entdate', this.entdate); 


              
        if(res.data){

            this.buslist = res.data; 
            //console.log(this.commonData);

            if(this.commonData.common.bus_list_sequence ==1){

              this.columnName="startingFromPrice";
              this.isAscendingSort='asc';
              this.arrowStatus='up';

      
            }
      
            if(this.commonData.common.bus_list_sequence ==2){
      
              this.columnName="departureTime";
              this.isAscendingSort='asc';
              this.arrowStatus='up';

      
            }
      
            if(this.commonData.common.bus_list_sequence ==3){
                this.columnName="totalSeats"; 
                this.isAscendingSort='desc';
                this.arrowStatus='down';

            }
              
           this.totalfound = res.data.length;         

        }

        else{

          this.totalfound =0;

        }
        if(this.totalfound>0){

          this.buslist.forEach((a) => {  
            this.busIds.push(a.busId);
          }); 


          
          ///////// get filter options after getting bus list          
          this.filteroptions();

        }

        this.swapdestination=this.destinationData ;
        this.swapsource=this.sourceData ;

        this.spinner.hide();

        this.modalService.dismissAll();
        
      }
      );
  }  

  getseatlayout(){
    let bus_id=this.busId;

    //console.log(this.referenceNumber,this.origin);

    let params={
      "entry_date":this.entdate,
      "busId":bus_id,
      "sourceId":this.source_id,
      "destinationId":this.destination_id,
      "ReferenceNumber":this.referenceNumber,
      "origin":this.origin,
    };

    //console.log(params);


    //this.entdate,bus_id,this.source_id,this.destination_id,this.referenceNumber,this.origin
    this.seatLoader=true;
      this.seatLayoutService.getSeats(params).subscribe(
        res=>{ 
          
          console.log(res);
         
          this.seatsLayouts[bus_id]= res.data;   
          this.seatsLayoutRecord= res.data;
          this.seatsLayoutRecord.visibility = true;
          this.createberth();   
          
          //console.log(this.seatsLayoutRecord); 

        },
        error => {

          //console.log(error);

    
          this.spinner.hide();
          this.notify.notify(error.error.message,"Error");
         
        }); 
  }

  blankSeatcount:any=0;
  MobileblankSeatcount:any=0;

  createberth(){

    this.UpperberthMobileArr=[];
    this.LowerberthMobileArr=[];

    if(this.seatsLayoutRecord.upper_berth){

      let upper_berth = this.seatsLayoutRecord.upper_berth;
      let row = this.seatsLayoutRecord.upperBerth_totalRows;
      let col = this.seatsLayoutRecord.upperBerth_totalColumns;


      if(upper_berth.length){      
        
        
        if(this.origin=='MANTIS'){

          for(let k=col; k >=0;k--){
            this.colarr=[];   
            for(let i=0; i<row ;i++){
              upper_berth.forEach((a) => {  
                if(a.rowNumber== i && a.colNumber== k){
                  this.colarr.push(a);                 
                }
              });               
            }
          
  
            this.UpperberthArr[k]=this.colarr;      
          } 

            
        }else{

          for(let i=0; i < row;i++){  
            this.colarr=[];         
            for(let k=0; k < col;k++){
              upper_berth.forEach((a) => {  
                if(a.rowNumber== i && a.colNumber== k){
                  this.colarr.push(a);
                }
              });               
            }
            this.UpperberthArr[i]=this.colarr;     
          }
        }

          //console.log(this.UpperberthArr);

          if(this.origin=='MANTIS'){

            for(let i=0; i < row;i++){  
              this.mobilecolarr=[];         
              for(let k=0; k < col;k++){
                upper_berth.forEach((a) => {  
                  if(a.rowNumber== i && a.colNumber== k){
                    this.mobilecolarr.push(a);
                  }
                });               
              }
              this.UpperberthMobileArr[i]=this.mobilecolarr;     
            }


          }else{

            for(let k=0; k < col;k++){
              this.mobilecolarr=[]; 
              for(let i=row; i >=0 ;i--){
                upper_berth.forEach((a) => {  
                  if(a.rowNumber== i && a.colNumber== k){
                    this.mobilecolarr.push(a);
                  }
                });               
              }
              this.UpperberthMobileArr[k]=this.mobilecolarr;     
            }

          }

     }

    }

    if(this.seatsLayoutRecord.lower_berth){

     

    let row2 = this.seatsLayoutRecord.lowerBerth_totalRows;
    let col2 = this.seatsLayoutRecord.lowerBerth_totalColumns;
    let lower_berth = this.seatsLayoutRecord.lower_berth; 

      if(lower_berth.length){
        //////// for web view

        if(this.origin=='MANTIS'){

          for(let k=col2; k >=0;k--){
            this.colarr=[]; 
  
            let mflag=false;
  
            for(let i=0; i<row2 ;i++){
              lower_berth.forEach((a) => {  
                if(a.rowNumber== i && a.colNumber== k){
                  this.colarr.push(a);
                  if(a.berthType==1 && a.seat_class_id==2){
                    mflag=true;
                  }
                }
              });               
            }
  
            if(mflag){
              this.blankSeatcount++;
            }
  
            this.LowerberthArr[k]=this.colarr;      
          } 

            
        }else{

          for(let i=0; i < row2;i++){  
            this.colarr=[]; 
            
            let flag=false;
            for(let k=0; k < col2;k++){
              lower_berth.forEach((a) => {
                if(a.rowNumber== i && a.colNumber== k){                
                  this.colarr.push(a);
                  if(a.berthType==1 && a.seat_class_id==2){
                    flag=true;
                  }
                }
              });               
            }
  
            if(flag){
              this.blankSeatcount++;
            }          
            this.LowerberthArr[i]=this.colarr;      
          } 

        }
        


        

        //////// for mobile view

        if(this.origin=='MANTIS'){

          for(let i=0; i < row2;i++){  
            this.mobilecolarr=[]; 
            
            let flag=false;
            for(let k=0; k < col2;k++){
              lower_berth.forEach((a) => {
                if(a.rowNumber== i && a.colNumber== k){                
                  this.mobilecolarr.push(a);
                  if(a.berthType==1 && a.seat_class_id==2){
                    flag=true;
                  }
                }
              });               
            }
  
            if(flag){
              this.blankSeatcount++;
            }          
            this.LowerberthMobileArr[i]=this.mobilecolarr;      
          } 

        }
        else{

       

        for(let k=0; k < col2;k++){
          this.mobilecolarr=[]; 

          let mflag=false;

          for(let i=row2; i >=0 ;i--){
            lower_berth.forEach((a) => {  
              if(a.rowNumber== i && a.colNumber== k){
                this.mobilecolarr.push(a);
                if(a.berthType==1 && a.seat_class_id==2){
                  mflag=true;
                }
              }
            });               
          }

          if(mflag){
            this.MobileblankSeatcount++;
          }

          this.LowerberthMobileArr[k]=this.mobilecolarr;      
        } 
      }

    }
  }

  this.seatLoader=false;

  }

  lower_tab:any='active';
  upper_tab:any='';

  displayBerth(type:any){

    if(type=='lower'){

      this.lower_tab='active';
      this.upper_tab='';

      document.getElementById('SeatLayout').style.display='block';
      document.getElementById('upperBerth').style.display='none';
      document.getElementById('lowerBerth').style.display='block';
      document.getElementById('Board').style.display='none';
      document.getElementById('Drop').style.display='none';

      

    }

    if(type=='upper'){

      document.getElementById('SeatLayout').style.display='block';
      document.getElementById('upperBerth').style.display='block';
      document.getElementById('lowerBerth').style.display='none';
      document.getElementById('Board').style.display='none';
      document.getElementById('Drop').style.display='none';


      this.lower_tab='';
      this.upper_tab='active';
      
    }

  }

  Continue(type:any){
    if(type=='board'){

      document.getElementById('SeatLayout').style.display='none';
      document.getElementById('Board').style.display='block';
      document.getElementById('Drop').style.display='none';

    }
     

    if(type=='drop'){
      document.getElementById('SeatLayout').style.display='none';
      document.getElementById('Board').style.display='none';
      document.getElementById('Drop').style.display='block';
    }
  }

  backTo(type:any){

    if(type=='seat'){

      document.getElementById('SeatLayout').style.display='block';
      document.getElementById('Board').style.display='none';
      document.getElementById('Drop').style.display='none';

    }
     

    if(type=='board'){
      document.getElementById('SeatLayout').style.display='none';
      document.getElementById('Board').style.display='block';
      document.getElementById('Drop').style.display='none';
    }

  }


  getBoardingDroppingPoints(){

    let bus_id=this.busId;

    let bdparam={
      "busId":this.busId,
      "sourceId":this.source_id,
      "destinationId":this.destination_id,
      "journey_date":this.entdate,
      "origin":this.origin,
      "ReferenceNumber":this.referenceNumber
    };

    this.boardingDropingPointService.getdata(bdparam).subscribe(
      res=>{

       this.boardingPointArr=res.data[0].boardingPoints;
       this.droppingPointArr=res.data[0].droppingPoints;

      

       this.boardingPointArr.map((i:any) => { i.boardTime = i.boardingPoints + ' | ' + i.boardingTimes; return i; });
       this.droppingPointArr.map((i:any) => { i.dropTime = i.droppingPoints + ' | ' + i.droppingTimes; return i; });

      //  this.selectedBoard= this.boardingPointArr[0].boardTime;
      //  this.selectedDrop= this.droppingPointArr[0].dropTime;

       this.seatForm.controls['boardingPoint'].setValue(this.boardingPointArr[0]); 
       this.seatForm.controls['droppingPoint'].setValue(this.droppingPointArr[0]); 

       this.spinner.hide();
      }); 
    
  }

  ShowLayout(id :any) {  
    
    
    this.LowerberthArr=[];
    this.UpperberthArr=[];

    
    this.seatForm = this.fb.group({
      boardingPoint: [null, Validators.compose([Validators.required])],
      droppingPoint: [null, Validators.compose([Validators.required])],
      Lowerberth:this.fb.array([]),   
      Upperberth:this.fb.array([])   
    }); 
    
    this.buslistRecord =this.buslist[id];
    this.maxSeat=this.buslistRecord.maxSeatBook;
    
    let currentBusId=this.buslist[id].busId;

    this.currentSeatlayoutIndex=true;
   
    let showbtn = document.getElementById('showbtn'+id).innerHTML;

    this.checkSeatHTML(id);    

    this.safetyshow='';
    this.busPhotoshow='';
    this.reviewShow='';
    this.policyShow='';
    this.amenityShow='';
    this.checkedIndex=0;
    this.blankSeatcount=0;
    this.MobileblankSeatcount=0;

    if(this.seatsLayoutRecord.visibility== true){
       if(currentBusId!=this.busId){

        this.buslist.forEach((item, index) => { 
          
          if(id!=index){
            if(document.getElementById('showbtn'+index) != null){
              document.getElementById('showbtn'+index).innerHTML = 'View Seat';
            }
            
          }          
        }); 

        this.seatsLayoutRecord.visibility =true;
        this.seatlayoutShow=id;
       }
       else if(currentBusId==this.busId && showbtn == 'View Seat'){
        this.seatsLayoutRecord.visibility =true;
        this.seatlayoutShow=id;
       }
       else if(currentBusId==this.busId && showbtn == 'Hide Seat'){
        this.seatsLayoutRecord.visibility =false;
        this.seatlayoutShow='';
       }

    }else if(this.seatsLayoutRecord.visibility == false){
      this.seatsLayoutRecord.visibility =true;
      this.seatlayoutShow=id;
    }

    this.busId=this.buslistRecord.busId;
    this.referenceNumber=this.buslistRecord.ReferenceNumber;
    this.origin=this.buslistRecord.origin;
    this.LowerberthArr=[];
    this.UpperberthArr=[];
    this.LowerberthMobileArr=[];
    this.UpperberthMobileArr=[];
    this.PriceArray=[];
    this.droppingPointArr=[];
    this.boardingPointArr=[];
    this.selectedLB=[];
    this.selectedUB=[];
    this.selectedBoard= '';
    this.selectedDrop= '';

    if(currentBusId == this.busId){
    }else{

      this.seatForm = this.fb.group({
        boardingPoint: [null, Validators.compose([Validators.required])],
        droppingPoint: [null, Validators.compose([Validators.required])],
        Lowerberth:this.fb.array([]),   
        Upperberth:this.fb.array([])   
      });
      
    }

    this.getseatlayout();
    this.getBoardingDroppingPoints();
    
  }

  showAllAmenity(id:any){

    this.currentSeatlayoutIndex=false;


    this.seatsLayoutRecord.visibility =false;
    this.checkedIndex=0;
    this.seatlayoutShow='';
    this.safetyshow='';
    this.busPhotoshow='';
    this.reviewShow='';
    this.policyShow='';
    this.amenityShow=id;


   this.checkSeatHTML(id);


  }

  closeTab(id:any){
    this.seatsLayoutRecord.visibility =false;
    this.checkedIndex=0;
    this.seatlayoutShow='';
    this.safetyshow='';
    this.busPhotoshow='';
    this.reviewShow='';
    this.policyShow='';
    this.amenityShow='';
     this.checkSeatHTML(id);

  }

  checkSeatHTML(id:any){  

    if(this.currentSeatlayoutIndex==true){

      let showbtn = document.getElementById('showbtn'+id).innerHTML;

      if(showbtn == 'View Seat'){
        document.getElementById('showbtn'+id).innerHTML = 'Hide Seat';
      }
      if(showbtn =='Hide Seat'){
        document.getElementById('showbtn'+id).innerHTML = 'View Seat';
      }

    }else{
        for (var i = 0; i < this.totalfound; i++) {

          if(document.getElementById('showbtn'+i) != null){
            document.getElementById('showbtn'+i).innerHTML = 'View Seat';   
          }
                  
        }

    
    }
   
  }
 
  safety(id:any){
    this.currentSeatlayoutIndex=false;
    this.seatsLayoutRecord.visibility =false;
    this.checkedIndex=0;
    this.seatlayoutShow='';
    this.safetyshow=id;
    this.busPhotoshow='';
    this.reviewShow='';
    this.policyShow='';
    this.amenityShow='';
    this.checkSeatHTML(id);

  }

  bus_pic(id:any){

    this.currentSeatlayoutIndex=false;

    this._albums=[];

    this.seatsLayoutRecord.visibility =false;
    this.checkedIndex=0;
    this.seatlayoutShow='';
    this.safetyshow='';

    this.busPhotoshow=id;

    let busRecord= this.buslist[id];

    if(busRecord.busPhotos.length>0){

      busRecord.busPhotos.forEach((sf) => {

        if(sf.bus_image_1 !='' && sf.bus_image_1 != null ){

          const src = sf.bus_image_1;
          const caption = '';
          const thumb = sf.bus_image_1;
          const album = {
             src: src,
             caption: caption,
             thumb: thumb
          };   
          this._albums.push(album);

        }

        if(sf.bus_image_2 !='' && sf.bus_image_2 != null ){

          const src = sf.bus_image_2;
          const caption = '';
          const thumb = sf.bus_image_2;
          const album = {
             src: src,
             caption: caption,
             thumb: thumb
          };   
          this._albums.push(album);

        }

        if(sf.bus_image_3 !='' && sf.bus_image_3 != null ){

          const src = sf.bus_image_3;
          const caption = '';
          const thumb = sf.bus_image_3;
          const album = {
             src: src,
             caption: caption,
             thumb: thumb
          };   
          this._albums.push(album);

        }

        if(sf.bus_image_4 !='' && sf.bus_image_4 != null ){

          const src = sf.bus_image_4;
          const caption = '';
          const thumb = sf.bus_image_4;
          const album = {
             src: src,
             caption: caption,
             thumb: thumb
          };   
          this._albums.push(album);

        }

        if(sf.bus_image_5 !='' && sf.bus_image_5 != null ){

          const src = sf.bus_image_5;
          const caption = '';
          const thumb = sf.bus_image_5;
          const album = {
             src: src,
             caption: caption,
             thumb: thumb
          };   
          this._albums.push(album);

        }
       

      });

    } 

    this.reviewShow='';
    this.amenityShow='';
    this.policyShow='';

    this.checkSeatHTML(id);

  }

  reviews(id:any){

    this.currentSeatlayoutIndex=false;

    this.seatsLayoutRecord.visibility =false;
    this.checkedIndex=0;
    this.seatlayoutShow='';
    this.safetyshow='';
    this.busPhotoshow='';
    this.reviewShow=id;
    this.amenityShow='';
    this.policyShow='';

    this.checkSeatHTML(id);

  }


  booking_policy(id:any){

    this.currentSeatlayoutIndex=false;

    this.seatsLayoutRecord.visibility =false;
    this.checkedIndex=0;
    this.seatlayoutShow='';
    this.safetyshow='';
    this.busPhotoshow='';
    this.reviewShow='';
    this.amenityShow='';
    this.policyShow=id;

    this.checkSeatHTML(id);
  }

  getImagePath(icon :any){  
     let objectURL = 'data:image/*;base64,'+icon  ;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
  }

  getProfileImagePath(icon :any){  
   return this.sanitizer.bypassSecurityTrustResourceUrl(icon);
 }

  getContent(c:any){    
      return c;
  }

  filteroptions(){
    let param={
      "sourceID":this.source_id,
      "destinationID":this.destination_id,
      "busIDs":this.busIds,
      "entry_date":this.entdate
    };


    this.filterOptionsService.getoptions(param).subscribe(
      res=>{
       // console.log(res); 
        if(res.data.length>0){

          this.busTypes = res.data[0].busTypes; 
          this.seatTypes = res.data[0].seatTypes;
          this.boardingPoints = res.data[0].boardingPoints;  
  
          this.droppingPoints = res.data[0].dropingPoints;
  
          this.busOperators = res.data[0].busOperator; 
          this.amenities = res.data[0].amenities;

        }
       

      });      

  }

  toggleShow() {

    this.isShown = ! this.isShown;   
  }

  formattedDate(entdate){
      let dt = entdate.split("-");
     
     return dt[2]+'-'+dt[1]+'-'+dt[0];
  }
  

  showformattedDate(date:any){
    if(date){
      let dt = date.split("-");
      let dd=new Date(dt[2]+'-'+dt[1]+'-'+dt[0]);

      this.journey_date=dt[2]+'-'+dt[1]+'-'+dt[0];

      this.jrnyDt = {
        year: dd.getFullYear(),
        month: dd.getMonth()+1,
        day: dd.getDate()
      }


    }
  }

  search_prev(){

    this.currentSeatlayoutIndex =false;
    this.seatsLayoutRecord.visibility =false;
    this.seatlayoutShow='';
    this.safetyshow='';
    this.busPhotoshow='';
    this.reviewShow='';
    this.policyShow='';
    this.checkedIndex=0;

    this.buslist=[];

    this.entdate = this.prevDate; 
    this.getbuslist();
    this.isShown = false ; 
    this.setPrevNextDate(this.entdate);
    this.showformattedDate(this.entdate);

  }

  search_next(){
    this.currentSeatlayoutIndex =false;
    this.seatsLayoutRecord.visibility =false;
    this.seatlayoutShow='';
    this.safetyshow='';
    this.busPhotoshow='';
    this.reviewShow='';
    this.policyShow='';
    this.checkedIndex=0;

    this.buslist=[];
    
    this.entdate = this.nextDate; 
    this.getbuslist();
    this.isShown = false ; 
    this.setPrevNextDate(this.entdate);
    this.showformattedDate(this.entdate);


  }

  seoSource:any='';
  seoDestination:any='';
  pageContent:any='';

  getLocation(url:any){
    this.location_list.forEach(e => {

      if(e.url==url){
        return e;
      }
      
    });

  }

  ngOnInit() :void{ 

    this.locationService.currentsource.subscribe((s:any) => { this.sourceData = s});
    this.locationService.currentdestination.subscribe((d:any) => { this.destinationData = d });
    this.locationService.currententdate.subscribe(dat => { this.entdate = dat});    

         this.seo.seoList().subscribe(
        resp => {
          if(resp.status==1)
          {
          if(resp.data.length>0){
            resp.data.forEach(e => {
              if( e.page_url == this.currentUrl ){
                this.pageContent = e.url_description;                
              }              
            });
          }
        }
        });

       

        if(this.currentUrl != 'listing'){        

          if(this.currentUrl.includes('bus-services')){

           let ddd= this.currentUrl.split('?');

            let urlstr=ddd[0].replace('-bus-services', '');

            if (this.route.snapshot.queryParams['date']) {
              this.entdate= this.route.snapshot.queryParams['date'];
             // this.entdate= formatDate(new Date(this.entdate),'dd-MM-yyyy','en_US');
            }
            else{
              this.entdate= formatDate(new Date(),'dd-MM-yyyy','en_US');  
            }

            //console.log(ddd);
            //console.log(urlstr);

           let l_ar= urlstr.split('-');

           let source_data ={};
           let dest_data ={};

           this.locationService.all().subscribe(
            res=>{
        
              if(res.status==1)
              { 
                res.data.forEach(e => {
                  if(l_ar[0]==e.url){
                   // console.log(l_ar[0]+"=="+e.url);
                    source_data ={
                      "id":e.id,
                      "name":e.name,
                      "url":e.url,
                    }
                  }

                  if(l_ar[1]==e.url){

                    dest_data ={
                      "id":e.id,
                      "name":e.name,
                      "url":e.url,
                    }
                  }
                  
                });

                this.sourceData=  this.swapsource = source_data; 
                this.destinationData= this.swapdestination = dest_data; 
               
                this.source_id=this.sourceData.id;
                this.destination_id=this.destinationData.id;
          
                localStorage.setItem('source', this.sourceData.name);
                localStorage.setItem('destination', this.destinationData.name);
                localStorage.setItem('source_id', this.sourceData.id);
                localStorage.setItem('destination_id', this.destinationData.id);
                localStorage.setItem('entdate', this.entdate); 
          
                this.showformattedDate(this.entdate);
               
    
                const data={
                  user_id:GlobalConstants.MASTER_SETTING_USER_ID
                };
    
                this.Common.getCommonData(data).subscribe(
                  resp => {
    
                    this.commonData=resp.data;
          
                      const current = new Date();
                      this.dtconfig.minDate = { year: current.getFullYear(), month: 
                      current.getMonth() + 1, day: current.getDate() };
          
                      let maxDate = current.setDate(current.getDate() + resp.data.common.advance_days_show); 
            
                      const max = new Date(maxDate);
                      this.dtconfig.maxDate = { year: max.getFullYear(), month: 
                        max.getMonth() + 1, day: max.getDate() };
        
                     this.maxAllowedDate = this.maxAllowedDate.setDate(this.maxAllowedDate.getDate() + resp.data.common.advance_days_show); 
                     this.maxAllowedDate = formatDate(this.maxAllowedDate,'dd-MM-yyyy','en_US'); 
        
                     this.setPrevNextDate(this.entdate);
                    
                  });
    
                  this.getbuslist();

              }
            });


          }else{
            this.router.navigate(['/404']);
          }      

    }else{


      if(this.sourceData==null  || this.destinationData==null || this.entdate=='' || this.entdate==null ){ 
      
        this.router.navigate(['/']);
      }else{ 
      
  
        this.swapsource=this.sourceData;
        this.swapdestination=this.destinationData;
  
        this.source_id=this.sourceData.id;
        this.destination_id=this.destinationData.id;
  
        localStorage.setItem('source', this.sourceData.name);
        localStorage.setItem('destination', this.destinationData.name);
        localStorage.setItem('source_id', this.sourceData.id);
        localStorage.setItem('destination_id', this.destinationData.id);
        localStorage.setItem('entdate', this.entdate); 
  
        this.showformattedDate(this.entdate);
        

        const data={
          user_id:GlobalConstants.MASTER_SETTING_USER_ID
        };
  
        this.Common.getCommonData(data).subscribe(
          resp => {

            this.commonData=resp.data;
  
              const current = new Date();
              this.dtconfig.minDate = { year: current.getFullYear(), month: 
              current.getMonth() + 1, day: current.getDate() };
  
              let maxDate = current.setDate(current.getDate() + resp.data.common.advance_days_show); 
    
              const max = new Date(maxDate);
              this.dtconfig.maxDate = { year: max.getFullYear(), month: 
                max.getMonth() + 1, day: max.getDate() };
  
             this.maxAllowedDate = this.maxAllowedDate.setDate(this.maxAllowedDate.getDate() + resp.data.common.advance_days_show); 
             this.maxAllowedDate = formatDate(this.maxAllowedDate,'dd-MM-yyyy','en_US'); 

             this.setPrevNextDate(this.entdate);
            
        });

          this.getbuslist();
  
      }



    }


       
    


    this.Common.getPathUrls().subscribe( res=>{          
      if(res.status==1){  
        this.url_path=res.data[0];        
      }    
    });

    
    

  
  }

 

  
  view_seatlayout(seat_layout:any,i:any,display:any,totalSeat:any){

    this.LowerberthMobileArr=[];
    this.UpperberthMobileArr=[];
  
    

    if(display=='hide' || totalSeat==0){

      return;

    }

    this.lower_tab='active';
    this.upper_tab='';

    this.PriceArray=[];
    this.droppingPointArr=[];
    this.boardingPointArr=[];
    this.selectedLB=[];
    this.selectedUB=[];
    this.blankSeatcount=0;
    this.MobileblankSeatcount=0;


     this.spinner.show();

    this.seatForm = this.fb.group({
      boardingPoint: [null, Validators.compose([Validators.required])],
      droppingPoint: [null, Validators.compose([Validators.required])],
      Lowerberth:this.fb.array([]),   
      Upperberth:this.fb.array([])   
    }); 
    
    this.buslistRecord =this.buslist[i];

    this.maxSeat=this.buslistRecord.maxSeatBook;
    this.checkedIndex=0;
    this.busId=this.buslist[i].busId;

    this.referenceNumber=this.buslistRecord.ReferenceNumber;
    this.origin=this.buslistRecord.origin;


    this.getseatlayout();
    this.getBoardingDroppingPoints();

    this.modalService.open(seat_layout, { windowClass: 'mobile-modalbox' });

    



  }

  modify_search(modify:any){
    this.modalService.open(modify, { windowClass: 'mobile-modalbox' });
  }



  viewamenity(viewamenity:any){
    this.modalService.open(viewamenity, { windowClass: 'mobile-modalbox' });
  }

  viewsafety(viewsafety:any){
    this.modalService.open(viewsafety, { windowClass: 'mobile-modalbox' });
  }


  viewphotos(viewphotos:any){
    this.modalService.open(viewphotos, { windowClass: 'mobile-modalbox' });
  }


  viewreview(viewreview:any){
    this.modalService.open(viewreview, { windowClass: 'mobile-modalbox' });
  }
 
 
 
  viewpolicy (viewpolicy :any){
    this.modalService.open(viewpolicy , { windowClass: 'mobile-modalbox' });
  }

  

  setPrevNextDate(entDate:any){  
    
    
    
    let dt = entDate.split("-");
    let dd=dt[2]+'-'+dt[1]+'-'+dt[0];
    let entdate = dd;

    let currentDate = formatDate(new Date(),'yyyy-MM-dd','en_US');
    let entrdate = formatDate(new Date(entdate),'yyyy-MM-dd','en_US');

      let fentdate = new Date(entdate);

      if(this.maxAllowedDate == entDate){
        this.nextDate = ''; 
        this.prevDate = fentdate.setDate(fentdate.getDate() - 1); 
        this.prevDate = formatDate(this.prevDate,'dd-MM-yyyy','en_US');
      }


      else if(currentDate == entrdate){
        this.nextDate = fentdate.setDate(fentdate.getDate() + 1); 
        this.nextDate = formatDate(this.nextDate,'dd-MM-yyyy','en_US');
        this.prevDate = '';        
       }

       else if(currentDate < entrdate){
        this.nextDate = fentdate.setDate(fentdate.getDate() + 1); 
        this.nextDate = formatDate(this.nextDate,'dd-MM-yyyy','en_US');

       this.prevDate = fentdate.setDate(fentdate.getDate() - 2); 
        this.prevDate = formatDate(this.prevDate,'dd-MM-yyyy','en_US');
        
      }
     
  }




  ngOnDestroy(){
    this.modalService.dismissAll();
  }


}


