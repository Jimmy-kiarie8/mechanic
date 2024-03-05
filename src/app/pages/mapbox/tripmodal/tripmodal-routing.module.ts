import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripmodalPage } from './tripmodal.page';

const routes: Routes = [
  {
    path: '',
    component: TripmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripmodalPageRoutingModule {}
