import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NavbarService} from 'src/app/services/navbar.service';
import { ConstNameService } from 'src/app/services/const-name.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showHeader: any;
  checkEnv = false;

  constructor(
    public router: Router,
    private costname:ConstNameService,
    private route: ActivatedRoute,
    public nav: NavbarService
  ) {
    this.route.queryParams.subscribe(params => {
      this.showHeader = params['header'] || false;
    });
  }

  ngOnInit() {
    this.checkEnv = this.costname.CHECK_ENV.isDev;
    if(this.showHeader && this.showHeader === "off") {
      this.nav.hide();
    } else {
      this.nav.show();
    }
  }
}
