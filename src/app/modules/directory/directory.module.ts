import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryRoutingModule } from './directory-routing.module';
import { DirectoryComponent } from './directory.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    DirectoryRoutingModule,
    NgxUiLoaderModule,
    NgxSpinnerModule,
  ],
  declarations: [DirectoryComponent]
})
export class DirectoryModule { }
