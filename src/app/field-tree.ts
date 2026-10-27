import { Component, input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

const TYPE_LABELS: Record<string, string> = {
  input: 'Eingabe',
  number: 'Zahl',
  select: 'Dropdown',
  checkbox: 'Checkbox',
  textarea: 'Textbereich'
};

@Component({
  selector: 'app-field-tree',
  template: `
    <ul class="flex flex-col gap-2" [class.ml-5]="nested()" [class.border-l]="nested()" [class.pl-3]="nested()" [class.border-gray-300]="nested()">
      @for (field of fields(); track $index) {
        <li>
          <div class="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <span class="rounded px-2 py-0.5 text-xs font-semibold"
              [class.bg-blue-100]="!field.fieldGroup" [class.text-blue-900]="!field.fieldGroup"
              [class.bg-gray-200]="field.fieldGroup" [class.text-gray-900]="field.fieldGroup">
              {{ typeLabel(field) }}
            </span>
            <span class="font-medium">{{ title(field) }}</span>
            @if (field.props?.required) { <span class="text-xs text-red-700">Pflicht</span> }
            @if (optionCount(field); as n) { <span class="text-xs text-gray-600">{{ n }} Optionen</span> }
            @if (condition(field); as c) {
              <span class="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-900">nur wenn: {{ c }}</span>
            }
          </div>
          @if (field.fieldGroup) {
            <div class="mt-2"><app-field-tree [fields]="field.fieldGroup" [nested]="true" /></div>
          }
        </li>
      }
    </ul>
  `
})
export class FieldTree {
  readonly fields = input.required<FormlyFieldConfig[]>();
  readonly nested = input(false);

  protected typeLabel(f: FormlyFieldConfig): string {
    if (f.fieldGroup) return 'Gruppe';
    return (f.type && TYPE_LABELS[f.type as string]) || String(f.type ?? 'unbekannt');
  }

  protected title(f: FormlyFieldConfig): string {
    return f.props?.label || (f.key ? String(f.key) : f.fieldGroup ? 'Feldgruppe' : '–');
  }

  protected optionCount(f: FormlyFieldConfig): number {
    const o = f.props?.options;
    return Array.isArray(o) ? o.length : 0;
  }

  protected condition(f: FormlyFieldConfig): string | null {
    const hide = f.expressions?.['hide'];
    return typeof hide === 'string' ? this.invert(hide) : null;
  }

  /** "!model.x" -> "x" ; "model.a !== 'b'" -> "a = b" */
  private invert(expr: string): string {
    const neg = expr.match(/^!\s*model\.(\w+)$/);
    if (neg) return neg[1] + ' angehakt';
    const ne = expr.match(/^model\.(\w+)\s*!==\s*'([^']*)'$/);
    if (ne) return `${ne[1]} = ${ne[2]}`;
    return 'nicht (' + expr + ')';
  }
}
