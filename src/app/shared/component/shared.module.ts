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
import { NgxProgressiveImageLoaderModule } from 'ngx-progressive-image-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PlayerComponent } from './player/player.component';
import { FiltersComponent } from './filters/filters.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    NgxProgressiveImageLoaderModule,
    NgxSpinnerModule,
    NgbModule,
    MatDialogModule,
  ],
  declarations: [
    ControlMessagesComponent,
    SpinnerComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    LeadAddbannerComponent,
    PlayerComponent,
    FiltersComponent,
    ConfirmDialogComponent
  ],
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
    PlayerComponent,
    FiltersComponent,
    ConfirmDialogComponent
  ],
  entryComponents: [ConfirmDialogComponent],
})
export class SharedModule {}
