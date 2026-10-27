import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { Textarea } from '@openng/optimus-ui/textarea';

@Component({
  selector: 'app-textarea-type',
  imports: [ReactiveFormsModule, Textarea],
  template: `<textarea pTextarea class="w-full" [id]="id" [rows]="props.rows ?? 3" [formControl]="formControl"></textarea>`
})
export class TextareaType extends FieldType<FieldTypeConfig> {}
