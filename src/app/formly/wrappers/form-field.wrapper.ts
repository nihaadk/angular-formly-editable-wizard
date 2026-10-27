import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-form-field-wrapper',
  template: `
    <div class="flex flex-col gap-1.5 mb-4">
      @if (props.label && field.type !== 'checkbox') {
        <label [for]="id" class="font-medium text-sm">
          {{ props.label }}@if (props.required) {<span aria-hidden="true"> *</span>}
        </label>
      }
      <ng-container #fieldComponent />
      @if (showError) {
        <small class="text-red-700" role="alert" [id]="id + '-error'">
          @if (formControl.errors?.['required']) { Dieses Feld ist erforderlich. }
          @else if (formControl.errors?.['pattern'] || formControl.errors?.['email']) { Ungültiges Format. }
          @else if (formControl.errors?.['min'] || formControl.errors?.['max']) { Wert außerhalb des erlaubten Bereichs. }
          @else { Ungültige Eingabe. }
        </small>
      }
    </div>
  `
})
export class FormFieldWrapper extends FieldWrapper {}
