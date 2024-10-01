export interface ProveedorContratoResponse {
  contrato: Contrato;
  personal: Personal[];
  documento: Documento;
}

export interface Contrato {
  idContratoAcuerdo: number;
  idProveedor: number;
  refContrato: string;
  razonSocial: string;
  rfc: string;
  tipoProveedor: string;
  siglasEmpresa: string;
  numColaboradores: number;
  numOperativos: number;
  numAdministrativos: number;
  fecInicioVigencia: Date;
  fecFinVigencia: Date;
  indCursoAvsec: number;
  refIndCursoAvsec: string;
  indSucursal: number;
  refIndSucursal: string;
  nomSucursal?: string;
  refGiro: string;
  refDireccion: string;
  refEstatus: string;
  idTipo: number;
  refMotivoCancelacion: string;
}

export interface Documento {
  nombre: string;
}

export interface Personal {
    idUsuario:          number;
    idRol:              number;  
    cveCurp:            string;
    refNombre:          string;
    refPrimerApellido:  string;
    refSegundoApellido: string;
    refMail:            string;
    refCargo:           string;
    indPrincipal:       number;
    indAltaGia?:        boolean;
}

export interface ProveedorContratoUpdate {
  nomProveedor?: string;
  numColaboradores?: number;
  indCursoAvsec?: number;
  indSucursal?: number;
  nomSucursal?: string;
  refGiro?: string;
  refDireccion: string;
  numEmpleadosOperativos?: number;
  numEmpleadosAdministrativos?: number;
  cveUsuario?: string;
  usuarios: UsuarioUpdate[];
}

export interface UsuarioUpdate {
  idUsuario?: number;
  cveCurp?: string;
  idRol?: number;
  indActivo?: number;
  indPrincipal?: number;
  refNombre?: string;
  refCargo?: string;
  refPrimerApellido?: string;
  refSegundoApellido?: string;
  refMail?: string;
}

export interface ContratoEstatusUpdate {
  idContratoAcuerdo: number,
  idEstatus: number,
  usuarioModifica: number
}
