export interface PersonalAutorizado {
  id?: number,
  idPerfil?: number,
  curp: string,
  nombre: string,
  paterno: string,
  materno: string,
  correo: string,
  cargo: number,
  principal: 1 | 0,
  descCargo?: string,
  indAltaGia?: boolean
}
