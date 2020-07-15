import { Component, OnInit } from '@angular/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  constructor(
    private ccService: NgcCookieConsentService
  ) { }

  ngOnInit() {
    this.ccService.popupOpen$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });
  }

  onActivate(event) {
   let scrollToTop = window.setInterval(() => {
     let pos = window.pageYOffset;
     if (pos > 0) {
       window.scrollTo(0, pos - 20); // how far to scroll on each step
     } else {
       window.clearInterval(scrollToTop);
     }
   }, 16);
  }
}
