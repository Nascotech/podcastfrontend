import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgcCookieConsentService, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { Subscription }   from 'rxjs/Subscription';
import postscribe from 'postscribe';

declare let $: any;

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

   private statusChangeSubscription: Subscription;

  constructor(
    private ccService: NgcCookieConsentService
  ) { }

  ngOnInit() {
    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        if(event.status === "allow") {
          localStorage.setItem('isAccept', "1");
          postscribe('#head-ads', '<script type="text/javascript" src="//synchrobox.adswizz.com/register2.php?aw_0_req.gdpr=1"></script>');
          postscribe('#head-ads', '<script type="text/javascript" src="//cdn.adswizz.com/adswizz/js/SynchroClient2.js?aw_0_req.gdpr=1"></script>');
        } else {
          localStorage.setItem('isAccept', "1");
          postscribe('#head-ads', '<script type="text/javascript" src="//synchrobox.adswizz.com/register2.php?aw_0_req.gdpr=0"></script>');
          postscribe('#head-ads', '<script type="text/javascript" src="//cdn.adswizz.com/adswizz/js/SynchroClient2.js?aw_0_req.gdpr=0"></script>');
        }
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

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }
}
