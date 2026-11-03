import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export const PATRON_DNI = /^\d{7,8}$/;
export const PATRON_TELEFONO = /^\d{6,10}$/;

/** Los límites acompañan el tamaño de las columnas de la base. */
export const VALIDADORES_EMAIL = [Validators.required, Validators.email, Validators.maxLength(30)];
export const VALIDADORES_TELEFONO = [Validators.required, Validators.pattern(PATRON_TELEFONO)];
export const VALIDADORES_NOMBRE = [Validators.required, Validators.maxLength(30)];

/** Rechaza textos que solo tienen espacios. */
export function sinEspaciosVacios(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && !control.value.trim() ? { required: true } : null;
}

export function contrasenasIguales(grupo: AbstractControl): ValidationErrors | null {
  const password = grupo.get('password')?.value;
  const repetir = grupo.get('repetirPassword')?.value;
  return password && password !== repetir ? { noCoinciden: true } : null;
}
