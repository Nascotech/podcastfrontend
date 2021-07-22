import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryRoutingModule } from './directory-routing.module';
import { DirectoryComponent } from './directory.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxSocialShareModule } from 'ngx-social-share';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import {ShareIconsModule} from 'ngx-sharebuttons/icons';
@NgModule({
  imports: [
    CommonModule,
    DirectoryRoutingModule,
    NgxUiLoaderModule,
    NgxSpinnerModule,
    NgxSocialShareModule,
    ShareButtonsModule,
    ShareIconsModule
  ],
  declarations: [DirectoryComponent]
})
export class DirectoryModule { }
