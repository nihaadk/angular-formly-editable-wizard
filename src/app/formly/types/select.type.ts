import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { Select } from '@openng/optimus-ui/select';

@Component({
  selector: 'app-select-type',
  imports: [ReactiveFormsModule, Select],
  template: `<p-select class="w-full" styleClass="w-full" [inputId]="id" [options]="$any(props.options)"
    optionLabel="label" optionValue="value" [placeholder]="props.placeholder ?? ''"
    [ariaLabel]="props.label" [formControl]="formControl" [invalid]="showError" />`
})
export class SelectType extends FieldType<FieldTypeConfig> {}
