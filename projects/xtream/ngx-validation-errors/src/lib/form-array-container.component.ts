import {
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Optional,
  Renderer2
} from '@angular/core';
import {FormArray, FormArrayName} from '@angular/forms';
import {FormValidationContainer} from './form-validation-container';
import {MESSAGES_PROVIDER} from './injection-tokens';
import {VALIDATION_ERROR_CONFIG, ValidationErrorsConfig} from './error-validation-config';
import {Observable} from 'rxjs';

@Component({
  selector: '[ngxValidationErrorsArray], ngx-validation-errors-array, [formArrayContainer], form-array-container',
  template: `
      <ng-content></ng-content>
      <ng-container #errorsContainer></ng-container>
  `
})
export class FormArrayContainerComponent extends FormValidationContainer {

  @ContentChild(FormArrayName, {static: true}) _formControl?: FormArrayName;
  @ContentChild(FormArrayName, {read: ElementRef, static: true}) _el?: ElementRef;

  constructor(
    private _renderer: Renderer2,
    @Optional() @Inject(MESSAGES_PROVIDER) private _messageProvider: { instant(key: string): string; },
    @Inject(VALIDATION_ERROR_CONFIG) private  _validationErrorsConfig: ValidationErrorsConfig) {
    super(_renderer, _messageProvider, _validationErrorsConfig);
  }

  get formControl() {
    if (this._formControl != undefined) {
      return this._formControl.control;
    }

    return undefined;
  }

  get formControlName(): string | number | null {
    if (this._formControl != undefined) {
      return this._formControl.name!;
    }

    return null;
  }

  get statusChanges(): Observable<any> | undefined {
    if (this._formControl != undefined) {
      return this._formControl.control.statusChanges;
    }

    return undefined;
  }

  get el(): ElementRef<any> | undefined {
    return this._el;
  }
}