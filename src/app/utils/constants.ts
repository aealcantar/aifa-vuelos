import {TipoDropdown} from "../core/models/tipo-dropdown.interface";

export const PATRON_CURP: RegExp = /[A-Z]{4}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d/;
export const PATRON_CORREO: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PATRON_RFC: RegExp = /^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;

export const OPCIONES_RADIO_BUTTON: ({ name: string; key: string, value: boolean })[] = [
  {name: 'Si', key: 'Si', value: true},
  {name: 'No', key: 'No', value: false},
];


export const DIEZ_ELEMENTOS_POR_PAGINA: number = 10;


export const ESTATUS_USUARIOS: TipoDropdown[] = [
  {value: 0, label: 'Inactivo'},
  {value: 1, label: 'Activo'}
];

export const ROLES_USUARIOS: TipoDropdown[] = [
  {value: 1, label: 'Administrador GIA'},
  {value: 2, label: 'Administrador Externo'}
];

export const ROLES_USUARIOS_COMPLENTOS_PRINCIPAL: TipoDropdown[] = [
  {value: 2, label: 'Administrador Principal'},
  {value: 3, label: 'Gestor'}
];

export const ROLES_USUARIOS_COMPLENTOS_SIN_PRINCIPAL: TipoDropdown[] = [
  {value: 3, label: 'Gestor'}
];

export const CONTRATO = 1;
export const ACUERDO = 0;