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
  heroForm2: FormGroup;
  heroForm3: FormGroup;
  anotherForm: FormGroup;

  @ViewChild('firstForm', {read: ValidationContextComponent, static: true}) validationContext?: ValidationContextComponent;
  @ViewChild('secondForm', {read: ValidationContextComponent, static: true}) validationContext2?: ValidationContextComponent;
  @ViewChild('thirdForm', {read: ValidationContextComponent, static: true}) anotherValidationContext?: ValidationContextComponent;

  constructor(private translateService: TranslateService) {
    this.heroForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(8), Validators.pattern('[a-zA-Z]+')]),
      surname: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(8), Validators.pattern('[a-zA-Z]+')])
    });

    this.heroForm2 = new FormGroup({
      name2: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(9), Validators.pattern('[a-zA-Z0-9]+')]),
      surname2: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(9), Validators.pattern('[a-zA-Z0-9]+')])
    });

    this.heroForm3 = new FormGroup({
      name3: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(9), Validators.pattern('[a-zA-Z0-9]+')]),
      surname3: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(9), Validators.pattern('[a-zA-Z0-9]+')])
    });
    
    this.anotherForm = new FormGroup({
      anotherName: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(10), Validators.pattern('[a-zA-Z0-9 ]+')]),
      anotherSurname: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(10), Validators.pattern('[a-zA-Z0-9 ]+')])
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

    if (this.validationContext2 != undefined) {
      this.validationContext2.clear();
    }

    this.heroForm3.reset();

    if (this.anotherValidationContext != undefined) {
      this.anotherValidationContext.clear();
    }
  }
}
