import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NavbarService} from 'src/app/services/navbar.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  showHeader: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public nav: NavbarService
  ) {
    this.route.queryParams.subscribe(params => {
      this.showHeader = params['header'];
      if(this.showHeader && this.showHeader === "off") {
        localStorage.setItem('isHeader', this.showHeader);
      }
    });
  }

  ngOnInit() {
    let checkHeader = localStorage.getItem('isHeader');
    console.log(checkHeader);
    if((this.showHeader && this.showHeader === "off") || (checkHeader && checkHeader === "off")) {
      this.nav.hide();
    }
  }
}
