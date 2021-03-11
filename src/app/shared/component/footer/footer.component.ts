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
      this.showHeader = params['header'] || false;
    });
  }

  ngOnInit() {
    if(this.showHeader && this.showHeader === "off") {
      this.nav.hide();
    } else {
      this.nav.show();
    }
  }
}
