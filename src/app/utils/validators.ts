import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const correosDiferentesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const nuevoCorreo = control.get('correo');
  const confirmarCorreo = control.get('confirmarCorreo');
  return nuevoCorreo && confirmarCorreo && nuevoCorreo.value === confirmarCorreo.value ? null : { correosDiferentes: true };
};

export const contrasenasDiferentesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const nuevaContrasena = control.get('contrasena');
  const confirmarContrasena = control.get('confirmarContrasena');
  return nuevaContrasena && confirmarContrasena && nuevaContrasena.value === confirmarContrasena.value ? null : { contrasenasDiferentes: true };
};
