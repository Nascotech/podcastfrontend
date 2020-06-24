import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { PodcastService } from 'src/app/services/podcast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConstNameService } from 'src/app/services/const-name.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import * as $ from "jquery";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searchText: string;
  searchGroup: string;
  dataResponse: any = [];
  lastPage;
  count: number = 1;
  podcastList: any = [];
  isFullListDisplayed: boolean = false;
  groupDataResponse: any = [];
  groupList: any;
  isloadmore: boolean = false;
  submitted = false;
  isLoadingService:boolean = true;
  userResponse: any = [];
  errorMessage: string;
  validationMessage = [];

  constructor(
    private podcastService: PodcastService,
    private constname: ConstNameService,
    private router: Router,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) { }

  ngOnInit() {
    this.getAccessToken();
  }

  getAccessToken() {
    let domain = location.protocol + '//' + location.hostname;
    this.podcastService.getAccessToken('https://atunwapodcasts.com').subscribe((data: any) => {
      if (data.errorMsg === "")  {
        this.userResponse = data;
        localStorage.setItem('publisherInfo', JSON.stringify(this.userResponse.response));
        localStorage.setItem('publisherToken', this.userResponse.response.accessToken);
        localStorage.setItem('themeColor', this.userResponse.response.headerColor);
        this.updateGoogleScript();
        this.getGroupList();
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
         this.errorMessage = error.error.errorMsg;
       }
    });
  }

  updateGoogleScript() {
    document.documentElement.style.setProperty('--primary-color', this.userResponse.response.headerColor);
    // if(this.userResponse.response.headerScript) {
    //   let script = $(atob(this.userResponse.response.headerScript));
    //   document.getElementsByTagName("head")[0].appendChild(script[0]);
    // }
    // if(this.userResponse.response.leaderboard1){
    //   $("#lead-banner").html(atob(this.userResponse.response.leaderboard1));
    // }
  }

  getGroupList() {
    this.podcastService.getGroupList(1).subscribe(data => {
      this.groupDataResponse = data;
      this.isloadmore = true;
      this.groupList = this.groupDataResponse.response.data;
    }, (error: HttpErrorResponse) => {
      this.constname.forbidden(error);
    });
  }

  groupFilter(event) {
    this.searchGroup = event.target.value;;
    this.getPodcastlist();
  }

  gotodirectoryPage() {
    console.log("vhvh");
  }

  getPodcastlist() {
    this.isLoadingService = true;
    this.count = 1;
    this.podcastService.getPodcastList(1, this.searchGroup).subscribe(data => {
      this.isloadmore=true;
      this.dataResponse = data;
      this.isLoadingService = false;
      this.podcastList = this.dataResponse.response.list;
      let totalRecord = this.dataResponse.response.total;
      this.lastPage = Math.ceil(totalRecord / 25);
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
      this.podcastService.getPodcastList(this.count, this.searchGroup).subscribe(data => {
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
