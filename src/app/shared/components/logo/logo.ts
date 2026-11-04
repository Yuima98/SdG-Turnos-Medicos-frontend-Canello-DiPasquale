import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#0f7c74" />
      <path d="M19 9h10v10h10v10H29v10H19V29H9V19h10z" fill="#ffffff" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
  `,
})
export class Logo {}
