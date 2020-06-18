import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryModule } from './directory/directory.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from '../shared/component/shared.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DirectoryModule,
    HomeModule,
    
  ]
})
export class ModulesModule { }
