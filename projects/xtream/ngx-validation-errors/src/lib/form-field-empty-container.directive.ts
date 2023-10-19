import {AfterContentInit, ContentChild, ContentChildren, Directive, DoCheck, ElementRef, EmbeddedViewRef, Inject, Input, Optional, QueryList, Renderer2, TemplateRef, ViewContainerRef, ViewRef} from '@angular/core';
import {AbstractControl, ControlContainer, FormControl, FormControlName, FormGroup, FormGroupDirective} from '@angular/forms';
import {VALIDATION_ERROR_CONFIG, ValidationErrorsConfig} from './error-validation-config';
import {MESSAGES_PROVIDER} from './injection-tokens';

export class ForFieldErrorsContext {
  constructor(public errors: string[]) {
  }
}

@Directive({
  selector: '[ngxValidationErrors]',
  // providers: [
  //   {
  //     provide: ControlContainer,
  //     useExisting: FormGroupDirective
  //   }
  // ]
})
export class FormFieldEmptyContainerDirective implements DoCheck, AfterContentInit {

  // tslint:disable-next-line:variable-name
  //@Input('ngxValidationErrors') formControlRef: AbstractControl;

  private formControlRef: AbstractControl;

  @Input() customErrorMessages: {} = {};
  @Input() messageParams: {} = {};
  @Input() validationDisabled = false;

  rootEl: any;

  public messages: string[];
  private validationContext;
  private context = {errors: [] as string[]};

  elementReference: ElementRef | null = null;

  constructor(
    private renderer: Renderer2,
    private viewContainer: ViewContainerRef,
    private template: TemplateRef<ForFieldErrorsContext>,
    @Optional() private formGroup: FormGroupDirective,
    @Optional() @Inject(MESSAGES_PROVIDER) private messageProvider: any,
    @Inject(VALIDATION_ERROR_CONFIG) private validationErrorsConfig: ValidationErrorsConfig,
    private elementRef: ElementRef) {

    this.validationContext = validationErrorsConfig.defaultContext;
    const nodes = this.viewContainer.createEmbeddedView(this.template, this.context);
    this.rootEl = nodes.rootNodes[0];

    // console.log('formControl:', this._formControl, 'input', this._input, 'elementRef', elementRef);

    //console.log('form', formGroup);

    this.elementReference = elementRef;
    let children = this.viewContainer;
    let elementChildren = elementRef.nativeElement.children;
    //console.log('viewContainer', this.viewContainer, this.elementRef, children, elementChildren, nodes, this.rootEl);

    let nodeChildren = this.rootEl.children;
    this.search(nodeChildren);

    console.log('finished searching: ', this.inputFound, this.inputName);
  }

  private inputFound = false;
  private inputName = '';

  search(nodes: HTMLCollection): any {
    for (let i = 0; i < nodes.length; i++) {
      const child = nodes[i];
      //console.log('searching ', child);
      
      if (child.tagName == 'INPUT') {
        this.inputFound = true;
        this.inputName = child.id;
        break;
      } else {
        this.search(child.children);
      }
    }
  }

  ngAfterContentInit(): void {
    //console.log('after', this._input2, this._input3);

    if (this.formGroup.control != null) {
      let formControl = this.formGroup.control.controls[this.inputName];
      this.formControlRef = formControl;
      console.log('formControl', formControl);
    }
  }

  ngDoCheck(): void {
    // console.log('ngDoCheck()', this.inputName);

    if (this.formControlRef != undefined) {
      // console.log('formControl:', this._formControl, 'input', this._input);
      let inputEl = this.elementRef.nativeElement;
      //console.log('viewContainer', this.viewContainer, this._input2);
      //console.log('viewContainer', this._input2, this._input3);

      let messages;
      const hasError = (!this.formControl.valid && this.formControl.touched) && !this.validationDisabled;
      console.log('ngDoCheck()', this.inputName, this.formControl, this.formControlName, hasError);

      if (hasError) {
        messages = Object.keys(this.formControl.errors || {}).map(error => {
          const fieldName = this.formControlName;
          const errorKey = `${fieldName}.errors.${error}`;
          const validationKey = `${this.validationContext}.${errorKey}`;
          
          if (this.messageProvider && this.messageProvider.instant(validationKey) === validationKey) {
            let errorMessage = `${this.validationErrorsConfig.defaultContext}.errors.${error}`;

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

        if (messages && messages.length > 0) {
          messages = [messages[0]];
        }
      }

      if ((messages && !this.messages) || (!messages && this.messages) || (messages && messages[0] !== this.messages[0])) {
        this.messages = messages;
        this.context.errors = messages;
        if (this.rootEl) {
          if (messages) {
            this.renderer.addClass(this.rootEl, 'has-error');
          } else {
            this.renderer.removeClass(this.rootEl, 'has-error');
          }
        }
      }
    }
  }

  public setValidationContext(context: string): void {
    this.validationContext = context;
  }

  setInnerValidation(innerValidation: boolean): void {
  }

  public clear() {
    this.formControl.reset();
    this.formControl.setErrors(null);
    this.messages = [];
    this.context.errors = undefined;
  }

  get formControl() {
    return this.formControlRef;
  }

  get formControlName(): string {
    // if (this.formControlRef['_parent'] instanceof FormGroup) {
    //   const form = this.formControlRef['_parent'] as FormGroup;
    //   const name = Object.keys(form.controls).find(k => form.controls[k] === this.formControlRef);

    //   return name;
    // }

    if (this.inputName != '') {
      return this.inputName;
    }
    
    return 'field';
  }

}
