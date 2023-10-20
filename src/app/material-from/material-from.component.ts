import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import { ValidationContextComponent } from 'projects/xtream/ngx-validation-errors/src/public-api';
// import {ValidationContextComponent} from '@xtream/ngx-validation-errors';

@Component({
  selector: 'app-material-from',
  templateUrl: './material-from.component.html',
  styleUrls: ['./material-from.component.css']
})
export class MaterialFromComponent implements OnInit {
  
  @ViewChild('firstForm', {read: ValidationContextComponent, static: true}) validationContext?: ValidationContextComponent;

  heroForm: FormGroup;
  testForm: FormGroup;

  constructor(private translateService: TranslateService) {
    this.testForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      surname: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)])
    });

    this.heroForm = new FormGroup({
      name2: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      middleName2: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      surname2: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)])
    });
  }

  ngOnInit(): void {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  clearForm() {
    console.debug('this.validationContext', this.validationContext);
    
    if (this.validationContext != undefined) {
      this.validationContext.clear();
    }
  }
}