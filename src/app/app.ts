import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer';
import { Header } from './layout/header';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet],
  host: { class: 'flex min-h-dvh flex-col' },
  template: `
    <app-header />
    <div class="flex-1"><router-outlet /></div>
    <app-footer />
  `
})
export class App {}
