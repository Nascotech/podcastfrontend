import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokePodcastComponentFunction = new EventEmitter();
  invokePlaylist = new EventEmitter();
  removePlaylist = new EventEmitter();
  plySong: Subscription;
  playlist: Subscription;
  checkList: Subscription;

  constructor() { }

  onEpisodePlayButtonClick(id, url, title, play) {
    this.invokePodcastComponentFunction.emit({id: id, url: url, title: title, play: play});
  }

  onEpisodePlaylistButtonClick(episodeId, episodeUrl, episodeTitle) {
    this.invokePlaylist.emit({id: episodeId, url: episodeUrl, title: episodeTitle});
  }

  removeFromPlaylist(episodeId) {
    this.removePlaylist.emit({id: episodeId});
  }
}
