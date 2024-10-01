export interface Registro {
  idContrato: number,
  refContratoAcuerdo: string,
  fechaInicioVigencia: string,
  fechaFinVigencia: string,
  estatusContrato: string,
  proveedor: {
    idProveedor: number,
    razonSocial: string,
    rfc: string,
    tipoProveedor: string,
    marcaSigla: string,
    numCol: number,
    avsec: number,
    indSucursal: number,
    nombreSucursal: string,
    refSucursal: string,
    usuarios: RegistroUsuario[]
  }
}

export interface RegistroUsuario {
  idUsuario: number,
  nombre: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  correo: string,
  principal: number
}
