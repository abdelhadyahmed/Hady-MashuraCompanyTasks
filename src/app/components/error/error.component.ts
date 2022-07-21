import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent {
  @Input('control')
  control: any;
  errorMsgList: any = [];

  errorMessage: any = {
    required: (params: any): string => `This field is required`,
    maxlength: (params: any): string =>
      `Maximum ${params.requiredLength} characters are allowed`,
    minlength: (params: any): string =>
      `Minimum ${params.requiredLength} characters are required`,
    pattern: (params: any): string =>
      `Invalid format, you should use only ${params.requiredPattern}`,
    email: (params: any): string => `Invalid Email`,
    canNotContainSpace: (params: any): string => `White spaces are not allowed`,
  };

  //   actualValue: "d"
  // requiredPattern: "^[0-9]$"
  listErrors() {
    if (!this.control) return [];
    if (this.control.errors) {
      this.errorMsgList = [];
      Object.keys(this.control.errors).map((error) => {
        this.control.touched || this.control.dirty
          ? this.errorMsgList.push(
              this.errorMessage[error](this.control.errors[error])
            )
          : '';
      });
      return this.errorMsgList;
    } else {
      return [];
    }
  }
}
