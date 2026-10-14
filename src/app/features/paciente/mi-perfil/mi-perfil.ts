import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-mi-perfil',
  imports: [MatCardModule, MatListModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.scss',
})
export class MiPerfil {
  protected readonly auth = inject(Auth);

  constructor() {
    this.auth.cargarPerfil().subscribe();
  }
}