import { Component, input } from '@angular/core';

/** Panel ilustrado que acompaña a los formularios de login y registro. */
@Component({
  selector: 'app-panel-acceso',
  template: `
    <img src="ilustraciones/clinica.svg" alt="" />
    <h2>{{ titulo() }}</h2>
    <p>{{ texto() }}</p>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 380px;
      padding: 20px;
      border-radius: 18px;
      background: linear-gradient(150deg, #0b4f9e, #0b8074);
      color: #ffffff;
    }

    img {
      width: 100%;
      max-height: 32vh;
      object-fit: contain;
      border-radius: 14px;
      background: #ffffff;
    }

    h2 {
      margin: 12px 0 4px;
      font: var(--mat-sys-title-large);
    }

    p {
      margin: 0;
    }
  `,
})
export class PanelAcceso {
  readonly titulo = input.required<string>();
  readonly texto = input.required<string>();
}
