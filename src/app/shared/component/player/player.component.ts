import { Component, OnInit } from '@angular/core';
import { PodcastService } from 'src/app/services/podcast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { ConstNameService } from 'src/app/services/const-name.service';
declare var $: any;
import * as Plyr from 'plyr';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  songs: any = [];
  active: any = [];
  public player;
  songsList: any = [];
  id: string;
  constructor(
    private podcastServices: PodcastService,
    private route: ActivatedRoute,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private constname: ConstNameService
  ) { 
    this.route.params.subscribe(params => this.id = params['id']);

  }

  ngOnInit() {
    let playlist = JSON.parse(localStorage.getItem('playList'));
    if(playlist){
      this.songsList = playlist;
    }
    this.loadPlyr();
    if (this.eventEmitterService.plySong==undefined) {
      this.eventEmitterService.plySong = this.eventEmitterService.
      invokePodcastComponentFunction.subscribe((args:string) => {
        this.newSetSource(args);
      });
    }
    if (this.eventEmitterService.playlist==undefined) {
      this.eventEmitterService.playlist = this.eventEmitterService.
      invokePlaylist.subscribe((args:string) => {
        this.addToPlaylist(args);
      });
    }
    if (this.eventEmitterService.checkList==undefined) {
      this.eventEmitterService.checkList = this.eventEmitterService.
      removePlaylist.subscribe((args:string) => {
        this.removeFromPlaylist(args);
      });
    }
  }

  loadPlyr() {
    this.player = new Plyr('#player', {
      autoplay: false,
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

    let playlist = document.querySelector(".playlist");
    this.songs = document.querySelectorAll(".playlist--list li");
    this.active = null;
  }

  addToPlaylist(obj) {
    let playlistArr = [];
    let playlist = JSON.parse(localStorage.getItem('playList'));
    if(playlist) {
      let match = playlist.findIndex((item) => item.id == obj.id);
      if(match < 0) {
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
    if(playlist) {
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

  newSetSource(result) {
    this.toggleButton(result.id);
    if (this.active !== result.id) {
      $('.track-title').text(result.title);
      this.active = result.id;
      this.player.source = {
        type: "audio",
        title: "test",
        sources: [
          {
            src : result.url,
            type: "audio/ogg"
          }
        ]
      };

      if (result.play) {
        this.player.play();
      }

      if(this.songsList) {
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

  setSource(selected, sourceAudio, title, play) {
    this.toggleButton(selected);
    if (this.active !== selected) {
      $('.track-title').text(title);
      this.active = selected;
      this.player.source = {
        type: "audio",
        title: "test",
        sources: [
          {
            src : sourceAudio,
            type: "audio/ogg"
          }
        ]
      };

      if (play) {
        this.player.play();
      }

      if(this.songsList) {
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

  toggleButton(id=null) {
    this.player.on('play', event => {
      $('#music-player-div').show();
      $('.episode-play-btn').show();
      $('.episode-pause-btn').hide();
      if(id){
        $('#play_' + id).hide();
        $('#pause_' + id).show();
        $('#playlist_play_' + id).hide();
        $('#playlist_pause_' + id).show();
      }
      $('#playButton').hide();
      $('#pauseButton').show();
    });
    this.player.on('pause', event => {
      $('.episode-play-btn').show();
      $('.episode-pause-btn').hide();
      if(id) {
        $('#play_' + id).show();
        $('#pause_' + id).hide();
        $('#playlist_play_' + id).show();
        $('#playlist_pause_' + id).hide();
      }
      $('#playButton').show();
      $('#pauseButton').hide();
    });
  }

  playSong() {
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
      if(item.id === episode.id){
        return true;
      }
    });
    return false;
  }

  nextSong() {
    if(this.songsList) {
      let match = this.songsList.findIndex((item) => item.id == this.active);
      let checkNextSong = this.songsList[match + 1];
      if(checkNextSong) {
        this.setSource(checkNextSong.id, checkNextSong.url, checkNextSong.title, true);
      } else {
        console.log('next song not available');
      }
    }
  }

  previousSong() {
    if(this.songsList) {
      let match = this.songsList.findIndex((item) => item.id == this.active);
      let checkPreviousSong = this.songsList[match - 1];
      if(checkPreviousSong) {
        this.setSource(checkPreviousSong.id, checkPreviousSong.url, checkPreviousSong.title, true);
      } else {
        console.log('Previous song not available');
      }
    }
  }

}
