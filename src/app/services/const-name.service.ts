import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

declare var jquery: any;
declare var $: any;
declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class ConstNameService {

  constructor(private  router: Router) {
  }


  wimpy = {
    // base_url: 'http://192.168.1.46/atunwa-node/wimpy/wimpy.iframe.html'
    base_url: 'http://atunwapodcasts.com/api/wimpy/wimpy.iframe.html',
  };

  clearStorage() {
    localStorage.clear();
  }

  getAccessToken() {
    return {
      headers: new HttpHeaders({
        'access_token': '0d0d869b330c43730a132bce5f5e5b5f0e9982ca6d056826f528febcb1deAAAA',
      })
    };
  }

  forbidden(error: HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 403) {
        this.router.navigate(['forbidden']);
      } else if (error.status === 401) {
        this.clearStorage();
      }
    }
  }
}
