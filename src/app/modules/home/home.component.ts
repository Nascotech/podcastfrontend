import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { PodcastService } from 'src/app/services/podcast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConstNameService } from 'src/app/services/const-name.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import postscribe from 'postscribe';

import * as $ from "jquery";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  photoUrl: string;
  searchText: string;
  searchGroup: string;
  dataResponse: any = [];
  lastPage;
  count: number = 1;
  podcastList: any = [];
  isFullListDisplayed: boolean = false;
  isloadmore: boolean = false;
  submitted = false;
  isLoadingService:boolean = true;
  userResponse: any = [];
  errorMessage: string;
  validationMessage = [];
  advScriptData: any = [];

  constructor(
    private podcastService: PodcastService,
    private constname: ConstNameService,
    private router: Router,
    private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    this.route.params.subscribe(params => this.searchGroup = params['groupId']);
    this.route.params.subscribe(params => this.searchText = params['searchText']);
  }

  ngOnInit() {
    window.scroll(0,0);
    this.route.queryParams.subscribe(queryParams => {
      this.searchGroup = queryParams.groupId;
      this.searchText = queryParams.searchText;
      this.getAccessToken();
    });
  }

  getAccessToken() {
    this.photoUrl = this.constname.BASE.img_uri;
    let domain = location.protocol + '//' + location.hostname;
    // let domain = 'https://atunwapodcasts.com';
    this.podcastService.getAccessToken(domain).subscribe((data: any) => {
      if (data.errorMsg === "")  {
        this.userResponse = data;
        localStorage.setItem('publisherInfo', JSON.stringify(this.userResponse.response));
        localStorage.setItem('publisherToken', this.userResponse.response.accessToken);
        localStorage.setItem('themeColor', this.userResponse.response.headerColor);
        document.documentElement.style.setProperty('--primary-color', this.userResponse.response.headerColor);
        this.titleService.setTitle("Podcasts - " + this.userResponse.response.publisherName);
        if(this.userResponse.response.photo) {
          $(".header-logo").attr("src", this.photoUrl + this.userResponse.response.photo.path);
        }
        if(this.userResponse.response.favIcon) {
          $('link[rel="shortcut icon"]').attr('href', this.photoUrl + this.userResponse.response.favIcon.path)
        }
        if(this.userResponse.response.homeDomain) {
          $("#home-link").attr("href", this.userResponse.response.homeDomain);
        }
        if(this.userResponse.response.privacyPolicy) {
          $("#privacy-link").attr("href", this.userResponse.response.privacyPolicy);
        }
        if(this.userResponse.response.termsOfUse) {
          $("#terms-link").attr("href", this.userResponse.response.termsOfUse);
        }
        this.getAdvScript();
        this.getPodcastlist();
      } else if (data.errorMsg === "ValidationError") {
        let messages = data.response.message;
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
         this.errorMessage = "Server can't be connect try again.";
       } else {
         this.constname.forbidden(error);
       }
    });
  }

  getAdvScript() {
    this.podcastService.getDefaultSetting().subscribe((data: any) => {
      localStorage.setItem('advScriptData', JSON.stringify(data.response));
      this.updateGoogleScript();
    }, (error: HttpErrorResponse) => {
      this.constname.forbidden(error);
    });
  }

  async updateGoogleScript() {
    this.advScriptData = JSON.parse(localStorage.getItem('advScriptData'));

    if(this.advScriptData.leaderboard1 && !$("#lead-banner").find("script").length){
      await postscribe('#lead-banner', atob(this.advScriptData.leaderboard1));
    } else if(!this.advScriptData.leaderboard1) {
      $('#lead-banner').hide();
    }

    if(this.advScriptData.sidebar1 && !$("#sidebar1").find("script").length) {
      await postscribe('#sidebar1', atob(this.advScriptData.sidebar1));
    } else if(!this.advScriptData.sidebar1) {
      $('#sidebar1').hide();
    }

    if(this.advScriptData.sidebar2 && !$("#sidebar2").find("script").length){
      await postscribe('#sidebar2', atob(this.advScriptData.sidebar2));
    } else if(!this.advScriptData.sidebar2) {
      $('#sidebar2').hide();
    }

    if(this.advScriptData.sidebar3 && !$("#sidebar3").find("script").length){
      await postscribe('#sidebar3', atob(this.advScriptData.sidebar3));
    } else if(!this.advScriptData.sidebar3) {
      $('#sidebar3').hide();
    }

    if(this.advScriptData.sidebar4 && !$("#sidebar4").find("script").length){
      await postscribe('#sidebar4', atob(this.advScriptData.sidebar4));
    } else if(!this.advScriptData.sidebar4) {
      $('#sidebar4').hide();
    }
  }

  getPodcastlist() {
    this.isLoadingService = true;
    this.count = 1;
    this.podcastService.getPodcastList(1, this.searchGroup, this.searchText).subscribe(data => {
      this.isloadmore=true;
      this.dataResponse = data;
      this.isLoadingService = false;
      this.podcastList = this.dataResponse.response.list;      
      let totalRecord = this.dataResponse.response.total;
      this.lastPage = Math.ceil(totalRecord / 24);
      if(this.lastPage > 1) {
        $('#more-podcast-btn').show();
      }
      this.isLoadingService = false;
    }, (error: HttpErrorResponse) => {
      this.constname.forbidden(error);
      this.isLoadingService = false;
    });
  }

  gotodetailPage(id) {
    this.router.navigate(['/directory'+id])
  }

  loadMorePodcast() {
    this.count++;
    this.submitted=true;
    if(this.count <= this.lastPage) {
      //this.ngxService.start();
      this.podcastService.getPodcastList(this.count, this.searchGroup, this.searchText).subscribe(data => {
        this.dataResponse = data;
        this.submitted=false;
        this.isloadmore=true;
        this.dataResponse.response.list.forEach(item => {
          this.podcastList.push(item);
        });
        //this.ngxService.stop();
      }, (error: HttpErrorResponse) => {
        this.submitted=false;
        this.constname.forbidden(error);
       // this.ngxService.stop();
      });
    } else {
      this.isFullListDisplayed = true;
    }
  }
}
