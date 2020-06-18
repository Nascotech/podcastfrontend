import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './default.component';



const defaultRoutes: Routes = [
  {
    // path: '',
    // component: DefaultComponent,
    // children: [
    //   { path: '', component: DefaultComponent}
    // ]
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(defaultRoutes)
  ],
  declarations: [ ]
})
export class DefaultRoutingModule { }