import {HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
// import 'rxjs/add/operator/do';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // if (req.headers.get('No-Auth') === 'True') {
    //   return next.handle(req.clone());
    // }

    // if (localStorage.getItem('accesstoken') != null) {
    //   req = req.clone({
    //     setHeaders: {
    //       'httpx-thetatech-accesstoken': `${JSON.parse(localStorage.getItem('accesstoken'))}`
    //     }
    //   });
    // } else {
    //   this.router.navigate(['/']);
    // }
    return next.handle(req);
  }
}
