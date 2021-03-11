import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IImageLoaderOptions, NgxProgressiveImageLoaderModule } from 'ngx-progressive-image-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/component/shared.module';
import { DefaultComponent } from './default.component';
import { CoreModule } from '../../core/core.module';
import { ServicesModule } from '../../services/services.module';
import { AuthInterceptor } from '../../core/interceptor/auth.interceptor';
import { ErrorInterceptor } from '../../core/interceptor/error.interceptor';
import {DefaultRoutingModule} from './default-routing.module';
import { BrowserModule, Title }  from '@angular/platform-browser';
import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import {environment} from 'src/environments/environment';

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: document.location.origin
  },
  palette: {
    popup: {
      background: '#cfd5d8'
    },
    button: {
      background: 'var(--primary-color)'
    }
  },
  content:{
    message: 'This media player\'s features are powered by cookies. We use the data stored in cookies to keep track of what you\'ve listened to. We also use your IP address to work out roughly where you are. This data helps us provide the core media player service, and to better understand your radio listening patterns so that we can improve your radio experience.',
    link: "",
  },
  position: "bottom",
  theme: "classic",
  type: 'opt-out'
};

@NgModule({
  declarations: [
    DefaultComponent
  ],
  imports: [
    NgcCookieConsentModule.forRoot(cookieConfig),
    CommonModule,
    DefaultRoutingModule,
    RouterModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    SharedModule,
    ServicesModule,
    BrowserModule,
    NgxProgressiveImageLoaderModule.forRoot(<IImageLoaderOptions>{
      // rootMargin must be specified in pixels or percent
      rootMargin: '30px',
      threshold: 0.1,
      // css filter
      filter: 'blur(3px) drop-shadow(0 0 0.75rem crimson)',
      // image width / height ratio for image holder
      imageRatio: 16 / 9,
      // loading image in placeholder. Can be URL or base64
      placeholderImageSrc:
        // tslint:disable-next-line:max-line-length
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICA8cGF0aCBmaWxsPSIjZGQwMDMxIiBkPSJNMTI1IDMwTDMxLjkgNjMuMmwxNC4yIDEyMy4xTDEyNSAyMzBsNzguOS00My43IDE0LjItMTIzLjF6Ii8+CiAgPHBhdGggZmlsbD0iI2MzMDAyZiIgZD0iTTEyNSAzMHYyMi4yLS4xVjIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMUwxMjUgMzB6Ii8+CiAgPHBhdGggZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPgo='
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    Title
  ]
})
export class DefaultModule { }
