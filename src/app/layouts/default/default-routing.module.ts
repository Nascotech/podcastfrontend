import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './default.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', loadChildren: () => import('../../modules/home/home.module').then(m => m.HomeModule) },
      { path: 'directory/:slug', loadChildren: () => import('../../modules/directory/directory.module').then(m => m.DirectoryModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
