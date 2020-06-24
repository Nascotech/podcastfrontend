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

  clearStorage() {
    localStorage.clear();
  }

  getAccessToken() {
    return {
      headers: new HttpHeaders({
        'access_token': localStorage.getItem('publisherToken'),
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
