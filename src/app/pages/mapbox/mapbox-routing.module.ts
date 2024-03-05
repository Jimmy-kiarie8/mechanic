import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapboxPage } from './mapbox.page';

const routes: Routes = [
  {
    path: '',
    component: MapboxPage
  },
  {
    path: 'tripmodal',
    loadChildren: () => import('./tripmodal/tripmodal.module').then( m => m.TripmodalPageModule)
  },
  {
    path: 'request',
    loadChildren: () => import('./request/request.module').then( m => m.RequestPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapboxPageRoutingModule {}
