import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
// import {NgxValidationErrorsModule} from '@xtream/ngx-validation-errors';
import {FormSubmitDirective} from './form-submit.directive';
import { NgxValidationErrorsModule } from 'projects/xtream/ngx-validation-errors/src/public-api';

@NgModule({
  declarations: [
    FormSubmitDirective
  ],
  imports: [
    NgxValidationErrorsModule
  ],
  exports: [
    TranslateModule,
    NgxValidationErrorsModule,
    CommonModule,
    FormSubmitDirective
  ]
})
export class SharedModule {}