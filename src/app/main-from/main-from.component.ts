import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import { ValidationContextComponent } from 'projects/xtream/ngx-validation-errors/src/public-api';
// import {ValidationContextComponent} from '@xtream/ngx-validation-errors';

@Component({
  selector: 'app-main-from',
  templateUrl: './main-from.component.html',
  styleUrls: ['./main-from.component.css']
})
export class MainFromComponent implements OnInit {

  heroForm: FormGroup;
  anotherForm: FormGroup;
  @ViewChild('firstForm', {read: ValidationContextComponent, static: true}) validationContext?: ValidationContextComponent;
  @ViewChild('anotherForm', {read: ValidationContextComponent, static: true}) anotherValidationContext?: ValidationContextComponent;

  constructor(private translateService: TranslateService) {
    this.heroForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      surname: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
      name2: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      surname2: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)])
    });
    
    this.anotherForm = new FormGroup({
      anotherName: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      anotherSurname: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)])
    });
  }

  ngOnInit(): void {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  reset(): void {
    if (this.validationContext != undefined) {
      this.validationContext.clear();
    }

    if (this.anotherValidationContext != undefined) {
      this.anotherValidationContext.clear();
    }
  }
}
