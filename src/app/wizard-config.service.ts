import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { WizardConfig, WizardManifest, WizardStep } from './wizard-config';

const MANIFEST_URL = 'config/wizard.json';
const STORAGE_PREFIX = 'wizard-step:';

@Injectable({ providedIn: 'root' })
export class WizardConfigService {
  private readonly http = inject(HttpClient);

  loadManifest(): Observable<WizardManifest> {
    return this.http.get<WizardManifest>(MANIFEST_URL);
  }

  /** Liefert die im Editor gespeicherte Version, sonst die Datei aus public/config. */
  loadStep(path: string): Observable<WizardStep> {
    const saved = this.readSaved(path);
    return saved ? of(saved) : this.loadOriginal(path);
  }

  loadOriginal(path: string): Observable<WizardStep> {
    return this.http.get<WizardStep>(path);
  }

  loadConfig(): Observable<WizardConfig> {
    return this.loadManifest().pipe(
      switchMap(({ title, steps }) =>
        forkJoin(steps.map(path => this.loadStep(path))).pipe(map(loaded => ({ title, steps: loaded })))
      )
    );
  }

  hasSaved(path: string): boolean {
    return this.readSaved(path) !== null;
  }

  save(path: string, step: WizardStep) {
    localStorage.setItem(STORAGE_PREFIX + path, JSON.stringify(step));
  }

  reset(path: string) {
    localStorage.removeItem(STORAGE_PREFIX + path);
  }

  private readSaved(path: string): WizardStep | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + path);
      return raw ? (JSON.parse(raw) as WizardStep) : null;
    } catch {
      return null;
    }
  }
}
