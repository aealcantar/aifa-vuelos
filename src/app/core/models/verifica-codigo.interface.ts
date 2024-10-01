export interface VerificaCodigo {
    token: string;
    codigo: string;
}
export interface VerificaCodigoResponse {
    msg:      string;
    caducado: boolean;
    error:    boolean;
    curp:     string;
    correo:   string;
}
export interface SolicitarReferenciaCodigoResponse{
   email: string;
   curp: string;
   nombre_completo: string;
   msg: string;
}
export interface GenerarNuevoCodigo{
    url: string;
    curp: string;
    dest: string[];
}