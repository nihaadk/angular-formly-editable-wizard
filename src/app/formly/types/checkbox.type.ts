import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { Checkbox } from '@openng/optimus-ui/checkbox';

@Component({
  selector: 'app-checkbox-type',
  imports: [ReactiveFormsModule, Checkbox],
  template: `<div class="flex items-center gap-2">
    <p-checkbox [inputId]="id" [binary]="true" [formControl]="formControl" [invalid]="showError" />
    <label [for]="id">{{ props.label }}</label>
  </div>`
})
export class CheckboxType extends FieldType<FieldTypeConfig> {}
