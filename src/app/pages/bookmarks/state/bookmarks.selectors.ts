import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookmarksState } from './bookmarks.reducer';

export const selectBookmarState = createFeatureSelector('bookmarks');

export const selectBookmarksList = createSelector(
  selectBookmarState,
  (bookmarkState: BookmarksState) => bookmarkState.list
);

