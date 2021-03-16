import { Component } from '@angular/core';

import * as moment from 'moment-timezone';
import 'moment/locale/pt-br';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  default = { lat: "-19.9208" , lon: "-43.9378" };
  constructor() {
    moment.locale('pt-br');
  }
}
