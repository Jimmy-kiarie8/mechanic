import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MechanicPage } from './mechanic.page';

const routes: Routes = [
  {
    path: '',
    component: MechanicPage
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MechanicPageRoutingModule {}
