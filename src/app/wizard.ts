import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm } from '@ngx-formly/core';
import { Button } from '@openng/optimus-ui/button';
import { Card } from '@openng/optimus-ui/card';
import { WizardSteps } from './wizard-steps';
import { WizardConfigService } from './wizard-config.service';

@Component({
  selector: 'app-wizard',
  imports: [ReactiveFormsModule, FormlyForm, Button, Card, WizardSteps],
  template: `
    <main class="max-w-5xl mx-auto p-4 w-full">
      @if (config(); as cfg) {
        <h1 class="text-2xl font-semibold mb-6">{{ cfg.title }}</h1>
        <div class="flex flex-col md:flex-row gap-8">
          <section class="flex-1 min-w-0 order-last" aria-label="Formular">
            @if (result(); as r) {
              <p-card header="Antrag abgesendet">
                <pre class="overflow-auto text-sm mb-4">{{ r }}</pre>
                <p-button label="Neu starten" (onClick)="restart()" />
              </p-card>
            } @else {
              <form [formGroup]="form" (ngSubmit)="next()" novalidate>
                <h2 class="text-lg font-medium mb-4">{{ step().label }}</h2>
                <formly-form [form]="form" [fields]="step().fields" [model]="model()" (modelChange)="model.set($event)" />
                <div class="flex justify-between mt-4">
                  <p-button type="button" label="Zurück" severity="secondary" [disabled]="current() === 0" (onClick)="back()" />
                  <p-button type="submit" [label]="isLast() ? 'Absenden' : 'Weiter'" />
                </div>
              </form>
            }
          </section>
          <aside class="md:w-64 shrink-0 self-start rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 class="text-base font-semibold mb-4">Verlauf</h2>
            <app-wizard-steps [labels]="labels()" [current]="result() ? labels().length : current()" />
          </aside>
        </div>
      }
    </main>
  `
})
export class Wizard {
  protected readonly config = toSignal(inject(WizardConfigService).loadConfig());
  protected readonly current = signal(0);
  protected readonly model = signal<Record<string, unknown>>({});
  protected readonly result = signal<string | null>(null);
  protected form = new FormGroup({});

  protected readonly labels = computed(() => this.config()!.steps.map(s => s.label));
  protected readonly step = computed(() => this.config()!.steps[this.current()]);
  protected readonly isLast = computed(() => this.current() === this.config()!.steps.length - 1);

  protected next() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isLast()) {
      this.result.set(JSON.stringify(this.model(), null, 2));
    } else {
      this.go(this.current() + 1);
    }
  }

  protected back() {
    this.go(this.current() - 1);
  }

  protected restart() {
    this.model.set({});
    this.result.set(null);
    this.go(0);
  }

  private go(index: number) {
    this.form = new FormGroup({});
    this.current.set(index);
  }
}
