import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable, Subscriber } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CityTypeaheadItem } from '../../models/city-typeahead-item.model';
import { CitiesService } from '../../services/cities.service';

@Component({
  selector: 'app-cities-typeahead',
  templateUrl: './cities-typeahead.component.html',
  styleUrls: ['./cities-typeahead.component.scss'],
})
export class CitiesTypeaheadComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = "Pesquisar cidade";
  dataSource$: Observable<CityTypeaheadItem[]>;
  search: string;

  loading: boolean;
  disabled: boolean;
  private onChange: (value: CityTypeaheadItem) => void;
  private onTouched: () => void;

  constructor(
    private citiesService: CitiesService,
    @Optional() @Self() public control: NgControl
  ) {
    control.valueAccessor = this;
  }

  ngOnInit(): void {
    this.dataSource$ = new Observable((subscriber: Subscriber<string>) =>
      subscriber.next(this.search)
    ).pipe(switchMap((query: string) => this.citiesService.getCities(query)));
  }

  onSelected(match: TypeaheadMatch): void {
    this.onTouched();
    this.onChange(match.item);
  }

  registerOnChange(fn: (value: CityTypeaheadItem) => void): void{
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void{
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(): void {}
}
