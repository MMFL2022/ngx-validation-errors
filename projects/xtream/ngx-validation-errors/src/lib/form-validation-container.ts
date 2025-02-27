import {
  AfterContentInit,
  Component,
  ComponentRef,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {VALIDATION_ERROR_CONFIG, ValidationErrorsConfig} from './error-validation-config';
import {AbstractControl} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {toChangeObservable} from './toChangeObservable';
import { MESSAGES_PROVIDER } from './injection-tokens';

@Component({
  template: ''
})
export abstract class FormValidationContainer implements AfterContentInit, OnDestroy {

  @Input() customErrorMessages: {} = {};
  @Input() messageParams: {} = {};
  @Input() validationDisabled = false;
  @Input() innerValidationError: boolean = false;

  @ViewChild('errorsContainer', {read: ViewContainerRef, static: true}) errorsContainer?: ViewContainerRef;

  public messages: string[] = [];

  @HostBinding('class.has-error')
  public hasErrors: boolean = false;

  @HostBinding('class.has-success')
  public hasSuccess: boolean = false;

  private validationContext;
  private componentRef?: ComponentRef<any>;
  private subscription?: Subscription;

  constructor(
    private renderer: Renderer2,
    @Optional() @Inject(MESSAGES_PROVIDER) private messageProvider: { instant(key: string): string; },
    @Inject(VALIDATION_ERROR_CONFIG) private validationErrorsConfig: ValidationErrorsConfig) {
    this.validationContext = validationErrorsConfig.defaultContext;
  }

  ngAfterContentInit(): void {
    this.addErrorComponent();

    if (this.formControl != undefined) {
      this.subscription = toChangeObservable(this.formControl).subscribe(value => {
        this.checkErrors();
        this.checkSuccess();
        this.updateErrorComponent();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  addErrorComponent() {
    if (this.errorsContainer && !this.componentRef) {
      this.errorsContainer.clear();
      this.componentRef = this.errorsContainer.createComponent(this.validationErrorsConfig.errorComponent as any);
    }
  }

  updateErrorComponent() {
    if (this.componentRef) {
      this.componentRef.instance.innerValidationError = this.innerValidationError;
      this.componentRef.instance.messages = this.messages;
      this.componentRef.instance.params = this.messageParams;
    }
  }

  checkErrors() {
    if (this.formControl != undefined) {
      //const hasError = (!this.formControl.valid && this.formControl.dirty && this.formControl.touched) && !this.validationDisabled;
      const hasError = (!this.formControl.valid && this.formControl.touched) && !this.validationDisabled;
      //console.log('checkErrors', this.formControl, this.formControl.valid, this.formControl.touched, (!this.formControl.valid && this.formControl.touched), this.validationDisabled, hasError);
  
      if (hasError && this.el != undefined && this.el.nativeElement != undefined) {
        this.messages = Object.keys(this.formControl.errors || {}).map(error => {
          const fieldName = this.formControlName;
          const errorKey = `validation.${fieldName}.${error}`;
          const validationKey = `${this.validationContext}.${errorKey}`;
  
          if (this.messageProvider && this.messageProvider.instant(validationKey) === validationKey) {
            let errorMessage = `${this.validationErrorsConfig.defaultContext}.validation.${error}`;

            return errorMessage;
          } else {
            return validationKey;
          }
        });
  
        const params = Object.values(this.formControl.errors || {}).reduce((a, b) => {
          a = {...a, ...b};
          return a;
        }, {});
  
        this.messageParams = this.messageParams ? {...this.messageParams, ...params} : params;
  
        if (this.messages && this.messages.length > 0) {
          this.messages = [this.messages[0]];
        }
  
        try {
          this.renderer.removeClass(this.el.nativeElement, 'is-valid');
        } catch (e) {
        }
  
        this.renderer.addClass(this.el.nativeElement, 'is-invalid');
      }
  
      this.hasErrors = hasError;
    }
  }

  checkSuccess(): void {
    if (this.formControl != undefined) {
      const hasSuccess = (this.formControl.valid && this.formControl.dirty && this.formControl.touched) && !this.validationDisabled;
  
      if (hasSuccess && this.el && this.el.nativeElement) {
        this.messages = [];
  
        try {
          this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
        } catch (e) {
        }
      }
  
      this.hasSuccess = hasSuccess;
    }
  }

  public setValidationContext(context: string): void {
    this.validationContext = context;
  }

  public setInnerValidation(innerValidation: boolean): void {
    this.innerValidationError = innerValidation;
  }

  abstract get formControl(): AbstractControl | undefined;

  abstract get statusChanges(): Observable<any> | undefined;

  abstract get formControlName(): string | number | null;

  abstract get el(): ElementRef | undefined;

  public clear() {
    if (this.formControl != undefined) {
      this.formControl.reset();
      //this.formControl.setErrors(null);
    }

    if (this.el != undefined) {
      this.renderer.removeClass(this.el.nativeElement, 'is-valid');
      this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
    }

    this.messages = [];
  }
}