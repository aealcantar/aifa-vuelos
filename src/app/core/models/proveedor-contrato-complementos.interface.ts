export interface ProveedorContratoUpdateResponse {
    message:  string;
    contrato: ProveedorContratoUpdateResponseContrato;
}

export interface ProveedorContratoUpdateResponseContrato {
    data: Data;
}

export interface Data {
    idProveedor:                 number;
    cveRfc:                      string;
    idTipoProveedor:             number;
    nomProveedor:                string;
    refRazonSocial:              string;
    numColaboradores:            number;
    indCursoAvsec:               number;
    indSucursal:                 number;
    refSucursal:                 string;
    refGiro:                     string;
    refDireccion:                string;
    numEmpleadosOperativos:      number;
    numEmpleadosAdministrativos: number;
    usuarios:                    Usuario[];
    contratos:                   ContratoElement[];
}

export interface ContratoElement {
    refContrato:       string;
    fecInicioVigencia: Date;
    fecFinVigencia:    Date;
    idEstatus:         number;
}

export interface Usuario {
    idUsuario:          number;
    cveCurp:            string;
    idRol:              number;
    refNombre:          string;
    refPrimerApellido:  string;
    refSegundoApellido: string;
    refMail:            string;
    refCargo:           string;
    indPrincipal:       number;
}
