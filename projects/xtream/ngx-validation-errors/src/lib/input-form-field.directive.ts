import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: '[ngxValidationInput]'
})
export class InputFormFieldDirective {
  
  constructor(public  elementRef: ElementRef) {}
}