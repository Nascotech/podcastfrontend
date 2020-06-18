import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DirectoryComponent } from './directory.component';



const directoryRoutes: Routes = [
  // {path: 'directory/:id', component: DirectoryComponent}
  
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(directoryRoutes)
  ],
  declarations: [DirectoryComponent ]
})
export class DirectoryRoutingModule { } 