import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripmodalPageRoutingModule } from './tripmodal-routing.module';

import { TripmodalPage } from './tripmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripmodalPageRoutingModule
  ],
  declarations: [TripmodalPage]
})
export class TripmodalPageModule {}
