import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tripmodal',
  templateUrl: './tripmodal.page.html',
  styleUrls: ['./tripmodal.page.scss'],
})
export class TripmodalPage implements OnChanges {
  @Input() steps: any;
  math = Math.floor;


  constructor() {
  }

  ngOnChanges() {
  }

}
