import { Component, OnInit } from '@angular/core';
import { LoginChecker } from '../helpers/loginChecker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer-menu',
  templateUrl: './footer-menu.component.html',
  styleUrls: ['./footer-menu.component.css', '../home/home.component.css'],
})
export class FooterMenuComponent implements OnInit {
  session: LoginChecker;

  MenuActive: boolean = false;
  activeMenu: any;

  constructor(private modalService: NgbModal) {
    this.session = new LoginChecker();
  }

  ngOnInit(): void {}

  menu() {
    this.MenuActive = this.MenuActive == false ? true : false;
    this.activeMenu = '';
    this.modalService.dismissAll();
  }
}
