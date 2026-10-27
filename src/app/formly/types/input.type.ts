import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { InputText } from '@openng/optimus-ui/inputtext';

@Component({
  selector: 'app-input-type',
  imports: [ReactiveFormsModule, InputText],
  template: `<input pInputText class="w-full" [id]="id" [type]="props.type ?? 'text'"
    [formControl]="formControl" [attr.aria-required]="props.required"
    [attr.aria-invalid]="showError" [attr.aria-describedby]="showError ? id + '-error' : null" />`
})
export class InputType extends FieldType<FieldTypeConfig> {}
