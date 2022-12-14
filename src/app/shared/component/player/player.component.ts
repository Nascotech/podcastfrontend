import {Component, Inject, OnInit} from '@angular/core';
import { PodcastService } from 'src/app/services/podcast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { ConstNameService } from 'src/app/services/const-name.service';

declare const com_adswizz_synchro_decorateUrl: any;
declare let $: any;
import * as Plyr from 'plyr';
import {ClipboardService} from "ngx-clipboard";
import {DOCUMENT} from "@angular/common";
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpParameterCodec} from "@angular/common/http";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, HttpParameterCodec {

  songs: any = [];
  active: any = [];
  public player;
  songsList: any = [];
  id: string;
  currentPlay: { play: any; image: any; id: any; title: any; url: any };
  window: any;

  constructor(
    private podcastServices: PodcastService,
    private route: ActivatedRoute,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private constname: ConstNameService,
    private clipboardApi: ClipboardService,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.route.params.subscribe(params => this.id = params['id']);
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
    let playlist = JSON.parse(localStorage.getItem('playList'));
    if (playlist) {
      this.songsList = playlist;
    }
    this.loadPlyr();
    if (this.eventEmitterService.plySong == undefined) {
      this.eventEmitterService.plySong = this.eventEmitterService.
        invokePodcastComponentFunction.subscribe((args: string) => {
          this.newSetSource(args);
        });
    }
    if (this.eventEmitterService.playlist == undefined) {
      this.eventEmitterService.playlist = this.eventEmitterService.
        invokePlaylist.subscribe((args: string) => {
          this.addToPlaylist(args);
        });
    }
    if (this.eventEmitterService.checkList == undefined) {
      this.eventEmitterService.checkList = this.eventEmitterService.
        removePlaylist.subscribe((args: string) => {
          this.removeFromPlaylist(args);
        });
    }
  }

  loadPlyr() {
    this.player = new Plyr('#player', {
      autoplay: false,
      loadSprite: true,
      controls: [
        // 'play',
        // 'restart',
        // 'rewind',
        // 'fast-forward',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        //'next',
        //'captions',
        //'download'
      ]
    });

    this.player.on('ready', event => {
      $('.plyr__controls').css('background', 'transparent');
      $('.plyr--audio .plyr__controls').css('padding', '0px');
      $('.plyr--full-ui').css('margin-right', '20px');
      // $('<style>.plyr__progress:focus:after, .range:hover:after {background: rgba(211, 3, 32, .95);}</style>').appendTo('head');
    });

    this.player.on('waiting', event => {
      $('#custom-pause').removeClass('fa fa-pause')
      $('#custom-pause').addClass('fa fa-spinner fa-spin')
    });

    this.player.on('canplay', event => {
      $('#custom-pause').removeClass('fa fa-spinner fa-spin')
      $('#custom-pause').addClass('fa fa-pause')
    });

    let playlist = document.querySelector(".playlist");
    this.songs = document.querySelectorAll(".playlist--list li");
    this.active = null;
  }

  addToPlaylist(obj) {
    let playlistArr = [];
    let playlist = JSON.parse(localStorage.getItem('playList'));
    if (playlist) {
      let match = playlist.findIndex((item) => item.id == obj.id);
      if (match < 0) {
        this.songsList.push(obj);
        playlist.push(obj);
        localStorage.setItem('playList', JSON.stringify(playlist));
      }
    } else {
      this.songsList.push(obj);
      playlistArr.push(obj);
      localStorage.setItem('playList', JSON.stringify(playlistArr));
    }
  }

  removeFromPlaylist(episode) {
    let playlistArr = [];
    let playlist = JSON.parse(localStorage.getItem('playList'));
    if (playlist) {
      for (let list of playlist) {
        if (episode.id === list.id) {
          playlist.splice(playlist.indexOf(list), 1);
          break;
        }
      }
      this.songsList = playlist;
      localStorage.setItem('playList', JSON.stringify(playlist));
    }
  }

  removeAll() {
    this.songsList = [];
    localStorage.setItem('playList', JSON.stringify(this.songsList));
  }
///
  newSetSource(result) {
    this.currentPlay = result;
    $('.f-footer').addClass('f-padding');
    this.toggleButton(result.id);
    if (this.active !== result.id) {
      $('.track-title').text(result.title);
      if (result.image) {
        $('#plyr-img').attr("src", result.image);
      } else {
        $('#plyr-img').attr("src", '/assets/img/no-image-2.jpg');
      }
      this.active = result.id;
      this.player.source = {
        type: "audio",
        title: "test",
        sources: [
          {
            src: this.convertUrl(result.url, result.id),
            type: 'audio/mp3',
          }
        ]
      };

      if (result.play) {
        this.player.play();
      }

      if (this.songsList) {
        this.songsList.forEach(item => {
          if (item.id === result.id) {
            $('#' + item.id).addClass('active');
          } else {
            $('#' + item.id).removeClass('active');
          }
        });
      }
    } else {
      this.player.togglePlay();
    }
  }

  setSource(selected, sourceAudio, title, image, play) {
    this.currentPlay = {
      'id': selected,
      'play': play,
      'title': title,
      'url': sourceAudio,
      'image': image };
    $('.f-footer').addClass('f-padding');
    this.toggleButton(selected);
    if (this.active !== selected) {
      $('.track-title').text(title);
      if (image) {
        $('#plyr-img').attr("src", image);
      } else {
        $('#plyr-img').attr("src", '/assets/img/no-image-2.jpg');
      }
      this.active = selected;
      this.player.source = {
        type: "audio",
        title: "test",
        sources: [
          {
            src: this.convertUrl(sourceAudio, selected),
            type: 'audio/mp3',
          }
        ]
      };

      if (play) {
        this.player.play();
      }

      if (this.songsList) {
        this.songsList.forEach(item => {
          if (item.id === selected) {
            $('#' + item.id).addClass('active');
          } else {
            $('#' + item.id).removeClass('active');
          }
        });
      }
    } else {
      this.player.togglePlay();
    }
  }

  toggleButton(id = null) {
    this.player.on('play', event => {
      $('#music-player-div').show();
      $('.episode-play-btn').show();
      $('.episode-pause-btn').hide();
      if (id) {
        $('#play_' + id).hide();
        $('#pause_' + id).show();
        $('#play_mob_' + id).hide();
        $('#pause_mob_' + id).show();
        $('#playlist_play_' + id).hide();
        $('#playlist_pause_' + id).show();
      }
      $('#playButton').hide();
      $('#pauseButton').show();
    });
    this.player.on('pause', event => {
      $('.episode-play-btn').show();
      $('.episode-pause-btn').hide();
      if (id) {
        $('#play_' + id).show();
        $('#pause_' + id).hide();
        $('#play_mob_' + id).show();
        $('#pause_mob_' + id).hide();

        $('#playlist_play_' + id).show();
        $('#playlist_pause_' + id).hide();
      }
      $('#playButton').show();
      $('#pauseButton').hide();
    });
  }

  convertUrl(url, id) {
    let isAccept = localStorage.getItem('isAccept');
    let gdpr = (isAccept && isAccept === "allow") ? true : false;
    let newUrl = url + '&awEpisodeId=' + id + '&aw_0_req.gdpr=' + gdpr;
    return com_adswizz_synchro_decorateUrl(newUrl);
  }

  playSong() {
    $('.f-footer').addClass('f-padding');
    this.player.play();
    this.toggleButton(null);
  }

  pauseSong() {
    this.player.pause();
    this.toggleButton(null);
  }

  stopSong() {
    this.player.stop();
  }

  rewindSong() {
    this.player.rewind();
  }

  forwardSong() {
    this.player.forward();
  }

  alreadyInPlaylist(episode) {
    this.songsList.forEach(item => {
      if (item.id === episode.id) {
        return true;
      }
    });
    return false;
  }

  nextSong() {
    if (this.songsList) {
      let match = this.songsList.findIndex((item) => item.id == this.active);
      let checkNextSong = this.songsList[match + 1];
      if (checkNextSong) {
        this.setSource(checkNextSong.id, checkNextSong.url, checkNextSong.title, checkNextSong.image, true);
      } else {
        console.log('next song not available');
      }
    }
  }

  previousSong() {
    if (this.songsList) {
      let match = this.songsList.findIndex((item) => item.id == this.active);
      let checkPreviousSong = this.songsList[match - 1];
      if (checkPreviousSong) {
        this.setSource(checkPreviousSong.id, checkPreviousSong.url, checkPreviousSong.title, checkPreviousSong.image, true);
      } else {
        console.log('Previous song not available');
      }
    }
  }

  socialShareUrl() {
    const podcast = this.router.url.split('?')[0].split('/').pop();
    const episode = this.currentPlay.id.substr(0, this.currentPlay.id.indexOf('_'));
    this.clipboardApi.copyFromContent(this.document.defaultView.window.location.hostname + this.router.url + '/?podcast=' +  this.encodeValue(podcast) + '&episode=' + this.encodeValue(episode));
    this.snackBar.open('Podcast Link Copied ', 'Okay',{
          verticalPosition: 'top'
    });
  }

}
