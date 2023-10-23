import {AbstractControl, FormControlStatus} from '@angular/forms';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

function wrapMethod(subject$: Subject<void>, name: string, control: AbstractControl) {

  const prevMethod = control[name];

  // let prevMethod = control.get(name)?.value;

  function wrappedMethod(...args: any) {
    prevMethod.bind(control)(...args);
    subject$.next();
  }

  // prevMethod = wrappedMethod;
  control[name] = wrappedMethod;
}

export function toChangeObservable(control: AbstractControl): Observable<void | FormControlStatus> {
  const touchedChanges$ = new Subject<void>();

  wrapMethod(touchedChanges$, 'markAsTouched', control);
  wrapMethod(touchedChanges$, 'markAsUntouched', control);
  wrapMethod(touchedChanges$, 'markAsDirty', control);
  wrapMethod(touchedChanges$, 'markAsPristine', control);

  const obs = merge(touchedChanges$, control.statusChanges);

  return obs.pipe(
    debounceTime(100)
  );
}