import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Units } from 'src/app/shared/models/units.enum';
import { CityWeather } from 'src/app/shared/models/weather.model';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentWeatherComponent implements OnInit {

  @Input() cityWeather: CityWeather;
  @Input() isFavorite: boolean;
  @Input() unit: Units;
  @Output() toggleBookmark = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  get cityName(): string{
    return `${this.cityWeather.city.name} ${this.cityWeather.city.country}`;
  }

  onToggleBookmark(): void{
    this.toggleBookmark.emit();
  }

}
