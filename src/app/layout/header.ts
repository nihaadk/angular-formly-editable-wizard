import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  host: { class: 'block' },
  template: `
    <header class="bg-white text-blue-900 border-b border-gray-200 px-4 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <span class="text-xl font-semibold">SicherPlus Versicherung</span>
        <nav aria-label="Hauptnavigation" class="flex gap-6">
          <a routerLink="/" routerLinkActive="font-semibold underline" [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page">Antrag</a>
          <a routerLink="/editor" routerLinkActive="font-semibold underline" ariaCurrentWhenActive="page">Editor</a>
        </nav>
      </div>
    </header>
  `
})
export class Header {}
