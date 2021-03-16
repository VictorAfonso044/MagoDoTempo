import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Units } from '../models/units.enum';
import { CityDailyWeather, CityWeather } from '../models/weather.model';
import { AppState } from '../state/app.reducer';
import * as fromConfigSelectors from '../state/config/config.selectors';
import {
  responseToCityDailyWeather,
  responseToCityWeather,
} from '../utils/response.utils';

@Injectable({
  providedIn: 'root',
})
export class WeatherService implements OnDestroy {
  private serviceDestroyed$ = new Subject();
  private units: Units;
  constructor(private http: HttpClient, private store: Store<AppState>) {
    store
      .pipe(
        select(fromConfigSelectors.selectUnitConfig),
        takeUntil(this.serviceDestroyed$)
      )
      .subscribe((unit: Units) => (this.units = unit));
  }

  ngOnDestroy(): void {
    this.serviceDestroyed$.next();
    this.serviceDestroyed$.unsubscribe();
  }

  getCityWeatherByQuery(query: string): Observable<CityWeather> {
    const params = new HttpParams({ fromObject: { q: query } });
    return this.doGet('weather', params).pipe(
      map((response) => responseToCityWeather(response))
    );
  }
  getCityWeatherById(id: string): Observable<CityWeather> {
    const params = new HttpParams({ fromObject: { id } });
    return this.doGet<any>('weather', params).pipe(
      map((response) => responseToCityWeather(response))
    );
  }

  getCityWeatherByCoord(lat: number, lon: number): Observable<CityWeather> {
    const params = new HttpParams({
      fromObject: {
        lat: lat.toString(),
        lon: lon.toString(),
      },
    });
    return this.doGet<any>('weather', params).pipe(
      map((response) => responseToCityWeather(response))
    );
  }

  getWeatherDetails(lat: number, lon: number): Observable<CityDailyWeather> {
    const params = new HttpParams({
      fromObject: {
        lat: lat.toString(),
        lon: lon.toString(),
        exclude: 'minutely,hourly',
      },
    });
    return this.doGet<any>('onecall', params).pipe(
      map((response) => responseToCityDailyWeather(response))
    );
  }

  private doGet<T>(url: string, params: HttpParams): Observable<T> {
    params = params.append('appid', environment.apiKey);
    params = params.append('lang', 'pt_br');
    if (this.units !== Units.SI) {
      params = params.append('units', this.units.toLocaleLowerCase());
    }
    return this.http.get<T>(`https://api.openweathermap.org/data/2.5/${url}`, {
      params,
    });
  }
}
