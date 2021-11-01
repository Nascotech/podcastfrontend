import {Component, OnInit, OnDestroy, Renderer2} from '@angular/core';
import {NgcCookieConsentService, NgcStatusChangeEvent} from 'ngx-cookieconsent';
import {Subscription} from 'rxjs/Subscription';
import {PodcastService} from 'src/app/services/podcast.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ConstNameService} from 'src/app/services/const-name.service';
import {NavigationEnd, ActivatedRoute, Router} from '@angular/router';
import {GoogleAnalyticsService} from 'src/app/services/google-analytics.service';
import postscribe from 'postscribe';

declare let $: any;

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

    errorMessage: string;
    private statusChangeSubscription: Subscription;

    constructor(
        private podcastService: PodcastService,
        private constName: ConstNameService,
        private router: Router,
        private renderer2: Renderer2,
        private ccService: NgcCookieConsentService
    ) {
    }

    ngOnInit() {
        this.getAccessToken();
        this.checkScript();
        this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
            (event: NgcStatusChangeEvent) => {
                if (event.status === 'allow') {
                    localStorage.setItem('isAccept', 'allow');
                    this.checkScript();
                } else {
                    localStorage.setItem('isAccept', 'decline');
                    this.checkScript();
                }
            });
    }

    getAccessToken() {
        const publisherSlug = localStorage.getItem('publisherSlug') || '';
        this.podcastService.getAccessToken(publisherSlug).subscribe((data: any) => {
            if (data.errorMsg === '') {
                if (data.response.googleCode) {
                    GoogleAnalyticsService.loadGoogleAnalytics(atob(data.response.googleCode));
                    this.router.events.subscribe(event => {
                        if (event instanceof NavigationEnd) {
                            (window as any).ga('set', 'page', event.urlAfterRedirects);
                            (window as any).ga('send', 'pageview');
                        }
                    });
                }
                if (data.response.groupId) {
                    this.router.navigate(['/'], {queryParams: {groupId: data.response.groupId}});
                }
            }
        }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
                this.errorMessage = 'Server can\'t be connect try again.';
            } else {
                this.constName.forbidden(error);
            }
        });
    }

    checkScript() {
        const isAccept = localStorage.getItem('isAccept');
        if (isAccept && isAccept === 'allow') {
            $('#adswizz_1').remove();
            $('#adswizz_2').remove();
            this.renderExternalScript('//synchrobox.adswizz.com/register2.php?aw_0_req.gdpr=true', 'adswizz_1');
            this.renderExternalScript('//cdn.adswizz.com/adswizz/js/SynchroClient2.js?aw_0_req.gdpr=true', 'adswizz_2');
        } else {
            $('#adswizz_1').remove();
            $('#adswizz_2').remove();
            this.renderExternalScript('//synchrobox.adswizz.com/register2.php?aw_0_req.gdpr=false', 'adswizz_1');
            this.renderExternalScript('//cdn.adswizz.com/adswizz/js/SynchroClient2.js?aw_0_req.gdpr=false', 'adswizz_2');
        }
    }

    onActivate(event) {
        let scrollToTop = window.setInterval(() => {
            const pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, pos - 20); // how far to scroll on each step
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 16);
    }

    ngOnDestroy(): void {
        this.statusChangeSubscription.unsubscribe();
    }

    renderExternalScript(src: string, id: string): HTMLScriptElement {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.id = id;
        script.async = true;
        script.defer = true;
        this.renderer2.appendChild(document.body, script);
        return script;
    }
}
