import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './spinner/spinner.component';
import { ControlMessagesComponent } from './control-messages/control-messages.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LeadAddbannerComponent } from './lead-addbanner/lead-addbanner.component';
import { PodcastComponent } from './podcast/podcast.component';
import { SearchPipe } from 'src/app/pipe/search.pipe';
import { NgxProgressiveImageLoaderModule } from 'ngx-progressive-image-loader';
import { NgxSpinnerModule } from 'ngx-spinner';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    NgxProgressiveImageLoaderModule,
    NgxSpinnerModule
 
  ],
  declarations: [ControlMessagesComponent,SearchPipe, SpinnerComponent, FooterComponent, HeaderComponent, SidebarComponent, LeadAddbannerComponent, PodcastComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ControlMessagesComponent,
    SpinnerComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LeadAddbannerComponent,
    PodcastComponent
  ]
})
export class SharedModule {}