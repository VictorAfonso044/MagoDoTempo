import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Bookmark } from 'src/app/shared/models/bookmark.model';
import { CityTypeaheadItem } from 'src/app/shared/models/city-typeahead-item.model';
import { CityWeather } from 'src/app/shared/models/weather.model';
import { ComponentPortal, DomPortalOutlet, PortalOutlet } from '@angular/cdk/portal';
import * as fromBookmarksSelectors from '../../../bookmarks/state/bookmarks.selectors';
import * as fromHomeActions from '../../state/home.actions';
import * as fromHomeSelectors from '../../state/home.selectors';
import * as fromConfigSelectors from '../../../../shared/state/config/config.selectors';
import { UnitSelectorComponent } from '../unit-selector/unit-selector.component';
import { Units } from 'src/app/shared/models/units.enum';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  text: string;
  cityWeather: CityWeather;
  cityWeather$: Observable<CityWeather>;
  loadingWeather$: Observable<boolean>;
  errorWeather$: Observable<boolean>;

  bookmarksList$: Observable<Bookmark[]>;
  isCurrentFavorite$: Observable<boolean>;
  unit$: Observable<Units>;

  searchControl: FormControl;
  searchControlAutoComplete: FormControl;
  private componentDestroyed$ = new Subject();
  private portalOutlet: PortalOutlet;
  constructor(
    private store: Store,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
    this.store.dispatch(fromHomeActions.clearHomeState());
    this.portalOutlet.detach();
  }

  ngOnInit(): void {
    this.searchControl = new FormControl('', Validators.required);
    this.searchControlAutoComplete = new FormControl(undefined);
    this.searchControlAutoComplete.valueChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value: CityTypeaheadItem) => {
        if (!!value) {
          this.store.dispatch(
            fromHomeActions.loadCurrrentWeatherByid({
              id: value.geonameid.toString(),
            })
          );
        }
      });
    this.cityWeather$ = this.store.pipe(
      select(fromHomeSelectors.selectCurrentWeather)
    );
    this.cityWeather$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value) => (this.cityWeather = value));
    this.loadingWeather$ = this.store.pipe(
      select(fromHomeSelectors.selectCurrentWeatherLoading)
    );
    this.errorWeather$ = this.store.pipe(
      select(fromHomeSelectors.selectCurrentWeatherError)
    );
    this.bookmarksList$ = this.store.pipe(
      select(fromBookmarksSelectors.selectBookmarksList)
    );

    this.isCurrentFavorite$ = combineLatest([
      this.cityWeather$,
      this.bookmarksList$,
    ]).pipe(
      map(([current, bookmarksList]) => {
        if (!!current) {
          return bookmarksList.some(
            (bookmark) => bookmark.id === current.city.id
          );
        }
        return false;
      })
    );
    this.unit$ = this.store.pipe(select(fromConfigSelectors.selectUnitConfig));
    this.setupPortal();
  }

  doSearch(): void {
    const query = this.searchControl.value;
    this.store.dispatch(fromHomeActions.loadCurrrentWeather({ query }));
  }
  onToggleBookmark(): void {
    const bookmark: Bookmark = new Bookmark();
    bookmark.id = this.cityWeather.city.id;
    bookmark.name = this.cityWeather.city.name;
    bookmark.country = this.cityWeather.city.country;
    bookmark.coord = this.cityWeather.city.coord;
    this.store.dispatch(fromHomeActions.toogleBookmark({ entity: bookmark }));
  }
  private setupPortal(): void {
    const el = document.querySelector('#navbar-portal-outlet');
    this.portalOutlet = new DomPortalOutlet(
      el,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
    this.portalOutlet.attach(new ComponentPortal(UnitSelectorComponent));
  }
}
