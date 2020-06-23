import { Component, OnInit } from '@angular/core';
import { PodcastService } from 'src/app/services/podcast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConstNameService } from 'src/app/services/const-name.service';
import * as $ from "jquery";
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

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
  constructor(
    private podcastService: PodcastService,
    private constname: ConstNameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getGroupList();
    this.getPodcastlist();
  }

  getGroupList() {
    this.podcastService.getGroupList(1).subscribe(data => {
      this.groupDataResponse = data;
      this.isloadmore=true;
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
