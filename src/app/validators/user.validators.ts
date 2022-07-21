import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UserValidators {
  static canNotContainSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value && (control.value as string).indexOf(' ') >= 0)
      return { canNotContainSpace: true };
    return null;
  }

  static shouldBeUnique(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if ((control.value as string) == 'Hady')
          resolve({ shouldBeUnique: true });
        else resolve(null);
      }, 2000);
    });
  }
}
