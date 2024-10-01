export interface RespuestaNuevoRegistro {
  status: string,
  data: {
    contrato: any,
    usuario: RespuestaNuevoRegistroUsuario[],
    proveedor: any,
    usuarioAlta: string
  }
}

export interface RespuestaNuevoRegistroUsuario {
  cargo: string,
  correo: string,
  curp: string,
  materno: string,
  nombre: string,
  paterno: string,
  principal: 0 | 1,
  tipo: 0 | 1
}
