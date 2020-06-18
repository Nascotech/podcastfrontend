import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CoreHttpService } from './core-http.service';
import { HttpClientModule } from '@angular/common/http';
import { PodcastService } from './podcast.service';



@NgModule({
  imports: [

   HttpClientModule
  ],
  declarations: [
  
  ],
  providers: [CoreHttpService,PodcastService]
})
export class ServicesModule {
}