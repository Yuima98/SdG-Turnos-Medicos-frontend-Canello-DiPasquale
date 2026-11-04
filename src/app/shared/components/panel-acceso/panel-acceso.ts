import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Logo } from '../logo/logo';

/** Panel de marca que acompaña a los formularios de login y registro. */
@Component({
  selector: 'app-panel-acceso',
  imports: [MatIconModule, Logo],
  template: `
    <app-logo />
    <h2>{{ titulo() }}</h2>
    <p>{{ texto() }}</p>
    <ul>
      <li><mat-icon aria-hidden="true">calendar_month</mat-icon> Turnos online</li>
      <li><mat-icon aria-hidden="true">medical_information</mat-icon> Tu historia clínica</li>
      <li><mat-icon aria-hidden="true">notifications</mat-icon> Avisos de tus turnos</li>
    </ul>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 32px;
      background: var(--sdg-petroleo-800);
      color: #ffffff;
    }

    h2 {
      margin: 20px 0 6px;
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 2rem;
    }

    p {
      margin: 0;
      color: rgb(255 255 255 / 82%);
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 24px 0 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    }

    mat-icon {
      color: #7fd6ca;
    }

    @media (max-width: 767.98px) {
      :host {
        padding: 20px;
      }

      h2 {
        margin-top: 12px;
      }

      ul {
        display: none;
      }
    }
  `,
})
export class PanelAcceso {
  readonly titulo = input.required<string>();
  readonly texto = input.required<string>();
}
