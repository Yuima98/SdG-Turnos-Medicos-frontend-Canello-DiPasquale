import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true">
      <rect width="48" height="48" rx="13" fill="#ffffff" />
      <path d="M19 8h10v11h11v10H29v11H19V29H8V19h11z" fill="#e0475b" />
      <path
        d="M7 25h11l3-6 5 13 4-9 2 2h9"
        fill="none"
        stroke="#ffffff"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
  `,
})
export class Logo {}
