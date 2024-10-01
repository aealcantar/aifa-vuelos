export interface RegistroDetalle {
  contrato: {
    idContratoAcuerdo: number,
    idProveedor: number,
    refContrato: string,
    razonSocial: string,
    rfc: string,
    tipoProveedor: string,
    siglasEmpresa: string,
    numColaboradores: number,
    numOperativos: number,
    numAdministrativos: number,
    fecInicioVigencia: string,
    fecFinVigencia: string,
    indCursoAvsec: number,
    refIndCursoAvsec: string,
    indSucursal: number,
    refIndSucursal: string,
    refGiro: string,
    refDireccion: string,
    refEstatus: string,
    idTipo: number,
    refMotivoCancelacion:  string,
  },
  personal: Personal[],
  documento: {
    id: number,
    nombre: string
  }
}

export interface Personal {
  idUsuario: number,
  cveCurp: string,
  refNombre: string,
  refPrimerApellido: string,
  refSegundoApellido: string,
  refMail: string,
  refCargo: string,
  indPrincipal: number,
  indAltaGia: boolean
}
