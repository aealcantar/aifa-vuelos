export interface AceptarRechazarRegistro {
  idContratoAcuerdo: number,
  idEstatus: 2 | 3 | 4,
  motivoCancelacion?: string,
  usuarioModifica: number | string
}
