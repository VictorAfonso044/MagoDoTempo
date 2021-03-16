import { createAction, props } from '@ngrx/store';
import { Bookmark } from 'src/app/shared/models/bookmark.model';

export const loadCurrrentWeather = createAction(
  '[Home] Load Currrent Weather',
  props<{ query: string }>()
);
export const loadCurrrentWeatherByid = createAction(
  '[Home] Load Current Weather By Id',
  props<{ id: string }>(),
);

export const loadCurrrentWeatherSuccess = createAction(
  '[Wheather API] Load Currrent Weather Success',
  props<{ entity: any }>()
);

export const loadCurrrentWeatherFail = createAction(
  '[Wheather API] Load Currrent Weather Failed'
);

export const toogleBookmark = createAction(
  '[Home] Toggle bookmark',
  props<{ entity: Bookmark }>()
);

export const clearHomeState = createAction('[Home] Clear Home State');
