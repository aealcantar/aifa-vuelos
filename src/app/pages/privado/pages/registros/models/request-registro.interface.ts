export interface RequestRegistro {
  rfc: string | null,
  idTipoContrato: 0 | 1,
  refContratoAcuerdo: string | null,
  razonSocial: string | null,
  idTipoProveedor: number | null,
  fechaVigencia: string | null
  idEstatus: number | null,
}
