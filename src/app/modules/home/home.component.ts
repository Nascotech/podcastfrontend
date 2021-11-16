import {Component, OnInit, Renderer2, Inject, AfterContentInit} from '@angular/core';
import {PodcastService} from 'src/app/services/podcast.service';
import {HttpErrorResponse, HttpParameterCodec} from '@angular/common/http';
import {ConstNameService} from 'src/app/services/const-name.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';
import postscribe from 'postscribe';

import * as $ from 'jquery';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmDialogService} from '../../services/confirm-dialog.service';
import {EventEmitterService} from '../../services/event-emitter.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterContentInit, HttpParameterCodec {

    photoUrl: string;
    searchText: string;
    searchGroup: any;
    publisherSlug: string;
    dataResponse: any = [];
    lastPage;
    count = 1;
    podcastList: any = [];
    isFullListDisplayed = false;
    isloadmore = false;
    submitted = false;
    isLoadingService = true;
    userResponse: any = [];
    errorMessage: string;
    validationMessage = [];
    advScriptData: any = [];
    podcastSearchEpisodes: any = [];
    podcastEpisodeItem: any = [];
    sharedId: string;
    sharedUrl: string;
    sharedTitle: string;
    sharedImage: string;
    sharedeDate: string;
    baseLocation: string;
    groupId: any;

    constructor(
        private podcastService: PodcastService,
        private constName: ConstNameService,
        private router: Router,
        private renderer2: Renderer2,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private titleService: Title,
        private dialogService: ConfirmDialogService,
        private eventEmitterService: EventEmitterService,
    ) {
        this.route.paramMap.subscribe(queryParams => {
            if (queryParams.get('pid') !== null) {
                localStorage.setItem('publisherSlug', queryParams.get('pid'));
            }else{
                localStorage.removeItem('publisherSlug');
            }
            if (queryParams.get('gid') !== null) {
                this.groupId = Number(queryParams.get('gid'));
                this.searchGroup = this.groupId;
                this.getPodcastlist();
            }
        });
        this.searchGroup = this.groupId || '';
        this.route.queryParams.subscribe(queryParams => {
            this.searchText = queryParams.searchText || '';
        });
    }

    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
        return encodeURIComponent(value);
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }

    ngOnInit() {
        window.scroll(0, 0);
        this.route.queryParams.subscribe(queryParams => {
            this.searchGroup = this.groupId;
            this.searchText = queryParams.searchText;
            this.getAccessToken();
        });
    }

    ngAfterContentInit() {
        if (this.route.snapshot.queryParams.podcast) {
            const paramsPodcast = this.decodeValue(this.route.snapshot.queryParams.podcast);
            const paramsEpisodeId = this.decodeValue(this.route.snapshot.queryParams.episode);
            this.searchEpisodeWithId(paramsPodcast, 1, paramsEpisodeId);
        }
    }

    getAccessToken() {

        const publisherSlug = localStorage.getItem('publisherSlug') || '';
        this.photoUrl = this.constName.BASE.img_uri;
        this.podcastService.getAccessToken(publisherSlug).subscribe(async (data: any) => {
            if (data.errorMsg === '') {
                this.userResponse = data;
                localStorage.setItem('publisherInfo', JSON.stringify(this.userResponse.response));
                localStorage.setItem('publisherToken', this.userResponse.response.accessToken);
                localStorage.setItem('themeColor', this.userResponse.response.headerColor);
                document.documentElement.style.setProperty('--primary-color', this.userResponse.response.headerColor);
                this.titleService.setTitle('Podcasts - ' + this.userResponse.response.publisherName);

                const checkScript = localStorage.getItem('isScriptUpdate');
                if (checkScript === 'false') {
                    if (this.userResponse.response.headerScript) {
                        await postscribe('#custom-header', atob(this.userResponse.response.headerScript));
                    }
                    if (this.userResponse.response.bodyScript) {
                        await postscribe('#custom-body', atob(this.userResponse.response.bodyScript));
                    }
                    localStorage.setItem('isScriptUpdate', 'true');
                }

                if (this.userResponse.response.photo) {
                    $('.header-logo').attr('src', this.photoUrl + this.userResponse.response.photo.path);
                }
                if (this.userResponse.response.favIcon) {
                    $('link[rel="shortcut icon"]').attr('href', this.photoUrl + this.userResponse.response.favIcon.path);
                }
                if (this.userResponse.response.homeDomain) {
                    $('#home-link').attr('href', this.userResponse.response.homeDomain);
                }
                if (this.userResponse.response.privacyPolicy) {
                    $('#privacy-link').attr('href', this.userResponse.response.privacyPolicy);
                }
                if (this.userResponse.response.termsOfUse) {
                    $('#terms-link').attr('href', this.userResponse.response.termsOfUse);
                }
                this.getAdvScript();
                this.getPodcastlist();
            } else if (data.errorMsg === 'ValidationError') {
                const messages = data.response.message;
                if (messages.length > 1) {
                    this.validationMessage = messages;
                } else {
                    this.errorMessage = data.response.message;
                }
            } else {
                this.errorMessage = data.errorMsg;
            }
        }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
                this.errorMessage = 'Server can\'t be connect try again.';
            } else {
                this.constName.forbidden(error);
            }
        });
    }

    getAdvScript() {
        this.podcastService.getDefaultSetting().subscribe((data: any) => {
            localStorage.setItem('advScriptData', JSON.stringify(data.response));
            this.updateGoogleScript();
        }, (error: HttpErrorResponse) => {
            this.constName.forbidden(error);
        });
    }

    async updateGoogleScript() {
        this.advScriptData = JSON.parse(localStorage.getItem('advScriptData'));

        if (this.advScriptData.leaderboard1 && !$('#lead-banner').find('script').length) {
            await postscribe('#lead-banner', atob(this.advScriptData.leaderboard1));
        } else if (!this.advScriptData.leaderboard1) {
            $('#lead-banner').hide();
        }

        if (this.advScriptData.sidebar1 && !$('#sidebar1').find('script').length) {
            await postscribe('#sidebar1', atob(this.advScriptData.sidebar1));
        } else if (!this.advScriptData.sidebar1) {
            $('#sidebar1').hide();
        }

        if (this.advScriptData.sidebar2 && !$('#sidebar2').find('script').length) {
            await postscribe('#sidebar2', atob(this.advScriptData.sidebar2));
        } else if (!this.advScriptData.sidebar2) {
            $('#sidebar2').hide();
        }

        if (this.advScriptData.sidebar3 && !$('#sidebar3').find('script').length) {
            await postscribe('#sidebar3', atob(this.advScriptData.sidebar3));
        } else if (!this.advScriptData.sidebar3) {
            $('#sidebar3').hide();
        }

        if (this.advScriptData.sidebar4 && !$('#sidebar4').find('script').length) {
            await postscribe('#sidebar4', atob(this.advScriptData.sidebar4));
        } else if (!this.advScriptData.sidebar4) {
            $('#sidebar4').hide();
        }
    }

    getPodcastlist(): void {
        this.isLoadingService = true;
        this.count = 1;
        this.podcastService.getPodcastList(1, this.searchGroup, this.searchText).subscribe(data => {
            this.isloadmore = true;
            this.dataResponse = data;
            this.isLoadingService = false;
            this.podcastList = this.dataResponse.response.list;
            const totalRecord = this.dataResponse.response.total;
            this.lastPage = Math.ceil(totalRecord / 24);
            if (this.lastPage > 1) {
                $('#more-podcast-btn').show();
            }
            this.isLoadingService = false;
        }, (error: HttpErrorResponse) => {
            this.constName.forbidden(error);
            this.isLoadingService = false;
        });
    }

    gotodetailPage(id): void {
        this.router.navigate(['/directory' + id]);
    }

    loadMorePodcast() {
        this.count++;
        this.submitted = true;
        if (this.count <= this.lastPage) {
            this.podcastService.getPodcastList(this.count, this.searchGroup, this.searchText).subscribe(data => {
                this.dataResponse = data;
                this.submitted = false;
                this.isloadmore = true;
                this.dataResponse.response.list.forEach(item => {
                    this.podcastList.push(item);
                });
            }, (error: HttpErrorResponse) => {
                this.submitted = false;
                this.constName.forbidden(error);
            });
        } else {
            this.isFullListDisplayed = true;
        }
    }

    showDialog(title, message) {
        const options = {
            title,
            message,
            cancelText: 'Cancel',
            confirmText: 'Confirm'
        };
        this.dialogService.open(options);
    }

    searchEpisodeWithId(podcastId, page, episodeId) {
        let foudEpisode = false;
        let searchlastPage = 1;
        this.podcastService.getPodcastEpisode(podcastId, page).subscribe(data => {
            this.podcastSearchEpisodes = data;
            const totalRecord = this.podcastSearchEpisodes.response.total;
            searchlastPage = Math.ceil(totalRecord / 25);
            this.podcastSearchEpisodes.response.list.forEach(item => {
                // console.log('item - ' + item.id);
                if (item.id === episodeId) {
                    this.sharedId = item.id;
                    this.sharedUrl = item.url;
                    this.sharedTitle = item.title;
                    this.sharedeDate = item.pubDate;
                    this.sharedImage = item.image ? item.image : 'assets/img/no-image-2.jpg';
                    foudEpisode = true;
                    this.playsharedLink();
                    return;
                }
            });
            if (!foudEpisode) {
                console.log('rather');
                if (page < searchlastPage) {
                    console.log('GOT here');
                    this.searchEpisodeWithId(podcastId, page + 1, episodeId);
                }
            }
        }, (error: HttpErrorResponse) => {
            this.submitted = false;
            this.constName.forbidden(error);
        });

    }

    playsharedLink() {
        this.showDialog('Play Podcast', this.sharedTitle);
        console.log('shared url ' + this.sharedUrl);
        this.dialogService.confirmed().subscribe(confirmed => {
            if (confirmed) {
                this.setSource(this.sharedId, this.sharedUrl + '?', this.sharedTitle, this.sharedeDate, this.sharedImage, true);
            }
        });
    }

    setSource(id, url, title, eDate, image, play) {
        this.eventEmitterService.onEpisodePlayButtonClick(id, url, title, eDate, image, play);
    }
}
