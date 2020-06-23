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

  onEpisodePlayButtonClick(id, url, title, image, play) {
    this.invokePodcastComponentFunction.emit({id: id, url: url, title: title, image: image,play: play});
  }

  onEpisodePlaylistButtonClick(episodeId, episodeUrl, episodeTitle, episodeImage) {
    this.invokePlaylist.emit({id: episodeId, url: episodeUrl, title: episodeTitle, image: episodeImage});
  }

  removeFromPlaylist(episodeId) {
    this.removePlaylist.emit({id: episodeId});
  }
}
