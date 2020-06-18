
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CoreHttpService } from './core-http.service';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {ConstNameService} from './const-name.service';


@Injectable({
  providedIn: 'root'
})
export class PodcastService {
  private baseURL = environment.base_url;
  getGrouplistURL = this.baseURL + '/api/getGroups';
  getpodcastlistURL = this.baseURL + '/api/getPodcasts';
  getpodcastdetailsURL = this.baseURL + '/api/getPodcastDetails/';
  getpodcastepisodeURL = this.baseURL + '/api/getPodcastEpisodes/';

  constructor(private _coreHttpService: CoreHttpService,
    private http:HttpClient,
    private constname:ConstNameService){}

  getPodcastList(page_no, groupId) {
    let params = {
      pageNo: page_no,
      isPagination: true,
      pageSize: 25,
      groupId: groupId
    };
    return this.http.post(this.getpodcastlistURL, params, this.constname.getAccessToken());
  }

  getGroupList(page_no) {
    let params = {
      pageNo: page_no
    };
    return this.http.post(this.getGrouplistURL, params, this.constname.getAccessToken());
  }

  getPodcastDetails(id) {
    return this.http.get(this.getpodcastdetailsURL + id, this.constname.getAccessToken());
  }

  getPodcastEpisode(id) {
    return this.http.get(this.getpodcastepisodeURL + id, this.constname.getAccessToken());
  }


}
