import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { InputNumber } from '@openng/optimus-ui/inputnumber';

@Component({
  selector: 'app-number-type',
  imports: [ReactiveFormsModule, InputNumber],
  template: `<p-inputnumber styleClass="w-full" class="w-full" [inputId]="id" [formControl]="formControl"
    [min]="props.min ?? null" [max]="props.max ?? null" [useGrouping]="$any(props)['useGrouping'] ?? true" />`
})
export class NumberType extends FieldType<FieldTypeConfig> {}
