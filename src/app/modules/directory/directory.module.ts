import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryRoutingModule } from './directory-routing.module';
import { DirectoryComponent } from './directory.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxSocialShareModule } from 'ngx-social-share';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  imports: [
    CommonModule,
    DirectoryRoutingModule,
    NgxUiLoaderModule,
    NgxSpinnerModule,
    NgxSocialShareModule,
    ShareButtonsModule,
    MatMenuModule,
    MatIconModule
  ],
  declarations: [DirectoryComponent]
})
export class DirectoryModule { }
