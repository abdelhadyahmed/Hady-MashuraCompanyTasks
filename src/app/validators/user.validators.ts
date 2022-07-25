import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UserValidators {
  static canNotContainSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value && (control.value as string).indexOf(' ') >= 0)
      return { canNotContainSpace: true };
    return null;
  }
}
