import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})
export class NewPageComponent implements OnInit {

  customerName = 'SK TABRIZ ALLI';

  pnrNumber = 'ODM21036588';

  phone = '9937874390';

  email = 'coo@odgroup.in';

  copied = false;

  constructor() { }

  ngOnInit(): void { }

  viewTicket(): void {
    navigator.clipboard.writeText(this.pnrNumber).then(() => {
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }

  continueToHomepage(): void {
    window.location.href = '/';
  }
}