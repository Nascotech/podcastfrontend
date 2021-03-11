
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
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
  getAccessTokenURL = this.baseURL + '/api/getAccessToken/';
  defaultConfig = this.baseURL + '/api/defaultConfig/';

  constructor(
    private _coreHttpService: CoreHttpService,
    private http:HttpClient,
    private constname:ConstNameService
  ){}

  getAccessToken(slug) {
    return this.http.post(this.getAccessTokenURL, {
      publisherSlug: slug
    });
  }

  getPodcastList(page_no, groupId, searchText) {
    let params = {
      pageNo: page_no,
      isPagination: true,
      pageSize: 24,
      groupId: groupId,
      keyword: searchText
    };
    return this.http.post(this.getpodcastlistURL, params, this.constname.getAccessToken());
  }

  getGroupList(page_no) {
    let params = {
      pageNo: page_no
    };
    return this.http.get(this.getGrouplistURL, this.constname.getAccessToken());
  }

  getPodcastDetails(id) {
    return this.http.get(this.getpodcastdetailsURL + id, this.constname.getAccessToken());
  }

  getPodcastEpisode(id, pageNO) {
    let params = new HttpParams();
    params = params.append('pageNo', pageNO);
    return this.http.get(this.getpodcastepisodeURL + id + '?' + params, this.constname.getAccessToken());
  }

  getDefaultSetting() {
    return this.http.get(this.defaultConfig, this.constname.getAccessToken());
  }
}
