import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import { ValidationContextComponent } from 'projects/xtream/ngx-validation-errors/src/public-api';
// import {ValidationContextComponent} from '@xtream/ngx-validation-errors';
import {distinctUntilChanged, tap} from 'rxjs/operators';

function minCheckSelected(size: number) {
  return (control: AbstractControl) => {
    const values = control.value as (boolean | undefined)[];
    const selected = values.filter(v => !!v).length;
    if (selected < size) {
      return {checkBoxes: true};
    }
    return null;
  };
}

@Component({
  selector: 'app-lazy-form',
  templateUrl: './lazy-form.component.html',
  styleUrls: ['./lazy-form.component.css']
})
export class LazyFormComponent implements OnInit {

  @ViewChild('firstForm', {
    read: ValidationContextComponent,
    static: true
  }) validationContext: ValidationContextComponent;

  heroForm: FormGroup;

  boxesInfo = [
    'a',
    'b',
    'c',
    'd'
  ];

  constructor(private translateService: TranslateService) {
    this.heroForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      surname: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
      checkBoxes: new FormArray(this.boxesInfo.map(a => new FormControl()), [minCheckSelected(1)]),
      name2: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      surname2: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)])
    });

    this.heroForm.valueChanges.pipe(
      distinctUntilChanged(),
      tap(v => {
        console.debug('v', v);
        if (v.name) {
          this.heroForm.controls['surname2'].enable({emitEvent: false});
        } else {
          this.heroForm.controls['surname2'].disable({emitEvent: false});
        }
      })
    ).subscribe()
  }

  ngOnInit(): void {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  clearForm() {
    console.debug('this.validationContext', this.validationContext);
    this.validationContext.clear();

  }

  chooseLanguage(lan: string) {
    this.translateService.use(lan);
  }
}