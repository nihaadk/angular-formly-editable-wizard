import { ConfigOption } from '@ngx-formly/core';
import { CheckboxType } from './types/checkbox.type';
import { InputType } from './types/input.type';
import { NumberType } from './types/number.type';
import { SelectType } from './types/select.type';
import { TextareaType } from './types/textarea.type';
import { FormFieldWrapper } from './wrappers/form-field.wrapper';

export const formlyConfig: ConfigOption = {
  types: [
    { name: 'input', component: InputType, wrappers: ['form-field'] },
    { name: 'number', component: NumberType, wrappers: ['form-field'] },
    { name: 'textarea', component: TextareaType, wrappers: ['form-field'] },
    { name: 'select', component: SelectType, wrappers: ['form-field'] },
    { name: 'checkbox', component: CheckboxType, wrappers: ['form-field'] }
  ],
  wrappers: [{ name: 'form-field', component: FormFieldWrapper }]
};
