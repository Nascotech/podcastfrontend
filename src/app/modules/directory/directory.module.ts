import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryRoutingModule } from './directory.routing.module';
import { SharedModule } from 'src/app/shared/component/shared.module';
import { HeaderComponent } from 'src/app/shared/component/header/header.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DirectoryRoutingModule,
    SharedModule,
    
  ]
})
export class DirectoryModule { }
