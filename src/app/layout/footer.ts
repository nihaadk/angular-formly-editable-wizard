import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  host: { class: 'block' },
  template: `
    <footer class="bg-white text-gray-700 border-t border-gray-200 px-4 py-4 text-sm">
      <div class="max-w-5xl mx-auto flex flex-wrap justify-between gap-2">
        <span>© SicherPlus Versicherung</span>
        <nav aria-label="Rechtliches" class="flex gap-4">
          <a href="#" class="underline">Impressum</a>
          <a href="#" class="underline">Datenschutz</a>
        </nav>
      </div>
    </footer>
  `
})
export class Footer {}
