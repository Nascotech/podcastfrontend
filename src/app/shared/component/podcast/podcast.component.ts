import { Component, OnInit } from '@angular/core';
import { PodcastService } from 'src/app/services/podcast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConstNameService } from 'src/app/services/const-name.service';
import * as $ from "jquery";
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';


@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.scss']
})
export class PodcastComponent implements OnInit {
  searchText: string;
  searchGroup: string;
  dataResponse: any = [];
  lastPage;
  count: number = 1;
  podcastList:any=[];
  isFullListDisplayed: boolean = false;
  groupDataResponse: any = [];
  groupList:any;
  isloadmore:boolean=false;
  submitted=false;
  constructor(private podcastService:PodcastService,
    private constname:ConstNameService,
    private spinner:NgxSpinnerService,
    private router:Router
) { }

  ngOnInit() {
    this.getPodcastlist();
    this.getGroupList();
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


  groupFilter(groupId = null) {
    this.searchGroup = groupId;
    this.getPodcastlist();
  }

  gotodirectoryPage()
  {
    console.log("vhvh");
  }

  getPodcastlist()
  {
    
    this.count = 1;
    this.spinner.show();
   // this.ngxService.start();
    this.podcastService.getPodcastList(1, this.searchGroup).subscribe(data => {
      this.isloadmore=true;
      this.dataResponse = data;
      this.podcastList = this.dataResponse.response.list;
      let totalRecord = this.dataResponse.response.total;
      this.lastPage = Math.ceil(totalRecord / 25);
      if(this.lastPage > 1) {
        $('#more-podcast-btn').show();
      }
     // this.ngxService.stop();
     this.spinner.hide()
    }, (error: HttpErrorResponse) => {
      this.constname.forbidden(error);
 
    });
  }

  gotodetailPage(id)
  {
    
    console.log(id);
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
