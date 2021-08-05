import {AfterContentInit, Component, Inject, OnInit} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConstNameService } from 'src/app/services/const-name.service';
import { PodcastService } from 'src/app/services/podcast.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Title } from '@angular/platform-browser';
import postscribe from 'postscribe';

import * as $ from 'jquery';
import {DOCUMENT} from '@angular/common';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit, AfterContentInit{

  photoUrl: string;

  submitted = false;
  page = 1;
  lastPage;
  isloadmore = false;

  isLoading = false;


  dataResponseDetails: any = [];
  dataResponse;
  podcastDetail: any = [];
  podcastList: any = [];
  displayPodcastList: any = [];
  dataResponsePodcast: any = [];
  podcastEpisodes: any = [];
  dataResponseEpisode: any = [];
  id: String;
  idmobile: String;
  advScriptData: any = [];
  sharedId: String;
  sharedUrl: String;
  sharedTitle: String;
  sharedImage: String;
  baseLocation: String;



  constructor(
    private costname: ConstNameService,
    private podcastService: PodcastService,
    private dialogService: ConfirmDialogService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private eventEmitterService: EventEmitterService,
    private router: Router,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,

  ) {
    this.route.params.subscribe(params => this.id = params.slug);
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.photoUrl = this.costname.BASE.img_uri;
    this.baseLocation = this.document.defaultView.window.location.hostname;
    this.checkLocalStorage();
    this.podcastDetils();
    this.allPodcastEpisod();
  }
  ngAfterContentInit(){
    if (this.route.snapshot.queryParams.sharedId) {
      this.sharedId = this.route.snapshot.queryParams.sharedId;
      console.log('shared url ' + this.sharedId);

      this.sharedId = this.route.snapshot.queryParams.sharedid;
      this.sharedTitle = this.route.snapshot.queryParams.title;
      this.sharedUrl = this.route.snapshot.queryParams.url;
      this.sharedImage = this.route.snapshot.queryParams.img;
      this.showDialog("Play Podcast",this.sharedTitle);
      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.setSource(this.sharedId, this.sharedUrl + '?', this.sharedTitle, this.sharedImage ? this.sharedImage : 'assets/img/no-image-2.jpg', true)
        }

      });
    }
  }
  checkLocalStorage() {
    const checkInfo = JSON.parse(localStorage.getItem('publisherInfo') || '[]');
    this.advScriptData = JSON.parse(localStorage.getItem('advScriptData'));
    if (!checkInfo || !localStorage.getItem('publisherToken') || !localStorage.getItem('themeColor')) {
      this.router.navigate(['/']);
    } else {
      document.documentElement.style.setProperty('--primary-color', localStorage.getItem('themeColor'));
      this.titleService.setTitle('Podcasts - ' + checkInfo.publisherName);
      if (checkInfo.photo) {
        $('.header-logo').attr('src', this.photoUrl + checkInfo.photo.path);
      }
      if (checkInfo.favIcon) {
        $('link[rel="shortcut icon"]').attr('href', this.photoUrl + checkInfo.favIcon.path);
      }
      if (checkInfo.homeDomain) {
        $('#home-link').attr('href', checkInfo.homeDomain);
      }
      if (checkInfo.privacyPolicy) {
        $('#privacy-link').attr('href', checkInfo.privacyPolicy);
      }
      if (checkInfo.termsOfUse) {
        $('#terms-link').attr('href', checkInfo.termsOfUse);
      }
      this.updateGoogleScript();
    }
  }

  async updateGoogleScript() {
    if (this.advScriptData.leaderboard1 && !$('#lead-banner').find('script').length){
      await postscribe('#lead-banner', atob(this.advScriptData.leaderboard1));
    } else if (!this.advScriptData.leaderboard1) {
      $('#lead-banner').hide();
    }

    if (this.advScriptData.sidebar1 && !$('#sidebar1').find('script').length) {
      await postscribe('#sidebar1', atob(this.advScriptData.sidebar1));
    } else if (!this.advScriptData.sidebar1) {
      $('#sidebar1').hide();
    }

    if (this.advScriptData.sidebar2 && !$('#sidebar2').find('script').length){
      await postscribe('#sidebar2', atob(this.advScriptData.sidebar2));
    } else if (!this.advScriptData.sidebar2) {
      $('#sidebar2').hide();
    }

    if (this.advScriptData.sidebar3 && !$('#sidebar3').find('script').length){
      await postscribe('#sidebar3', atob(this.advScriptData.sidebar3));
    } else if (!this.advScriptData.sidebar3) {
      $('#sidebar3').hide();
    }

    if (this.advScriptData.sidebar4 && !$('#sidebar4').find('script').length){
      await postscribe('#sidebar4', atob(this.advScriptData.sidebar4));
    } else if (!this.advScriptData.sidebar4) {
      $('#sidebar4').hide();
    }
  }

  podcastDetils() {
    this.isLoading = true;
    const publisherInfo = JSON.parse(localStorage.getItem('publisherInfo'));
    this.podcastService.getPodcastDetails(this.id).subscribe(data => {
      this.dataResponseDetails = data;
      this.isLoading = false;
      this.podcastDetail = this.dataResponseDetails.response;
      this.titleService.setTitle('Podcasts - ' + this.podcastDetail.name + ' - ' + publisherInfo.publisherName);
      this.relatedPodcastList(this.podcastDetail.group);
    }, (error: HttpErrorResponse) => {
      this.isLoading = false;
      this.costname.forbidden(error);
    });
  }


  relatedPodcastList(groupId) {
    this.podcastService.getPodcastList(1, groupId, '').subscribe(data => {
      this.dataResponsePodcast = data;
      this.dataResponsePodcast.response.list.forEach(item => {
        if (item.podcastId !== Number(this.id)) {
          this.podcastList.push(item);
        }
      });
      this.displayPodcastList = this.podcastList.slice(0, 8);
    }, (error: HttpErrorResponse) => {
      this.costname.forbidden(error);
    });
  }

  allPodcastEpisod() {
    this.isLoading = true;
    this.podcastService.getPodcastEpisode(this.id, 1).subscribe(data => {
      this.dataResponseEpisode = data;
      this.isLoading = false;
      this.isloadmore = true;
      const totalRecord = this.dataResponseEpisode.response.total;
      this.podcastEpisodes = this.dataResponseEpisode.response.list;
      this.lastPage = Math.ceil(totalRecord / 25);
      if (this.lastPage > 1) {
        $('#more-podcast-episode-btn').show();
      } else {
        $('#more-podcast-episode-btn').hide();
      }
      // this.getTime(this.podcastEpisodes,this.id);
      localStorage.setItem('podcastEpisodes', JSON.stringify(this.dataResponseEpisode.response.list));
    }, (error: HttpErrorResponse) => {
      this.isLoading = false;
      this.costname.forbidden(error);
    });
  }

  getTime(podcastEpisodes, podcastId) {
    podcastEpisodes.forEach(async (item, index) => {
      const url = item.enclosure.url.split('?')[0];
      this.getDuration(url).then(function(length) {
        $('#duration-' + podcastId + '-' + index).text(length);
        $('#duration-mob-' + podcastId + '-' + index).text(length);
      });
    });
  }

  getDuration(src) {
    return new Promise(function(resolve) {
        const audio = new Audio();
        $(audio).on('loadedmetadata', function(){
          const totalSeconds = Math.floor(audio.duration);
          const hours   = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
          const seconds = totalSeconds - (hours * 3600) - (minutes * 60);
          // (hours < 10 ? "0" + hours : hours) + ":" +
          const result = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds  < 10 ? '0' + seconds : seconds);
          resolve(result);
        });
        audio.src = src;
    });
  }

  playAllEpisode() {
    this.podcastEpisodes.forEach((info, index) => {
      let img = '';
      if (info.image && info.image) {
        img = info.image;
      } else if (this.podcastDetail.image) {
        img = this.podcastDetail.image;
      }
      if (index == 0) {
        this.eventEmitterService.onEpisodePlayButtonClick(info.id + '_' + index, info.url, info.title, img, true);
      }
      this.eventEmitterService.onEpisodePlaylistButtonClick(info.id + '_' + index, info.url, info.title, img);
    });
  }
  redirectUrl(uri: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([uri]));
  }

  redirectTo(slug) {
    this.redirectUrl('/directory/' + slug);
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
    const playlist = JSON.parse(localStorage.getItem('playList'));
    if (playlist) {
      for (const list of playlist) {
        if (episodeId === list.id) {
          return true;
        }
      }
      return false;
    }
  }

  updateTime(time) {
    return time.replace(/^(?:00:)?0?/, '');
  }

  loadMorePodcastEpisod() {
    this.page++;
    this.submitted = true;
    this.podcastService.getPodcastEpisode(this.id, this.page).subscribe(data => {
        this.dataResponseEpisode = data;
        this.submitted = false;
        this.isloadmore = true;
        const totalRecord = this.dataResponseEpisode.response.total;
        this.lastPage = Math.ceil(totalRecord / 25);
        if (this.lastPage >= this.page) {
          $('#more-podcast-episode-btn').show();
        } else {
          this.isloadmore = false;
          $('#more-podcast-episode-btn').hide();
        }
        this.dataResponseEpisode.response.list.forEach(item => {
          this.podcastEpisodes.push(item);
        });
        // this.ngxService.stop();
      }, (error: HttpErrorResponse) => {
        this.submitted = false;
        this.costname.forbidden(error);
      });
    }
   showDialog(title,message){
      const options = {
        title: title,
        message: message,
        cancelText: 'Cancel',
        confirmText: 'Confirm'
      };
      this.dialogService.open(options);
    }
}
