import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-acceso-denegado',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './acceso-denegado.html',
  styleUrl: './acceso-denegado.scss',
})
export class AccesoDenegado {}