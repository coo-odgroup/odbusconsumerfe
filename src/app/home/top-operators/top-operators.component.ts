import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-operators',
  templateUrl: './top-operators.component.html',
  styleUrls: ['./top-operators.component.css', '../home.component.css']
})
export class TopOperatorsComponent implements OnInit {

  constructor(private router: Router) { }

  topOperators: any = [];

  ngOnInit(): void {
    try {
      const data = localStorage.getItem('PopularInfo');

      if (data) {
        const parsedData = JSON.parse(data);

        if (parsedData && parsedData.topOperators) {
          this.topOperators = parsedData.topOperators;
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage data', error);
    }
  }

  operator_detail(url: any) {
    if (url != '') {
      this.router.navigate(['operator/' + url]);
    }
  }

}
