import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { HomePage } from './containers/home/home.page';
import { HomeEffects } from './state/Home.efects';
import { HomeReducer } from './state/home.reducer';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { RouterModule } from '@angular/router';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { UnitSelectorComponent } from './containers/unit-selector/unit-selector.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature('home', HomeReducer),
    EffectsModule.forFeature([HomeEffects]),
    ComponentsModule,
  ],
  declarations: [
    HomePage,
    CurrentWeatherComponent,
    UnitSelectorComponent,
    // UnitSelectorComponent,
  ],
})
export class HomeModule { }
