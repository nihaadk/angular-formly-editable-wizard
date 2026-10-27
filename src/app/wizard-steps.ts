import { Component, input } from '@angular/core';

@Component({
  selector: 'app-wizard-steps',
  template: `
    <nav aria-label="Fortschritt">
      <ol class="flex flex-col gap-4">
        @for (label of labels(); track label; let i = $index) {
          <li class="flex items-center gap-3" [attr.aria-current]="i === current() ? 'step' : null">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold"
              [class.bg-blue-900]="i <= current()" [class.text-white]="i <= current()"
              [class.border-blue-900]="i <= current()" [class.border-gray-500]="i > current()">
              {{ i < current() ? '✓' : i + 1 }}
            </span>
            <span [class.font-semibold]="i === current()">{{ label }}</span>
          </li>
        }
      </ol>
    </nav>
  `
})
export class WizardSteps {
  readonly labels = input.required<string[]>();
  readonly current = input.required<number>();
}
