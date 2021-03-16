import { Action, createReducer, on } from '@ngrx/store';
import * as fromHomeActions from './home.actions';

export interface HomeState {
  entity: any;
  loading: boolean;
  error: boolean;
}

export const homeInitialState: HomeState = {
  entity: undefined,
  loading: false,
  error: false,
};

const reducer = createReducer(
  homeInitialState,
  on(fromHomeActions.clearHomeState, () => homeInitialState),
  on(fromHomeActions.loadCurrrentWeather,
    fromHomeActions.loadCurrrentWeatherByid, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),
  on(fromHomeActions.loadCurrrentWeatherSuccess, (state, { entity }) => ({
    ...state,
    entity,
    loading: false,
  })),
  on(fromHomeActions.loadCurrrentWeatherFail, (state) => ({
    ...state,
    error: true,
    loading: false,
  }))
);

export function HomeReducer(state: HomeState | undefined, action: Action) {
  return reducer(state, action);
}
