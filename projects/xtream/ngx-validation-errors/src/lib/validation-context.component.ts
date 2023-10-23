import {AfterContentInit, ChangeDetectorRef, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {FormFieldContainerComponent} from './form-field-container.component';
import {FormArrayContainerComponent} from './form-array-container.component';
import {FormFieldEmptyContainerDirective} from './form-field-empty-container.directive';

@Component({
  selector: '[validationContext]',
  template: '<ng-content></ng-content>'
})
export class ValidationContextComponent implements AfterContentInit {

  @Input() validationContext?: string;
  @Input() innerValidationError: boolean = false;

  @ContentChildren(FormFieldContainerComponent, {descendants: true}) fieldValidators?: QueryList<FormFieldContainerComponent>;
  @ContentChildren(FormArrayContainerComponent, {descendants: true}) arrayValidators?: QueryList<FormArrayContainerComponent>;
  @ContentChildren(FormFieldEmptyContainerDirective, {descendants: true}) directives?: QueryList<FormFieldEmptyContainerDirective>;

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngAfterContentInit(): void {
    if (this.fieldValidators != undefined) {
      this.fieldValidators.forEach(i => {
        if (this.validationContext != undefined) {
          i.setValidationContext(this.validationContext);
        }

        i.setInnerValidation(this.innerValidationError);
      });
    }

    if (this.arrayValidators != undefined) {
      this.arrayValidators.forEach(i => {
        if (this.validationContext != undefined) {
          i.setValidationContext(this.validationContext);
        }

        i.setInnerValidation(this.innerValidationError);
      });
    }

    if (this.directives != undefined) {
      this.directives.forEach(i => {
        if (this.validationContext != undefined) {
          i.setValidationContext(this.validationContext);
        }
      });
    }
  }

  public clear(): void {
    if (this.fieldValidators != undefined) {
      this.fieldValidators.forEach(v => {
        v.clear();
      });
    }

    if (this.arrayValidators != undefined) {
      this.arrayValidators.forEach(v => {
        v.clear();
      });
    }

    if (this.directives != undefined) {
      this.directives.forEach(v => {
        v.clear();
      });
    }

    this.cdRef.markForCheck();
  }
}