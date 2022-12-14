import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
// import { HomeComponent } from './modules/home/home.component';
// import { DirectoryComponent } from './modules/directory/directory.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: DefaultComponent,
//     children: [{
//       path: '',
//       component: HomeComponent
//     }]
//   },
//   {
//     path: 'directory/:id',
//     component: DefaultComponent,
//     children: [{
//       path: '',
//       component: DirectoryComponent
//     }]
//   }
// ];

@NgModule({
  imports: [RouterModule.forRoot([])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
