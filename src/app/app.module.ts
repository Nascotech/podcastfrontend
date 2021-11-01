import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { AppRoutingModule } from './app-routing.module';
import {PreloadAllModules, RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { DefaultModule } from './layouts/default/default.module';
import { HttpClientModule} from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
  //  AppRoutingModule,
    RouterModule.forRoot([]),
    DefaultModule,
    HttpClientModule,
    ClipboardModule,
    BrowserAnimationsModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule

  ],
  providers: [ConfirmDialogService],
  entryComponents: [ConfirmDialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
