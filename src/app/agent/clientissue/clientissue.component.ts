import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClientissueService } from '../../services/clientissue.service'
import { Constants } from '../../constant/constant';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { LocationService } from '../../services/location.service';
import { BusOperatorService } from './../../services/bus-operator.service';
import { BusService} from '../../services/bus.service';
@Component({
  selector: 'app-clientissue',
  templateUrl: './clientissue.component.html',
  styleUrls: ['./clientissue.component.scss']
})
export class ClientissueComponent implements OnInit {

  public form: FormGroup;

  public formConfirm: FormGroup;
  public searchForm: FormGroup;
  pagination: any;

  modalReference: NgbModalRef;
  confirmDialogReference: NgbModalRef;

  public isSubmit: boolean;
  public ModalHeading: any;
  public ModalBtn: any;


  busoperators: any;
  issType: any;
  issSubType: any;
  message: any;
  locations: any;
  buses: any;
  clientissue: any;

  constructor(
    private spinner: NgxSpinnerService ,
    private http: HttpClient,
    private notificationService: NotificationService,
    private fb: FormBuilder,    
     private busOperatorService: BusOperatorService,
     private locationService: LocationService,
     private busService:BusService,

    private cis: ClientissueService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.ModalHeading = "Add New Location";
    this.ModalBtn = "Save";
  }





  ngOnInit(): void {

    // this.spinner.show();
    this.message='';
    this.form = this.fb.group({
      issueType: [null, Validators.compose([Validators.required])],
      issueSubType: [null, Validators.compose([Validators.required])],
      refNo: [null],
      message: [null],
      source: [null],
      destination: [null],
      busId: [null],
      operatorId: [null]    
    });
    this.formConfirm = this.fb.group({
      id: [null]
    });
    this.searchForm = this.fb.group({
      rows_number: Constants.RecordLimit,
    });

    this.search();
    this.loadservices();
  }


  OpenModal(content) {
    this.modalReference = this.modalService.open(content, { scrollable: true, size: 'xl' });
  }
  ResetAttributes() {
    this.form = this.fb.group({
      issueType: [null, Validators.compose([Validators.required])],
      issueSubType: [null, Validators.compose([Validators.required])],
      refNo: [null],
      message: [null, Validators.compose([Validators.required])],
      source: [null],
      destination: [null],
      busId: [null],
      operatorId: [null] 
    });
    this.form.reset();
    this.message='';
    this.ModalHeading = "Enter Your Query";
    this.ModalBtn = "Request";
  }
  
  loadservices()
  {
     this.cis.getIssueType().subscribe(
        resp => {
          if (resp.status == 1) {
           this.issType = resp.data;
          }
        }
      ); 
      
      this.busOperatorService.readAll().subscribe(
        res => {
          this.busoperators = res.data;
          this.busoperators.map((i: any) => { i.operatorData = i.organisation_name + '    (  ' + i.operator_name  + '  )'; return i; });
          // console.log(this.busoperators); 
        }
      );
      this.locationService.readAll().subscribe(
        records => {
          this.locations = records.data;
        }
      );
  }

  issuSubType(){
    this.spinner.show();
    this.issSubType=[];
    this.message='';
    this.form.controls['issueSubType'].setValue('');
    const data = {
      id: this.form.value.issueType
    };

    this.cis.getIssuesubType(data).subscribe(
      resp => {
        if (resp.status == 1) {
         this.issSubType = resp.data;
         this.spinner.hide();
        }
      }
    );   
  }

  msgg()
  {
  
      let id = this.form.value.issueSubType

    
    for(let mdd of this.issSubType)
    {
      if(id == mdd.id){
        this.message = mdd.heading;
      }
     }
  }

  findOperator(event:any)
{
  let operatorId=event.id;
  if(operatorId)
  {
    this.spinner.show();
    this.busService.getByOperaor(operatorId).subscribe(
      res=>{
        this.buses=res.data;        
        this.buses.map((i:any) => { i.testing = i.name + ' - ' + i.bus_number +'('+i.from_location[0].name +'>>'+i.to_location[0].name+')' ; return i; });
        this.spinner.hide();
      }
    );
  }
  
}


  page(label: any) {
    return label;
  }


  search(pageurl = "") {
    // this.spinner.show();
    const data = {
      rows_number: this.searchForm.value.rows_number,
      user_id : localStorage.getItem('USERID')
    };

    // console.log(data);
    if (pageurl != "") {
      this.cis.getapiclientissuedata(pageurl,data).subscribe(
        res => {
          this.clientissue = res.data.data.data;
          this.pagination = res.data.data;
          // console.log( this.BusOperators);
          this.spinner.hide();
        }
      );
    }
    else {
      this.cis.apiclientissuedata(data).subscribe(
        res => {
          this.clientissue = res.data.data.data;
          this.pagination = res.data.data;
          // console.log( res.data);
          this.spinner.hide();
        }
      );
    }
  }


  refresh() {
    this.spinner.show();
    this.searchForm = this.fb.group({
      rows_number: Constants.RecordLimit,
      user_id : localStorage.getItem('USERID'),
    });
    this.search();

  }

  title = 'angular-app';
  fileName = 'Seo-Setting.xlsx';

  exportexcel(): void {

    /* pass here the table id */
    let element = document.getElementById('print-section');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }


  addData() {
    this.spinner.show();
    // console.log(this.form.value);
    // return;

    const data = {
      issueType_id: this.form.value.issueType,
      issueSubType_id: this.form.value.issueSubType,
      reference_id: this.form.value.refNo,
      busId: this.form.value.busId,
      operatorId: this.form.value.operatorId,
      source:this.form.value.source,
      destination: this.form.value.destination,
      message: this.form.value.message,
      user_id: localStorage.getItem('USERID'),
      created_by: localStorage.getItem('USERNAME')

    };

    // console.log(data);
   
      this.cis.addClientIssue(data).subscribe(
        resp => {

          if (resp.status == 1) {
            this.notificationService.addToast({ title: 'Success', msg: resp.message, type: 'success' });
            this.modalReference.close();
            this.ResetAttributes();
            this.spinner.hide();
            this.search();
            // console.log(resp.data);
          }
          else {
            this.notificationService.addToast({ title: 'Error', msg: resp.message, type: 'error' });
            this.spinner.hide();
          }
        }
      );   

  }


}
