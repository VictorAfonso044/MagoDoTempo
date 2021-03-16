import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { Bookmark } from 'src/app/shared/models/bookmark.model';
import * as fromBookmarksSelectors from '../state/bookmarks.selectors';
import * as fromBookmarksActions from '../state/bookmarks.actions';
import { FormControl } from '@angular/forms';
import { CityTypeaheadItem } from 'src/app/shared/models/city-typeahead-item.model';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit, OnDestroy {
  bookmarks$: Observable<Bookmark[]>;
  private componentDestroyed$ = new Subject();
  searchTypeaheadControl = new FormControl(undefined);
  constructor(private store: Store) {
    this.bookmarks$ = this.store.pipe(
      select(fromBookmarksSelectors.selectBookmarksList)
    );
  }
  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.searchTypeaheadControl.valueChanges
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe((value: CityTypeaheadItem) =>{
      this.store.dispatch(fromBookmarksActions.toggleBookmarById({ id: value.geonameid }));
    });
  }

  removeBookmark(id: number): void {
    this.store.dispatch(fromBookmarksActions.removeBookmark({ id }));
  }
}
