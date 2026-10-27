import { Component, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from '@openng/optimus-ui/button';
import { Message } from '@openng/optimus-ui/message';
import { Textarea } from '@openng/optimus-ui/textarea';
import { forkJoin, map, switchMap } from 'rxjs';
import { FieldTree } from './field-tree';
import { WizardStep } from './wizard-config';
import { WizardConfigService } from './wizard-config.service';

interface StepEntry {
  path: string;
  label: string;
}

@Component({
  selector: 'app-editor',
  imports: [ReactiveFormsModule, Button, FieldTree, Message, Textarea],
  template: `
    <main class="max-w-7xl mx-auto p-4 w-full">
      <h1 class="text-2xl font-semibold mb-6">JSON-Editor</h1>
      <div class="flex flex-col md:flex-row gap-8">
        <aside class="md:w-64 shrink-0 self-start rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 class="text-base font-semibold mb-4">Steps</h2>
          <ul class="flex flex-col gap-2">
            @for (entry of entries(); track entry.path; let i = $index) {
              <li>
                <button type="button" class="w-full text-left rounded-lg px-3 py-2 border"
                  [class.border-blue-900]="entry.path === selected()" [class.bg-blue-50]="entry.path === selected()"
                  [class.border-gray-200]="entry.path !== selected()"
                  [attr.aria-current]="entry.path === selected() ? 'true' : null"
                  (click)="select(entry.path)">
                  {{ i + 1 }}. {{ entry.label }}
                </button>
              </li>
            }
          </ul>
        </aside>

        <section class="flex-1 min-w-0" aria-label="Editor">
          @if (selected(); as path) {
            <p class="text-sm text-gray-600 mb-2">
              <code>{{ path }}</code>
              @if (modified()) { · <strong>lokal angepasst</strong> }
            </p>
            <div class="grid gap-4 lg:grid-cols-2">
              <div>
                <h2 class="text-base font-semibold mb-2">Struktur</h2>
                <div class="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  @if (fields().length) {
                    <app-field-tree [fields]="fields()" />
                  } @else {
                    <p class="text-sm text-gray-600">Keine Felder gefunden.</p>
                  }
                </div>
              </div>
              <div>
            <label for="json" class="block text-base font-semibold mb-2">JSON</label>
            <textarea pTextarea id="json" class="w-full font-mono text-sm" rows="24" spellcheck="false"
              [formControl]="text" [attr.aria-invalid]="error() !== null" aria-describedby="json-status"></textarea>
              </div>
            </div>
            <div id="json-status" class="mt-2" role="status">
              @if (error(); as e) {
                <p-message severity="error">{{ e }}</p-message>
              } @else if (savedNotice()) {
                <p-message severity="success">Gespeichert. Der Wizard verwendet jetzt diese Version.</p-message>
              }
            </div>
            <div class="flex flex-wrap gap-2 mt-4">
              <p-button label="Speichern" [disabled]="error() !== null" (onClick)="save()" />
              <p-button label="Auf Original zurücksetzen" severity="secondary" [disabled]="!modified()" (onClick)="reset()" />
              <p-button label="Formatieren" severity="secondary" [disabled]="error() !== null" (onClick)="format()" />
            </div>
          }
        </section>
      </div>
    </main>
  `
})
export class Editor {
  private readonly service = inject(WizardConfigService);

  protected readonly entries = toSignal(
    this.service.loadManifest().pipe(
      switchMap(({ steps }) =>
        forkJoin(steps.map(path => this.service.loadStep(path))).pipe(
          map(loaded => steps.map((path, i): StepEntry => ({ path, label: loaded[i].label })))
        )
      )
    ),
    { initialValue: [] as StepEntry[] }
  );
  protected readonly selected = signal<string | null>(null);
  protected readonly text = new FormControl('', { nonNullable: true });
  protected readonly error = signal<string | null>(null);
  protected readonly fields = signal<FormlyFieldConfig[]>([]);
  protected readonly modified = signal(false);
  protected readonly savedNotice = signal(false);

  constructor() {
    this.text.valueChanges.subscribe(value => {
      this.savedNotice.set(false);
      this.error.set(this.validate(value));
      this.updateFields(value);
    });
    // erste Datei automatisch öffnen, sobald die Liste geladen ist
    effect(() => {
      const first = this.entries()[0];
      if (first && untracked(() => this.selected()) === null) this.select(first.path);
    });
  }

  protected select(path: string) {
    this.selected.set(path);
    this.service.loadStep(path).subscribe(step => this.show(step, path));
  }

  protected save() {
    const path = this.selected();
    if (!path || this.error()) return;
    this.service.save(path, JSON.parse(this.text.value));
    this.modified.set(true);
    this.savedNotice.set(true);
    this.refreshLabel(path, JSON.parse(this.text.value).label);
  }

  protected reset() {
    const path = this.selected();
    if (!path) return;
    this.service.reset(path);
    this.service.loadOriginal(path).subscribe(step => {
      this.show(step, path);
      this.refreshLabel(path, step.label);
    });
  }

  protected format() {
    this.text.setValue(JSON.stringify(JSON.parse(this.text.value), null, 2));
  }

  private show(step: WizardStep, path: string) {
    this.text.setValue(JSON.stringify(step, null, 2), { emitEvent: false });
    this.error.set(null);
    this.updateFields(this.text.value);
    this.savedNotice.set(false);
    this.modified.set(this.service.hasSaved(path));
  }

  private validate(value: string): string | null {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed?.label !== 'string' || !Array.isArray(parsed?.fields)) {
        return 'Das JSON braucht ein "label" (Text) und "fields" (Liste).';
      }
      return null;
    } catch (e) {
      return 'Ungültiges JSON: ' + (e as Error).message;
    }
  }

  private refreshLabel(path: string, label: string) {
    const entry = this.entries().find(e => e.path === path);
    if (entry) entry.label = label;
  }

  /** Behält die letzte gültige Struktur, solange das JSON gerade kaputt ist. */
  private updateFields(value: string) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed?.fields)) this.fields.set(parsed.fields);
    } catch {
      // Fehler zeigt validate() an
    }
  }
}
