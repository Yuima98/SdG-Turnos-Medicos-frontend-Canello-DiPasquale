import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-no-encontrada',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './no-encontrada.html',
  styleUrl: './no-encontrada.scss',
})
export class NoEncontrada {}