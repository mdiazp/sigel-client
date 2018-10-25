import { Component, Input } from '@angular/core';

import {
  Area,
} from '@app/models/core';

@Component({
  selector: 'app-area-profile',
  templateUrl: './area-profile.component.html',
  styleUrls: ['./area-profile.component.css']
})
export class AreaProfileComponent {

  @Input() area: Area;

  area_id: string;

  constructor() {}
}
