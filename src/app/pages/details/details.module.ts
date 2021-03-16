import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsPage } from './containers/details/details.page';
import { RouterModule } from '@angular/router';
import { DetailsGuard } from './services/details.guard.service';
import { detailsReducer } from './state/details.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DetailsEffects } from './state/details.effects';
import { DailyWeatherComponent } from './components/daily-weather/daily-weather.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  declarations: [DetailsPage, DailyWeatherComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: DetailsPage , canActivate: [DetailsGuard]}]),
    StoreModule.forFeature('details', detailsReducer),
    EffectsModule.forFeature([DetailsEffects]),
    ComponentsModule
  ],
  providers: [
    DetailsGuard
  ],
})
export class DetailsModule {}
