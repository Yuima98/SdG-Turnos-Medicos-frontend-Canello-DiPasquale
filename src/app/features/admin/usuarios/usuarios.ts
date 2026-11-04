import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime } from 'rxjs';
import { Pagina } from '../../../core/models/api.model';
import { UsuarioGestion } from '../../../core/models/gestion.model';
import { ETIQUETA_ROL, Rol } from '../../../core/models/usuario.model';
import { Sede } from '../../../core/models/sede.model';
import { Avisos } from '../../../core/services/avisos';
import { SedeService } from '../../../core/services/sede';
import { UsuarioService } from '../../../core/services/usuario';
import { Carga } from '../../../core/utils/carga';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';
import { Etiqueta } from '../../../shared/components/etiqueta/etiqueta';
import { UsuarioDialogo } from './usuario-dialogo';

@Component({
  selector: 'app-usuarios',
  imports: [
    ReactiveFormsModule,
    EstadoLista,
    Etiqueta,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './usuarios.html',
})
export class Usuarios {
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly usuarioService = inject(UsuarioService);
  private readonly sedeService = inject(SedeService);
  private readonly avisos = inject(Avisos);

  protected readonly etiquetaRol = ETIQUETA_ROL;
  protected readonly roles = Object.keys(ETIQUETA_ROL) as Rol[];
  protected readonly columnas = ['apellido', 'nombre', 'dni', 'email', 'rol', 'sede', 'acciones'];

  protected readonly lista = new Carga<Pagina<UsuarioGestion>>({ items: [], total: 0, pagina: 1, limite: 10 });
  protected readonly sedes = signal<Sede[]>([]);
  protected readonly pagina = signal(1);
  protected readonly limite = signal(10);

  protected readonly filtros = this.fb.nonNullable.group({
    nombre: [''],
    apellido: [''],
    rol: this.fb.control<Rol | null>(null),
    id_sede: this.fb.control<number | null>(null),
  });

  constructor() {
    this.sedeService.listar().subscribe({
      next: (sedes) => this.sedes.set(sedes),
      error: (error: unknown) => this.avisos.error(error, 'No se pudieron cargar las sedes.'),
    });

    this.filtros.valueChanges.pipe(debounceTime(300), takeUntilDestroyed()).subscribe(() => {
      this.pagina.set(1);
      this.cargar();
    });

    this.cargar();
  }

  protected asRol(rol: string): Rol {
    return rol as Rol;
  }

  cargar(): void {
    this.lista.ejecutar(
      this.usuarioService.listar({
        ...this.filtros.getRawValue(),
        pagina: this.pagina(),
        limite: this.limite(),
      }),
    );
  }

  cambiarPagina(evento: PageEvent): void {
    this.pagina.set(evento.pageIndex + 1);
    this.limite.set(evento.pageSize);
    this.cargar();
  }

  abrirFormulario(usuario?: UsuarioGestion): void {
    this.dialog
      .open(UsuarioDialogo, { data: usuario ?? null, width: '640px', maxHeight: '90vh' })
      .afterClosed()
      .subscribe((guardado) => {
        if (guardado) {
          this.avisos.exito('Se guardó el usuario.');
          this.cargar();
        }
      });
  }
}
