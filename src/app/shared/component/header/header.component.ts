import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NavbarService} from 'src/app/services/navbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showHeader: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public nav: NavbarService
  ) {
    this.route.queryParams.subscribe(params => {
      this.showHeader = params['header'];
      if((this.showHeader && this.showHeader === "off") || (this.showHeader && this.showHeader === "on")) {
        localStorage.setItem('isHeader', this.showHeader);
      }
    });
  }

  ngOnInit() {
    let checkHeader = localStorage.getItem('isHeader');
    console.log(checkHeader);
    if((this.showHeader && this.showHeader === "off") || (checkHeader && checkHeader === "off")) {
      this.nav.hide();
    } else if ((this.showHeader && this.showHeader === "on") || (checkHeader && checkHeader === "on")) {
      this.nav.show();
    }
  }
}
