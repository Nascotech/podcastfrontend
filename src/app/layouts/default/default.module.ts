import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/component/shared.module';
import { DefaultComponent } from './default.component';
import { DefaultRoutingModule } from './default.routing.module';


@NgModule({
  declarations: [
    DefaultComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    
  ],
  exports: [RouterModule]
})
export class DefaultModule { }
