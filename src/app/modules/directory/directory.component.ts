import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConstNameService } from 'src/app/services/const-name.service';
import { PodcastService } from 'src/app/services/podcast.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Title } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {

  photoUrl: string;
  dataResponseDetails: any = [];
  podcastDetail: any = [];
  podcastList: any = [];
  dataResponsePodcast: any = [];
  podcastEpisodes: any = [];
  dataResponseEpisode: any = [];
  id:String;
  idmobile:String;

  constructor(
    private costname:ConstNameService,
    private podcastService:PodcastService,
    private spinner: NgxSpinnerService,
    private route:ActivatedRoute,
    private eventEmitterService:EventEmitterService,
    private router:Router,
    private titleService: Title
  ) {
    this.route.params.subscribe(params => this.id = params['id']);
  }

  ngOnInit() {
    this.photoUrl = this.costname.BASE.img_uri;
    this.checkLocalStorage();
    this.podcastDetils();
    this.allPodcastEpisod();
  }

  checkLocalStorage() {
    const checkInfo = JSON.parse(localStorage.getItem('publisherInfo') || '[]');
    if(!checkInfo || !localStorage.getItem('publisherToken') || !localStorage.getItem('themeColor')) {
      this.router.navigate(['/']);
    } else {
      document.documentElement.style.setProperty('--primary-color', localStorage.getItem('themeColor'));
      if(checkInfo.photo) {
        $("#header-logo").attr("src", this.photoUrl + checkInfo.photo.path);
      }
    }
  }

  podcastDetils() {
    let publisherInfo = JSON.parse(localStorage.getItem('publisherInfo'));
    this.podcastService.getPodcastDetails(this.id).subscribe(data => {
      this.dataResponseDetails = data;
      this.podcastDetail = this.dataResponseDetails.response;
      this.titleService.setTitle("Podcasts - " + this.podcastDetail.name + " - " + publisherInfo.fullName);
      this.relatedPodcastList(this.podcastDetail.group);
    }, (error: HttpErrorResponse) => {
      this.costname.forbidden(error);
    });
  }


  relatedPodcastList(groupId) {
    this.podcastService.getPodcastList(1, groupId, '').subscribe(data => {
      this.dataResponsePodcast = data;
      this.dataResponsePodcast.response.list.forEach(item => {
        if(item.podcastId !== Number(this.id)) {
          this.podcastList.push(item);
        }
      });
    }, (error: HttpErrorResponse) => {
      this.costname.forbidden(error);
    });
  }

  allPodcastEpisod() {
    this.podcastService.getPodcastEpisode(this.id).subscribe(data => {
      this.dataResponseEpisode = data;
      this.podcastEpisodes = this.dataResponseEpisode.response.data;
      this.getTime(this.podcastEpisodes,this.id);
      localStorage.setItem('podcastEpisodes', JSON.stringify(this.dataResponseEpisode.response));
    }, (error: HttpErrorResponse) => {
      this.costname.forbidden(error);
    });
  }

  getTime(podcastEpisodes, podcastId) {
    podcastEpisodes.forEach(async (item, index) => {
      var url = item.enclosure.url.split('?')[0];
      this.getDuration(url).then(function(length) {
        $("#duration-" + podcastId + '-' + index).text(length);
        $("#duration-mob-" + podcastId + '-' + index).text(length);
      });
    });
  }

  getDuration(src) {
    return new Promise(function(resolve) {
        var audio = new Audio();
        $(audio).on("loadedmetadata", function(){
          let totalSeconds = Math.floor(audio.duration);
          var hours   = Math.floor(totalSeconds / 3600);
          var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
          var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
          // (hours < 10 ? "0" + hours : hours) + ":" +
          var result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
          resolve(result);
        });
        audio.src = src;
    });
  }

  playAllEpisode() {
    this.podcastEpisodes.forEach((info, index) => {
      if(index == 0) {
        this.eventEmitterService.onEpisodePlayButtonClick(this.id + '_' + index, info.enclosure.url, info.title, info.image.link, true);
      }
      this.eventEmitterService.onEpisodePlaylistButtonClick(this.id + '_' + index, info.enclosure.url, info.title, info.image.link);
    });
  }
  redirectUrl(uri: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([uri]));
  }

  redirectTo(id) {
    this.redirectUrl('/directory/' + id);
  }

  setSource(id, url, title, image, play) {
    this.eventEmitterService.onEpisodePlayButtonClick(id, url, title, image, play);
  }

  addToPlaylist(episodeId, url, title, image) {
    this.eventEmitterService.onEpisodePlaylistButtonClick(episodeId, url, title, image);
  }

  removeFromPlaylist(episodeId) {
    this.eventEmitterService.removeFromPlaylist(episodeId);
  }

  checkPlaylistClick(episodeId) {
    let playlist = JSON.parse(localStorage.getItem('playList'));
    if(playlist) {
      for (let list of playlist) {
        if (episodeId === list.id) {
          return true;
        }
      }
      return false;
    }
  }

}
