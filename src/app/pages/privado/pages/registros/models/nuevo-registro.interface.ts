import {PersonalAutorizado} from "./personal-autorizado.interface";

export interface NuevoRegistro {
  proveedor: {
    razonSocial: string,
    rfc: string,
    tipoProveedor: 1 | 0,
    marca: string,
    numCol: number,
    avsec: boolean,
    indSucursal: boolean,
    nombreSucursal: string,
    sigla: string
  },
  contrato: {
    fechIniVig: string,
    fechFinVig: string,
    refContratoAcuerdo: string,
    tipoContrato: number
  },
  usuario: PersonalAutorizado[],
  usuarioAlta: number
}

export interface ActualizarRegistro{
  proveedor: {
    giro: string,
    direccion:string,
    marca: string,
    numCol: number,
    numAdmin: number,
    numOperativos: number,
    avsec: boolean,
    indSucursal: boolean,
    nombreSucursal: string
  },
  usuarios: PersonalAutorizado[],
  usuarioAlta: number
}

