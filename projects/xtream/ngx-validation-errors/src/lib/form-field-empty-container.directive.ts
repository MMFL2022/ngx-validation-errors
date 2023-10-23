import {AfterContentInit, Directive, DoCheck, Inject, Input, Optional, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
import {AbstractControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {VALIDATION_ERROR_CONFIG, ValidationErrorsConfig} from './error-validation-config';
import {MESSAGES_PROVIDER} from './injection-tokens';

export class ForFieldErrorsContext {
  constructor(
    public errors: string[],
    public params: {} = {}) {
  }
}

@Directive({
  selector: '[ngxValidationErrors]'
})
export class FormFieldEmptyContainerDirective implements DoCheck, AfterContentInit {

  @Input() customErrorMessages: {} = {};
  @Input() messageParams: {} = {};
  @Input() validationDisabled = false;

  public messages: string[] = [];

  private rootEl: any;
  private formControlRef?: AbstractControl;
  private inputName?: string;
  private validationContext;
  private context = {
    errors: [] as string[] | undefined,
    params: {} as object | undefined
  };

  constructor(
    private renderer: Renderer2,
    private viewContainer: ViewContainerRef,
    private template: TemplateRef<ForFieldErrorsContext>,
    @Optional() private formGroup: FormGroupDirective,
    @Optional() @Inject(MESSAGES_PROVIDER) private messageProvider: any,
    @Inject(VALIDATION_ERROR_CONFIG) private validationErrorsConfig: ValidationErrorsConfig) {

    this.validationContext = validationErrorsConfig.defaultContext;
    const nodes = this.viewContainer.createEmbeddedView(this.template, this.context);
    this.rootEl = nodes.rootNodes[0];

    this.search(this.rootEl.children);
  }

  search(nodes: HTMLCollection): any {
    for (let i = 0; i < nodes.length; i++) {
      const child = nodes[i];
      
      if (child.tagName == 'INPUT') {
        let childName = child.getAttribute('formControlName')
        if (childName != undefined) {
          this.inputName = childName;
        } else {
          this.inputName = child.id;
        }

        break;
      } else {
        if (this.inputName == undefined) {
          this.search(child.children);
        }
      }
    }
  }

  ngAfterContentInit(): void {
    if (this.formGroup.control != null && this.inputName != undefined) {
      this.formControlRef = this.formGroup.control.controls[this.inputName];
    }
  }

  ngDoCheck(): void {
    if (this.formControl != undefined) {
      let messages: string[] = [];
      const hasError = (!this.formControl.valid && this.formControl.touched) && !this.validationDisabled;

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
        this.context.params = this.messageParams;

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

  public clear() {
    if (this.formControl != undefined) {
      this.formControl.reset();
      //this.formControl.setErrors(null);
    }
    
    this.messages = [];
    this.context.errors = undefined;
    this.context.params = undefined;    
  }

  get formControl() {
    return this.formControlRef;
  }

  get formControlName(): string {
    if (this.formControlRef != undefined) {
      if (this.formControlRef['_parent'] instanceof FormGroup) {
        const form = this.formControlRef['_parent'] as FormGroup;
        const name = Object.keys(form.controls).find(k => form.controls[k] === this.formControlRef);
  
        if (name != undefined) {
          return name;
        }
      }
    }
    
    return 'field';
  }
}